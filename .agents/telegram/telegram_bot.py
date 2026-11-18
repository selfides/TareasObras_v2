#!/usr/bin/env python3
"""Bidirectional Telegram Remote Control bot for Antigravity."""

from __future__ import annotations

import datetime
import errno
import fcntl
import json
import os
import re
import signal
import socket
import subprocess
import sys
import threading
import time
import urllib.error
from pathlib import Path
from typing import Any

from hook_handler import (
    BOT_LOCK_PATH,
    BOT_PID_PATH,
    BRAIN_DIR,
    BRAIN_DIRS,
    CLI_BRAIN_DIR,
    ENV_KEYS,
    check_ls_reachable,
    discover_ls_env,
    fetch_quota_snapshot,
    load_config,
    load_state,
    save_config_value,
    send_telegram_message,
    set_active_conversation,
    telegram_api_request,
    truncate_text,
    update_state,
)

HOOK_SCRIPT_PATH = Path(__file__).resolve().parent / "hook_handler.py"
AGY_BIN = (
    "/root/.gemini/bin/agy"
    if Path("/root/.gemini/bin/agy").exists()
    else "/root/.local/bin/agy"
)
AGENTAPI_BIN = "/root/.gemini/antigravity/bin/agentapi"
CONV_TAG_RE = re.compile(r"\[Conv:\s*([A-Za-z0-9_-]+)\]")

DEFAULT_MODEL_ID = "gemini-pro-orchestrator-g1-pro"

# List of all available models in Antigravity: (key_number, alias, model_id, display_label, is_recommended)
MODEL_CATALOG: list[tuple[str, str, str, str, bool]] = [
    # Orchestrator
    ("1", "orchestrator", "gemini-pro-orchestrator-g1-pro", "Orchestrator (Argon)", True),
    # Gemini 4 Argon
    ("2", "argon-high", "gemini-4-argon-high", "Gemini 4 Argon (High)", False),
    ("3", "argon", "gemini-4-argon-medium", "Gemini 4 Argon (Medium)", False),
    ("4", "argon-low", "gemini-4-argon-low", "Gemini 4 Argon (Low)", False),
    # Gemini 4 Hydrogen
    ("5", "hydrogen-xhigh", "gemini-4-hydrogen-xhigh", "Gemini 4 Hydrogen (XHigh)", False),
    ("6", "hydrogen", "gemini-4-hydrogen-high", "Gemini 4 Hydrogen (High)", False),
    ("7", "hydrogen-medium", "gemini-4-hydrogen-medium", "Gemini 4 Hydrogen (Medium)", False),
    ("8", "hydrogen-low", "gemini-4-hydrogen-low", "Gemini 4 Hydrogen (Low)", False),
    # Gemini 3.8 Flash
    ("9", "flash-high", "gemini-3.8-flash-high", "Gemini 3.8 Flash (High)", False),
    ("10", "flash", "gemini-3.8-flash-medium", "Gemini 3.8 Flash (Medium)", False),
    ("11", "flash-low", "gemini-3.8-flash-low", "Gemini 3.8 Flash (Low)", False),
    # Claude Opus 5.5
    ("12", "opus", "claude-opus-5-5-high", "Claude Opus 5.5 (High)", False),
    ("13", "opus-medium", "claude-opus-5-5-medium", "Claude Opus 5.5 (Medium)", False),
    ("14", "opus-low", "claude-opus-5-5-low", "Claude Opus 5.5 (Low)", False),
    # Claude Sonnet 5.5
    ("15", "sonnet", "claude-sonnet-5-5-high", "Claude Sonnet 5.5 (High)", False),
    ("16", "sonnet-medium", "claude-sonnet-5-5-medium", "Claude Sonnet 5.5 (Medium)", False),
    ("17", "sonnet-low", "claude-sonnet-5-5-low", "Claude Sonnet 5.5 (Low)", False),
    # Open Source
    ("18", "gpt-oss", "gpt-oss-120b-medium", "GPT-OSS 120B (Medium)", False),
]

AVAILABLE_MODELS: dict[str, tuple[str, str]] = {}
for num, alias, mid, label, is_rec in MODEL_CATALOG:
    rec_text = " — Recomendado (elige subagentes automáticamente)" if is_rec else ""
    full_label = f"{label}{rec_text}"
    AVAILABLE_MODELS[num] = (mid, full_label)
    AVAILABLE_MODELS[alias] = (mid, label)
    AVAILABLE_MODELS[mid] = (mid, label)
    # Extra aliases for variants
    if alias == "argon":
        AVAILABLE_MODELS["argon-medium"] = (mid, label)
    elif alias == "hydrogen":
        AVAILABLE_MODELS["hydrogen-high"] = (mid, label)
    elif alias == "flash":
        AVAILABLE_MODELS["flash-medium"] = (mid, label)
    elif alias == "opus":
        AVAILABLE_MODELS["opus-high"] = (mid, label)
    elif alias == "sonnet":
        AVAILABLE_MODELS["sonnet-high"] = (mid, label)
    elif alias == "gpt-oss":
        AVAILABLE_MODELS["gpt-oss-120b"] = (mid, label)
        AVAILABLE_MODELS["oss"] = (mid, label)


def _get_configured_model() -> str:
    cfg = load_config()
    return cfg.get("DEFAULT_MODEL", "").strip() or DEFAULT_MODEL_ID


def _get_model_display_name(model_id: str) -> str:
    for _, (mid, label) in AVAILABLE_MODELS.items():
        if mid == model_id:
            return label.split(" — ")[0]
    return model_id

TASKS_LOCK = threading.Lock()
RUNNING_TASKS: dict[int, dict[str, Any]] = {}
TASK_SEQ = 0


def _log(msg: str) -> None:
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sys.stdout.write(f"[{ts}] {msg}\n")
    sys.stdout.flush()


def _short_id(conv_id: str) -> str:
    if not conv_id:
        return "nueva"
    return conv_id[:8]


def _get_valid_ls_env() -> tuple[bool, str, dict[str, str]]:
    state = load_state()
    env_map = state.get("env") if isinstance(state.get("env"), dict) else {}
    reachable, detail = check_ls_reachable(env_map)
    if reachable:
        return True, detail, {str(k): str(v) for k, v in env_map.items()}

    discovered = discover_ls_env()
    if discovered:
        def _mutate(st: dict[str, Any]) -> None:
            env_store = st.setdefault("env", {})
            for key in ENV_KEYS:
                val = discovered.get(key, "").strip()
                if val:
                    env_store[key] = val

        update_state(_mutate)
        reachable, detail = check_ls_reachable(discovered)
        return reachable, detail, discovered

    return False, detail, {str(k): str(v) for k, v in env_map.items()}


def _collect_recent_conversations(limit: int = 10) -> list[dict[str, str]]:
    state = load_state()
    state_convs = state.get("conversations", {})
    merged: dict[str, dict[str, str]] = {}

    if isinstance(state_convs, dict):
        for cid, info in state_convs.items():
            if not isinstance(info, dict):
                continue
            merged[cid] = {
                "conversationId": cid,
                "updatedAt": str(info.get("updatedAt") or ""),
                "lastUserInput": str(info.get("lastUserInput") or ""),
                "source": "hook",
            }

    for brain_root in BRAIN_DIRS:
        if not brain_root.exists():
            continue
        source_label = "cli-brain" if brain_root == CLI_BRAIN_DIR else "brain"
        try:
            for entry in brain_root.iterdir():
                if not entry.is_dir():
                    continue
                cid = entry.name
                if cid.startswith("."):
                    continue
                try:
                    mtime = entry.stat().st_mtime
                    updated_at = datetime.datetime.fromtimestamp(
                        mtime, tz=datetime.timezone.utc
                    ).strftime("%Y-%m-%dT%H:%M:%SZ")
                except OSError:
                    updated_at = ""
                if cid not in merged:
                    merged[cid] = {
                        "conversationId": cid,
                        "updatedAt": updated_at,
                        "lastUserInput": _read_first_user_input_from_brain(entry),
                        "source": source_label,
                    }
                else:
                    if not merged[cid].get("lastUserInput"):
                        merged[cid]["lastUserInput"] = _read_first_user_input_from_brain(entry)
                    if updated_at and updated_at > merged[cid].get("updatedAt", ""):
                        merged[cid]["updatedAt"] = updated_at
        except OSError:
            pass

    items = sorted(
        merged.values(),
        key=lambda item: item.get("updatedAt", ""),
        reverse=True,
    )
    return items[:limit]


def _find_transcript_path(conv_id: str) -> Path | None:
    candidates: list[Path] = []
    state = load_state()
    info = (state.get("conversations") or {}).get(conv_id)
    if isinstance(info, dict):
        tp = str(info.get("transcriptPath") or "").strip()
        if tp:
            tp_path = Path(tp)
            if tp_path.name == "transcript_full.jsonl":
                candidates.append(tp_path.parent / "transcript.jsonl")
            candidates.append(tp_path)
    for brain_root in BRAIN_DIRS:
        candidates.append(
            brain_root / conv_id / ".system_generated" / "logs" / "transcript.jsonl"
        )
    return next((p for p in candidates if p.exists()), None)


def _build_conversation_context(conv_id: str, max_turns: int = 6) -> str:
    transcript_path = _find_transcript_path(conv_id)
    if not transcript_path:
        return ""
    turns: list[tuple[str, str]] = []
    try:
        with open(transcript_path, "r", encoding="utf-8", errors="replace") as fh:
            for raw in fh:
                raw = raw.strip()
                if not raw:
                    continue
                try:
                    entry = json.loads(raw)
                except json.JSONDecodeError:
                    continue
                etype = entry.get("type")
                if etype not in ("USER_INPUT", "PLANNER_RESPONSE"):
                    continue
                content = entry.get("content")
                if not isinstance(content, str) or not content.strip():
                    continue
                role = "Usuario" if etype == "USER_INPUT" else "Asistente"
                turns.append((role, truncate_text(content, 600)))
    except OSError:
        return ""
    if not turns:
        return ""
    recent = turns[-max_turns:]
    lines = [
        f"[Contexto reciente de la conversación {conv_id} (continuada en sesión CLI porque la sesión IDE no estaba accesible):]"
    ]
    for role, text in recent:
        lines.append(f"{role}: {text}")
    return "\n".join(lines)


def _read_first_user_input_from_brain(conv_dir: Path) -> str:
    transcript = conv_dir / ".system_generated" / "logs" / "transcript.jsonl"
    if not transcript.exists():
        return ""
    last_input = ""
    try:
        with open(transcript, "r", encoding="utf-8", errors="replace") as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if obj.get("type") == "USER_INPUT":
                    content = obj.get("content")
                    if isinstance(content, str) and content.strip():
                        last_input = content.strip()
    except OSError:
        return ""
    return last_input


def _resolve_conversation_id(prefix_or_id: str) -> str | None:
    target = prefix_or_id.strip()
    if not target:
        return None
    convs = _collect_recent_conversations(limit=100)
    exact = [c["conversationId"] for c in convs if c["conversationId"] == target]
    if exact:
        return exact[0]
    matches = [
        c["conversationId"] for c in convs if c["conversationId"].startswith(target)
    ]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        return matches[0]
    return None


def _get_git_status(workspace: str) -> str:
    try:
        proc = subprocess.run(
            ["git", "status", "-s"],
            cwd=workspace,
            capture_output=True,
            text=True,
            timeout=5,
        )
        out = proc.stdout.strip()
        return out if out else "(limpio, sin cambios pendientes)"
    except Exception as exc:
        return f"(no disponible: {exc})"


def _try_agentapi_send(conv_id: str, text: str) -> tuple[bool, str]:
    reachable, detail, env_map = _get_valid_ls_env()
    if not reachable:
        return False, f"Language Server {detail}"

    if not Path(AGENTAPI_BIN).exists():
        return False, "agentapi no encontrado"

    child_env = os.environ.copy()
    for key in ENV_KEYS:
        val = str(env_map.get(key) or "").strip()
        if val:
            child_env[key] = val

    try:
        proc = subprocess.run(
            [AGENTAPI_BIN, "send-message", conv_id, text],
            env=child_env,
            capture_output=True,
            text=True,
            timeout=15,
        )
    except Exception as exc:
        return False, str(exc)

    combined = (proc.stdout or "") + "\n" + (proc.stderr or "")
    if proc.returncode != 0:
        return False, combined.strip() or f"exit {proc.returncode}"

    try:
        parsed = json.loads(proc.stdout.strip() or "{}")
        if isinstance(parsed, dict) and parsed.get("error"):
            return False, str(parsed["error"])
    except json.JSONDecodeError:
        pass

    return True, "delivered"


def _scan_cli_brain_mtimes() -> dict[str, float]:
    mtimes: dict[str, float] = {}
    if not CLI_BRAIN_DIR.exists():
        return mtimes
    try:
        for entry in CLI_BRAIN_DIR.iterdir():
            if not entry.is_dir() or entry.name.startswith("."):
                continue
            try:
                tp = entry / ".system_generated" / "logs" / "transcript.jsonl"
                mtime = entry.stat().st_mtime
                if tp.exists():
                    mtime = max(mtime, tp.stat().st_mtime)
                mtimes[entry.name] = mtime
            except OSError:
                continue
    except OSError:
        pass
    return mtimes


def _snapshot_state_timestamps() -> dict[str, str]:
    snap: dict[str, str] = {}
    state = load_state()
    convs = state.get("conversations", {})
    if isinstance(convs, dict):
        for cid, info in convs.items():
            if isinstance(info, dict):
                snap[f"state:{cid}"] = str(info.get("updatedAt") or "")
    for cid, mtime in _scan_cli_brain_mtimes().items():
        snap[f"cli:{cid}"] = f"{mtime:.6f}"
    return snap


def _detect_updated_conversation(before_ts: dict[str, str], fallback_conv_id: str) -> str:
    state = load_state()
    convs = state.get("conversations", {})
    if isinstance(convs, dict):
        changed: list[tuple[str, str]] = []
        for cid, info in convs.items():
            if not isinstance(info, dict):
                continue
            ts = str(info.get("updatedAt") or "")
            key = f"state:{cid}"
            if key not in before_ts or ts > before_ts[key]:
                changed.append((ts, cid))
        if changed:
            changed.sort(reverse=True)
            return changed[0][1]

    cli_changed: list[tuple[float, str]] = []
    for cid, mtime in _scan_cli_brain_mtimes().items():
        key = f"cli:{cid}"
        prev_raw = before_ts.get(key)
        prev_mtime = float(prev_raw) if prev_raw is not None else -1.0
        if key not in before_ts or mtime > prev_mtime + 1e-6:
            cli_changed.append((mtime, cid))
    if cli_changed:
        cli_changed.sort(reverse=True)
        return cli_changed[0][1]

    if fallback_conv_id:
        return fallback_conv_id
    if isinstance(convs, dict):
        active = str(state.get("activeConversationId") or "").strip()
        if active:
            return active
    return "cli-session"


def _run_agy_subprocess(
    task_id: int,
    cmd: list[str],
    workspace: str,
) -> tuple[int, str, str, bool]:
    child_env = os.environ.copy()
    child_env["AGY_SKIP_STOP_HOOK_NOTIFY"] = "1"

    proc = subprocess.Popen(
        cmd,
        cwd=workspace,
        env=child_env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        start_new_session=True,
    )
    with TASKS_LOCK:
        if task_id in RUNNING_TASKS:
            RUNNING_TASKS[task_id]["proc"] = proc

    stdout, stderr = proc.communicate()
    with TASKS_LOCK:
        was_stopped = RUNNING_TASKS.get(task_id, {}).get("stopped", False)
    return proc.returncode, stdout or "", stderr or "", was_stopped


def _execute_cli_task(
    token: str,
    chat_id: str,
    workspace: str,
    prompt: str,
    conv_id: str | None,
    mode_label: str,
    reply_to_message_id: int | None,
) -> None:
    global TASK_SEQ
    with TASKS_LOCK:
        TASK_SEQ += 1
        task_id = TASK_SEQ
        RUNNING_TASKS[task_id] = {
            "id": task_id,
            "label": mode_label,
            "prompt": truncate_text(prompt, 120),
            "conv_id": conv_id or "",
            "started_at": datetime.datetime.now().strftime("%H:%M:%S"),
            "proc": None,
            "stopped": False,
        }

    before_ts = _snapshot_state_timestamps()
    used_conv_id = conv_id or ""
    selected_model = _get_configured_model()
    returncode = 1
    stdout = ""
    stderr = ""
    was_stopped = False

    try:
        if conv_id and (CLI_BRAIN_DIR / conv_id).is_dir():
            cmd = [
                AGY_BIN,
                "--conversation",
                conv_id,
                "--model",
                selected_model,
                "-p",
                prompt,
                "--dangerously-skip-permissions",
            ]
            returncode, stdout, stderr, was_stopped = _run_agy_subprocess(
                task_id, cmd, workspace
            )
            if returncode != 0 and not was_stopped:
                _log(
                    f"Task #{task_id}: --conversation {conv_id} failed (rc={returncode}); falling back to new CLI session"
                )
                ctx = _build_conversation_context(conv_id)
                fallback_prompt = (
                    f"{ctx}\n\nNueva instrucción del usuario (desde Telegram):\n{prompt}"
                    if ctx
                    else prompt
                )
                fallback_cmd = [
                    AGY_BIN,
                    "--model",
                    selected_model,
                    "-p",
                    fallback_prompt,
                    "--dangerously-skip-permissions",
                ]
                returncode, stdout, stderr, was_stopped = _run_agy_subprocess(
                    task_id, fallback_cmd, workspace
                )
                used_conv_id = ""
        elif conv_id:
            ctx = _build_conversation_context(conv_id)
            bridged_prompt = (
                f"{ctx}\n\nNueva instrucción del usuario (desde Telegram):\n{prompt}"
                if ctx
                else prompt
            )
            cmd = [
                AGY_BIN,
                "--model",
                selected_model,
                "-p",
                bridged_prompt,
                "--dangerously-skip-permissions",
            ]
            returncode, stdout, stderr, was_stopped = _run_agy_subprocess(
                task_id, cmd, workspace
            )
            used_conv_id = ""
        else:
            cmd = [
                AGY_BIN,
                "--model",
                selected_model,
                "-p",
                prompt,
                "--dangerously-skip-permissions",
            ]
            returncode, stdout, stderr, was_stopped = _run_agy_subprocess(
                task_id, cmd, workspace
            )

        detected_cid = _detect_updated_conversation(before_ts, used_conv_id)
        if detected_cid and detected_cid != "cli-session":
            set_active_conversation(detected_cid)

        if was_stopped:
            send_telegram_message(
                token,
                chat_id,
                f"🛑 Tarea #{task_id} detenida manualmente.\n🆔 [Conv: {detected_cid}]",
                reply_to_message_id=reply_to_message_id,
            )
            return

        output_text = stdout.strip()
        err_text = stderr.strip()
        if returncode == 0:
            body = output_text or "(El agente finalizó sin salida de texto)"
            header = f"✅ Tarea #{task_id} completada ({mode_label})"
        else:
            combined_err = "\n".join(part for part in (output_text, err_text) if part)
            body = combined_err or f"El proceso terminó con código {returncode}"
            header = f"⚠️ Tarea #{task_id} terminó con código {returncode}"

        msg = (
            f"{header}\n"
            f"🆔 [Conv: {detected_cid}]\n"
            f"📝 Instrucción: {truncate_text(prompt, 200)}\n\n"
            f"💬 Respuesta:\n"
            f"{truncate_text(body, 3200)}\n\n"
            f"↩️ Responde (Reply) a este mensaje para continuar esta conversación."
        )
        send_telegram_message(
            token,
            chat_id,
            msg,
            reply_to_message_id=reply_to_message_id,
        )
    except Exception as exc:
        _log(f"Task #{task_id} exception: {exc}")
        send_telegram_message(
            token,
            chat_id,
            f"❌ Error ejecutando tarea #{task_id}: {exc}",
            reply_to_message_id=reply_to_message_id,
        )
    finally:
        with TASKS_LOCK:
            RUNNING_TASKS.pop(task_id, None)


def _route_instruction(
    token: str,
    chat_id: str,
    workspace: str,
    text: str,
    target_conv_id: str | None,
    reply_to_message_id: int | None,
    force_cli_new: bool = False,
    mode_label: str = "instrucción",
) -> None:
    if not force_cli_new and target_conv_id:
        ok, detail = _try_agentapi_send(target_conv_id, text)
        if ok:
            send_telegram_message(
                token,
                chat_id,
                (
                    f"📨 Instrucción entregada a la sesión IDE activa.\n"
                    f"🆔 [Conv: {target_conv_id}]\n"
                    f"Te enviaré una notificación automáticamente cuando termine."
                ),
                reply_to_message_id=reply_to_message_id,
            )
            return
        _log(f"agentapi send-message fallback for {target_conv_id}: {detail}")

    _execute_cli_task(
        token=token,
        chat_id=chat_id,
        workspace=workspace,
        prompt=text,
        conv_id=None if force_cli_new else target_conv_id,
        mode_label=mode_label,
        reply_to_message_id=reply_to_message_id,
    )


def _help_text() -> str:
    current_model = _get_configured_model()
    return (
        "🤖 Control Remoto Antigravity (Telegram)\n\n"
        f"🧠 Modelo activo: {_get_model_display_name(current_model)} ({current_model})\n\n"
        "Comandos disponibles:\n"
        "• /status — Estado actual, modelo, sesión activa, IDE LS y git status\n"
        "• /cuota — Ver % de cuota restante por modelo (alias: /quota)\n"
        "• /model [nombre|número] — Ver o cambiar el modelo / orquestador (alias: /models)\n"
        "• /list (o /conv) — Últimas 10 conversaciones\n"
        "• /use <id> — Seleccionar conversación activa por ID o prefijo\n"
        "• /new <instrucción> — Iniciar nueva tarea autónoma en /opt/tareas-obras\n"
        "• /goal <objetivo> — Tarea exhaustiva (verifica tests/build antes de parar)\n"
        "• /stop — Detener tareas CLI lanzadas desde Telegram\n"
        "• /help — Mostrar esta ayuda\n\n"
        "💬 Comunicación bidireccional:\n"
        "• Responde (Reply) a cualquier notificación con [Conv: ...] para continuar esa conversación.\n"
        "• Si envías texto libre sin responder a un mensaje concreto, se enviará a la conversación activa (o abrirá una nueva si no hay ninguna)."
    )


def _progress_bar(pct: float, width: int = 10) -> str:
    clamped = max(0.0, min(100.0, float(pct)))
    filled = max(0, min(width, int(round((clamped / 100.0) * width))))
    if clamped >= 50.0:
        fill_char = "🟩"
    elif clamped >= 20.0:
        fill_char = "🟨"
    else:
        fill_char = "🟥"
    return (fill_char * filled) + ("⬜" * (width - filled))


def _format_reset_time(reset_iso: str) -> str:
    raw = reset_iso.strip()
    if not raw:
        return ""
    try:
        iso_norm = raw[:-1] + "+00:00" if raw.endswith("Z") else raw
        dt = datetime.datetime.fromisoformat(iso_norm)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=datetime.timezone.utc)
        dt_utc = dt.astimezone(datetime.timezone.utc)
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        if dt_utc > now_utc:
            total_mins = max(1, int((dt_utc - now_utc).total_seconds() // 60))
            hours, mins = divmod(total_mins, 60)
            rel = f"en {hours}h {mins}m" if hours else f"en {mins}m"
            return f"{rel} ({dt_utc.strftime('%H:%M UTC')})"
        return dt_utc.strftime("%Y-%m-%d %H:%M UTC")
    except Exception:
        return raw


def _get_quota_snapshot() -> tuple[dict[str, Any] | None, bool]:
    ls_ok, _, env_map = _get_valid_ls_env()
    if ls_ok:
        snap = fetch_quota_snapshot(env_map)
        if snap:
            def _mutate(st: dict[str, Any]) -> None:
                st["quotaSnapshot"] = snap

            update_state(_mutate)
            return snap, True

    state = load_state()
    cached = state.get("quotaSnapshot")
    if isinstance(cached, dict) and cached.get("models"):
        return cached, False
    return None, False


def _match_active_model(entry: dict[str, Any], active_model_id: str) -> bool:
    mid = str(entry.get("modelId") or "").strip().lower()
    label = str(entry.get("label") or "").strip().lower()
    active_low = active_model_id.strip().lower()
    display_low = _get_model_display_name(active_model_id).strip().lower()
    if active_low and mid == active_low:
        return True
    if display_low and label == display_low:
        return True
    if display_low and (display_low in label or label in display_low):
        return True
    return False


def _find_active_model_quota(
    snap: dict[str, Any] | None, active_model_id: str
) -> dict[str, Any] | None:
    if not isinstance(snap, dict):
        return None
    models = snap.get("models")
    if not isinstance(models, list):
        return None
    for entry in models:
        if isinstance(entry, dict) and _match_active_model(entry, active_model_id):
            return entry
    return None


def _format_quota_entry(entry: dict[str, Any], is_active: bool) -> str:
    pct = float(entry.get("remainingPct", 0.0))
    if pct >= 50.0:
        icon = "🟢"
    elif pct >= 20.0:
        icon = "🟡"
    else:
        icon = "🔴"
    label = str(entry.get("label") or entry.get("modelId") or "(sin nombre)")
    star = " ⭐" if is_active else ""
    bar = _progress_bar(pct)
    line = f"{icon} {label}{star}: {pct:g}%\n   {bar}"
    reset_time = str(entry.get("resetTime") or "").strip()
    if reset_time:
        line += f"\n   ⏳ Reinicio: {_format_reset_time(reset_time)}"
    return line


def _handle_quota(
    token: str,
    chat_id: str,
    reply_to_message_id: int | None = None,
) -> None:
    snap, is_live = _get_quota_snapshot()
    if not snap or not snap.get("models"):
        send_telegram_message(
            token,
            chat_id,
            (
                "⚠️ No hay datos de cuota disponibles todavía.\n"
                "El Language Server del IDE no está accesible y no existe caché guardada."
            ),
            reply_to_message_id=reply_to_message_id,
        )
        return

    status_tag = (
        "🟢 En tiempo real"
        if is_live
        else f"🕒 Caché ({snap.get('updatedAt') or '?'})"
    )
    lines = [
        "📊 Cuota de uso de modelos (Antigravity)",
        status_tag,
    ]
    user_tier = str(snap.get("userTier") or "").strip()
    if user_tier:
        lines.append(f"🏷 Plan: {user_tier}")

    current_model = _get_configured_model()
    models = [m for m in snap.get("models", []) if isinstance(m, dict)]
    active_entries: list[dict[str, Any]] = []
    other_entries: list[dict[str, Any]] = []
    for m in models:
        if _match_active_model(m, current_model):
            active_entries.append(m)
        else:
            other_entries.append(m)

    lines.append("")
    if active_entries:
        for entry in active_entries:
            lines.append(_format_quota_entry(entry, is_active=True))
    for entry in other_entries:
        lines.append(_format_quota_entry(entry, is_active=False))

    send_telegram_message(
        token,
        chat_id,
        "\n".join(lines),
        reply_to_message_id=reply_to_message_id,
    )


def _handle_model(token: str, chat_id: str, arg: str) -> None:
    current = _get_configured_model()
    choice = arg.strip().lower()
    if not choice:
        lines = [
            f"🧠 Modelo actual: {_get_model_display_name(current)}",
            f"ID técnico: {current}\n",
            "Modelos disponibles (usa /model <número o alias>):",
            "⭐ Orquestador:",
            " 1. orchestrator — Orchestrator (Argon) 🌟",
            "\n💎 Familia Argon (Gemini 4):",
            " 2. argon-high — Gemini 4 Argon (High)",
            " 3. argon — Gemini 4 Argon (Medium)",
            " 4. argon-low — Gemini 4 Argon (Low)",
            "\n⚡ Familia Hydrogen (Gemini 4):",
            " 5. hydrogen-xhigh — Gemini 4 Hydrogen (XHigh)",
            " 6. hydrogen — Gemini 4 Hydrogen (High)",
            " 7. hydrogen-medium — Gemini 4 Hydrogen (Medium)",
            " 8. hydrogen-low — Gemini 4 Hydrogen (Low)",
            "\n🚀 Familia Flash (Gemini 3.8):",
            " 9. flash-high — Gemini 3.8 Flash (High)",
            "10. flash — Gemini 3.8 Flash (Medium)",
            "11. flash-low — Gemini 3.8 Flash (Low)",
            "\n👑 Familia Claude 5.5:",
            "12. opus — Claude Opus 5.5 (High)",
            "13. opus-medium — Claude Opus 5.5 (Medium)",
            "14. opus-low — Claude Opus 5.5 (Low)",
            "15. sonnet — Claude Sonnet 5.5 (High)",
            "16. sonnet-medium — Claude Sonnet 5.5 (Medium)",
            "17. sonnet-low — Claude Sonnet 5.5 (Low)",
            "\n🌐 Open Source:",
            "18. gpt-oss — GPT-OSS 120B (Medium)",
            "\n💡 Ejemplo: /model 10 o /model flash"
        ]
        send_telegram_message(token, chat_id, "\n".join(lines))
        return

    if choice in AVAILABLE_MODELS:
        model_id, label = AVAILABLE_MODELS[choice]
    else:
        model_id = arg.strip()
        label = _get_model_display_name(model_id)

    save_config_value("DEFAULT_MODEL", model_id)
    send_telegram_message(
        token,
        chat_id,
        f"✅ Modelo cambiado a:\n🧠 {label}\n({model_id})",
    )


def _handle_status(token: str, chat_id: str, workspace: str) -> None:
    state = load_state()
    active_cid = str(state.get("activeConversationId") or "").strip() or "(ninguna)"
    ls_ok, ls_detail, _ = _get_valid_ls_env()
    ls_line = f"🟢 Conectado ({ls_detail})" if ls_ok else f"🔴 No disponible ({ls_detail})"

    with TASKS_LOCK:
        active_tasks = [
            f"  • #{t['id']} [{t['label']}] desde {t['started_at']}: {t['prompt']}"
            for t in RUNNING_TASKS.values()
        ]
    tasks_text = "\n".join(active_tasks) if active_tasks else "  (ninguna)"
    git_text = truncate_text(_get_git_status(workspace), 1200)

    current_model = _get_configured_model()
    quota_snap, _ = _get_quota_snapshot()
    active_quota = _find_active_model_quota(quota_snap, current_model)
    quota_line = ""
    if active_quota is not None:
        pct = float(active_quota.get("remainingPct", 0.0))
        quota_line = f"🔋 Cuota modelo activo: {pct:g}%\n"

    msg = (
        f"📊 Estado de Antigravity\n\n"
        f"📂 Workspace: {workspace}\n"
        f"🧠 Modelo activo: {_get_model_display_name(current_model)} ({current_model})\n"
        f"{quota_line}"
        f"🆔 Conversación activa: {active_cid}\n"
        f"🔌 IDE Language Server: {ls_line}\n\n"
        f"⚙️ Tareas en curso (bot):\n{tasks_text}\n\n"
        f"🌿 git status -s:\n{git_text}"
    )
    send_telegram_message(token, chat_id, msg)


def _handle_list(token: str, chat_id: str) -> None:
    state = load_state()
    active_cid = str(state.get("activeConversationId") or "").strip()
    convs = _collect_recent_conversations(limit=10)
    if not convs:
        send_telegram_message(token, chat_id, "📭 No hay conversaciones registradas todavía.")
        return

    lines = ["🗂 Últimas conversaciones:"]
    for idx, conv in enumerate(convs, 1):
        cid = conv["conversationId"]
        marker = " ⭐" if cid == active_cid else ""
        ts = conv.get("updatedAt") or "?"
        prompt = truncate_text(conv.get("lastUserInput") or "(sin prompt)", 70)
        lines.append(f"{idx}. {cid[:8]}{marker} ({ts})\n   {prompt}\n   ID: {cid}")

    lines.append("\nUsa /use <id_o_prefijo> para seleccionarla como activa.")
    send_telegram_message(token, chat_id, "\n".join(lines))


def _handle_use(token: str, chat_id: str, arg: str) -> None:
    if not arg.strip():
        send_telegram_message(token, chat_id, "Uso: /use <id_o_prefijo>")
        return
    resolved = _resolve_conversation_id(arg)
    if not resolved:
        send_telegram_message(
            token,
            chat_id,
            f"❌ No encontré ninguna conversación que coincida con '{arg.strip()}'. Usa /list para ver los IDs.",
        )
        return
    set_active_conversation(resolved)
    send_telegram_message(
        token,
        chat_id,
        f"✅ Conversación activa cambiada a:\n🆔 [Conv: {resolved}]",
    )


def _handle_stop(token: str, chat_id: str) -> None:
    stopped_ids: list[int] = []
    with TASKS_LOCK:
        items = list(RUNNING_TASKS.items())
        for tid, info in items:
            info["stopped"] = True
            proc = info.get("proc")
            if proc is not None and proc.poll() is None:
                try:
                    os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
                except Exception:
                    try:
                        proc.terminate()
                    except Exception:
                        pass
                stopped_ids.append(tid)
    if stopped_ids:
        ids_str = ", ".join(f"#{i}" for i in stopped_ids)
        send_telegram_message(token, chat_id, f"🛑 Señal de detención enviada a: {ids_str}")
    else:
        send_telegram_message(token, chat_id, "ℹ️ No hay tareas CLI en ejecución iniciadas por el bot.")


def _spawn_worker(target: Any, *args: Any) -> None:
    t = threading.Thread(target=target, args=args, daemon=True)
    t.start()


def _process_message(message: dict[str, Any]) -> None:
    config = load_config()
    token = config.get("TELEGRAM_BOT_TOKEN", "").strip()
    configured_chat_id = config.get("TELEGRAM_CHAT_ID", "").strip()
    workspace = config.get("WORKSPACE_DIR", "/opt/tareas-obras").strip() or "/opt/tareas-obras"
    if not token:
        return

    chat = message.get("chat") or {}
    chat_id = str(chat.get("id") or "").strip()
    if not chat_id:
        return

    text = str(message.get("text") or "").strip()
    if not text:
        return
    message_id = message.get("message_id")

    # Parse command if starts with '/'
    cmd_name = ""
    cmd_arg = ""
    if text.startswith("/"):
        parts = text.split(None, 1)
        raw_cmd = parts[0].lower()
        cmd_name = raw_cmd.split("@", 1)[0]
        cmd_arg = parts[1].strip() if len(parts) > 1 else ""

    # Auto-pairing check
    if not configured_chat_id:
        if cmd_name == "/start":
            save_config_value("TELEGRAM_CHAT_ID", chat_id)
            _log(f"Auto-paired TELEGRAM_CHAT_ID={chat_id}")
            send_telegram_message(
                token,
                chat_id,
                f"🔗 Chat vinculado correctamente (ID: {chat_id}).\n\n{_help_text()}",
                reply_to_message_id=message_id,
            )
        else:
            send_telegram_message(
                token,
                chat_id,
                "👋 Bot sin vincular todavía. Envía /start para emparejar este chat.",
                reply_to_message_id=message_id,
            )
        return

    allowed_ids = {cid.strip() for cid in configured_chat_id.split(",") if cid.strip()}
    if chat_id not in allowed_ids:
        _log(f"Ignoring message from unauthorized chat_id={chat_id}")
        return

    if cmd_name in ("/start", "/help"):
        send_telegram_message(token, chat_id, _help_text(), reply_to_message_id=message_id)
        return
    if cmd_name == "/status":
        _handle_status(token, chat_id, workspace)
        return
    if cmd_name in ("/cuota", "/quota"):
        _handle_quota(token, chat_id, reply_to_message_id=message_id)
        return
    if cmd_name in ("/model", "/models"):
        _handle_model(token, chat_id, cmd_arg)
        return
    if cmd_name in ("/list", "/conv"):
        _handle_list(token, chat_id)
        return
    if cmd_name == "/use":
        _handle_use(token, chat_id, cmd_arg)
        return
    if cmd_name == "/stop":
        _handle_stop(token, chat_id)
        return

    if cmd_name == "/new":
        if not cmd_arg:
            send_telegram_message(token, chat_id, "Uso: /new <instrucción para el agente>")
            return
        send_telegram_message(
            token,
            chat_id,
            "⏳ Iniciando nueva tarea autónoma en /opt/tareas-obras...",
            reply_to_message_id=message_id,
        )
        _spawn_worker(
            _route_instruction,
            token,
            chat_id,
            workspace,
            cmd_arg,
            None,
            message_id,
            True,
            "nueva tarea",
        )
        return

    if cmd_name == "/goal":
        if not cmd_arg:
            send_telegram_message(token, chat_id, "Uso: /goal <objetivo a completar>")
            return
        goal_prompt = (
            "Modo /goal autónomo: Trabaja de forma exhaustiva hasta completar el objetivo "
            "por completo y verifica los resultados (ejecutando tests, compilación o comprobaciones "
            "necesarias) antes de finalizar.\n\nObjetivo:\n" + cmd_arg
        )
        send_telegram_message(
            token,
            chat_id,
            "🎯 Iniciando agente autónomo en modo /goal...",
            reply_to_message_id=message_id,
        )
        _spawn_worker(
            _route_instruction,
            token,
            chat_id,
            workspace,
            goal_prompt,
            None,
            message_id,
            True,
            "goal",
        )
        return

    if cmd_name:
        send_telegram_message(
            token,
            chat_id,
            f"❓ Comando desconocido: {cmd_name}\nUsa /help para ver los comandos.",
            reply_to_message_id=message_id,
        )
        return

    # Plain text or reply to a bot notification
    target_conv_id: str | None = None
    reply_msg = message.get("reply_to_message")
    if isinstance(reply_msg, dict):
        reply_text = str(reply_msg.get("text") or "")
        match = CONV_TAG_RE.search(reply_text)
        if match:
            target_conv_id = match.group(1).strip()

    if not target_conv_id:
        state = load_state()
        active_cid = str(state.get("activeConversationId") or "").strip()
        if active_cid:
            target_conv_id = active_cid

    short = _short_id(target_conv_id or "")
    send_telegram_message(
        token,
        chat_id,
        f"⏳ Enviando instrucción al agente ({short})...",
        reply_to_message_id=message_id,
    )
    _spawn_worker(
        _route_instruction,
        token,
        chat_id,
        workspace,
        text,
        target_conv_id,
        message_id,
        False,
        "respuesta",
    )


def _register_commands(token: str) -> None:
    commands = [
        {"command": "status", "description": "Estado del agente, modelo, LS y git"},
        {"command": "cuota", "description": "Ver % de cuota restante por modelo"},
        {"command": "model", "description": "Ver o cambiar el modelo / orquestador"},
        {"command": "models", "description": "Ver o cambiar el modelo / orquestador (alias)"},
        {"command": "list", "description": "Listar últimas conversaciones"},
        {"command": "use", "description": "Seleccionar conversación activa"},
        {"command": "new", "description": "Iniciar nueva tarea autónoma"},
        {"command": "goal", "description": "Ejecutar objetivo completo con verificación"},
        {"command": "stop", "description": "Detener tareas en ejecución"},
        {"command": "help", "description": "Mostrar ayuda"},
    ]
    try:
        telegram_api_request(token, "setMyCommands", {"commands": commands}, timeout=10)
    except Exception as exc:
        _log(f"Warning: could not setMyCommands: {exc}")


def _watched_mtimes(paths: tuple[Path, ...]) -> dict[Path, float]:
    mtimes: dict[Path, float] = {}
    for p in paths:
        try:
            mtimes[p] = p.stat().st_mtime
        except OSError:
            mtimes[p] = 0.0
    return mtimes


def main() -> int:
    BOT_LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    lock_fh = open(BOT_LOCK_PATH, "a+", encoding="utf-8")
    try:
        fcntl.flock(lock_fh.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError as exc:
        if isinstance(exc, BlockingIOError) or exc.errno in (errno.EACCES, errno.EAGAIN):
            _log("Another telegram_bot.py instance already holds bot.lock; exiting.")
            lock_fh.close()
            return 0
        lock_fh.close()
        raise

    try:
        BOT_PID_PATH.write_text(f"{os.getpid()}\n", encoding="utf-8")
    except OSError:
        pass

    bot_path = Path(__file__).resolve()
    watched_files = (bot_path, HOOK_SCRIPT_PATH)
    initial_mtimes = _watched_mtimes(watched_files)

    _log(f"Starting Antigravity Telegram Remote Control bot (PID {os.getpid()})...")
    offset: int | None = None
    commands_registered = False

    def _maybe_hot_reload() -> None:
        current_mtimes = _watched_mtimes(watched_files)
        if any(current_mtimes[p] > initial_mtimes[p] for p in watched_files):
            with TASKS_LOCK:
                no_running_tasks = len(RUNNING_TASKS) == 0
            if no_running_tasks:
                _log("Hot-reloading Telegram bot daemon after code update...")
                try:
                    fcntl.flock(lock_fh.fileno(), fcntl.LOCK_UN)
                    lock_fh.close()
                except OSError:
                    pass
                os.execv(sys.executable, [sys.executable, str(bot_path)])

    try:
        while True:
            _maybe_hot_reload()

            config = load_config()
            token = config.get("TELEGRAM_BOT_TOKEN", "").strip()
            if not token:
                _log("TELEGRAM_BOT_TOKEN is empty in config.env. Waiting 5s...")
                time.sleep(5)
                continue

            if not commands_registered:
                _register_commands(token)
                commands_registered = True

            params: dict[str, Any] = {
                "timeout": 30,
                "allowed_updates": ["message"],
            }
            if offset is not None:
                params["offset"] = offset

            try:
                resp = telegram_api_request(token, "getUpdates", params, timeout=40)
                if not resp.get("ok"):
                    _log(f"getUpdates returned not ok: {resp}")
                    time.sleep(3)
                    continue
                updates = resp.get("result") or []
                for upd in updates:
                    uid = upd.get("update_id")
                    if isinstance(uid, int):
                        offset = uid + 1
                    msg = upd.get("message")
                    if isinstance(msg, dict):
                        try:
                            _process_message(msg)
                        except Exception as exc:
                            _log(f"Error processing message: {exc}")
            except urllib.error.HTTPError as exc:
                _log(f"Telegram HTTP error {exc.code}: {exc.reason}")
                time.sleep(5)
            except Exception as exc:
                _log(f"Polling error: {exc}")
                time.sleep(5)

            _maybe_hot_reload()
    finally:
        try:
            fcntl.flock(lock_fh.fileno(), fcntl.LOCK_UN)
        except OSError:
            pass
        try:
            lock_fh.close()
        except OSError:
            pass


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        _log("Bot interrupted, exiting.")
        sys.exit(0)
