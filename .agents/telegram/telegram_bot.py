#!/usr/bin/env python3
"""Bidirectional Telegram Remote Control bot for Antigravity."""

from __future__ import annotations

import datetime
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
    BRAIN_DIR,
    ENV_KEYS,
    load_config,
    load_state,
    save_config_value,
    send_telegram_message,
    set_active_conversation,
    telegram_api_request,
    truncate_text,
)

AGY_BIN = "/root/.local/bin/agy"
AGENTAPI_BIN = "/root/.gemini/antigravity/bin/agentapi"
CONV_TAG_RE = re.compile(r"\[Conv:\s*([A-Za-z0-9_-]+)\]")

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


def _check_ls_reachable(env_map: dict[str, str]) -> tuple[bool, str]:
    addr = env_map.get("ANTIGRAVITY_LS_ADDRESS", "").strip()
    token = env_map.get("ANTIGRAVITY_CSRF_TOKEN", "").strip()
    if not addr or not token:
        return False, "sin datos en state.json"
    if ":" not in addr:
        return False, f"dirección inválida ({addr})"
    host, port_str = addr.rsplit(":", 1)
    host = host.strip("[]") or "localhost"
    try:
        port = int(port_str)
    except ValueError:
        return False, f"puerto inválido ({addr})"
    try:
        with socket.create_connection((host, port), timeout=1.0):
            return True, addr
    except OSError:
        return False, f"inaccesible ({addr})"


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

    if BRAIN_DIR.exists():
        try:
            for entry in BRAIN_DIR.iterdir():
                if not entry.is_dir():
                    continue
                cid = entry.name
                if cid.startswith("."):
                    continue
                if cid not in merged:
                    try:
                        mtime = entry.stat().st_mtime
                        updated_at = datetime.datetime.fromtimestamp(
                            mtime, tz=datetime.timezone.utc
                        ).strftime("%Y-%m-%dT%H:%M:%SZ")
                    except OSError:
                        updated_at = ""
                    merged[cid] = {
                        "conversationId": cid,
                        "updatedAt": updated_at,
                        "lastUserInput": _read_first_user_input_from_brain(entry),
                        "source": "brain",
                    }
        except OSError:
            pass

    items = sorted(
        merged.values(),
        key=lambda item: item.get("updatedAt", ""),
        reverse=True,
    )
    return items[:limit]


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
    state = load_state()
    env_map = state.get("env") if isinstance(state.get("env"), dict) else {}
    reachable, detail = _check_ls_reachable(env_map)
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


def _snapshot_state_timestamps() -> dict[str, str]:
    state = load_state()
    convs = state.get("conversations", {})
    if not isinstance(convs, dict):
        return {}
    return {
        cid: str(info.get("updatedAt") or "")
        for cid, info in convs.items()
        if isinstance(info, dict)
    }


def _detect_updated_conversation(before_ts: dict[str, str], fallback_conv_id: str) -> str:
    state = load_state()
    convs = state.get("conversations", {})
    if isinstance(convs, dict):
        changed: list[tuple[str, str]] = []
        for cid, info in convs.items():
            if not isinstance(info, dict):
                continue
            ts = str(info.get("updatedAt") or "")
            if cid not in before_ts or ts > before_ts[cid]:
                changed.append((ts, cid))
        if changed:
            changed.sort(reverse=True)
            return changed[0][1]
        active = str(state.get("activeConversationId") or "").strip()
        if active:
            return active
    return fallback_conv_id or "cli-session"


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
    returncode = 1
    stdout = ""
    stderr = ""
    was_stopped = False

    try:
        if conv_id:
            cmd = [
                AGY_BIN,
                "--conversation",
                conv_id,
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
                fallback_cmd = [
                    AGY_BIN,
                    "-p",
                    prompt,
                    "--dangerously-skip-permissions",
                ]
                returncode, stdout, stderr, was_stopped = _run_agy_subprocess(
                    task_id, fallback_cmd, workspace
                )
                used_conv_id = ""
        else:
            cmd = [AGY_BIN, "-p", prompt, "--dangerously-skip-permissions"]
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
    return (
        "🤖 Control Remoto Antigravity (Telegram)\n\n"
        "Comandos disponibles:\n"
        "• /status — Estado actual, sesión activa, IDE LS y git status\n"
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


def _handle_status(token: str, chat_id: str, workspace: str) -> None:
    state = load_state()
    active_cid = str(state.get("activeConversationId") or "").strip() or "(ninguna)"
    env_map = state.get("env") if isinstance(state.get("env"), dict) else {}
    ls_ok, ls_detail = _check_ls_reachable(env_map)
    ls_line = f"🟢 Conectado ({ls_detail})" if ls_ok else f"🔴 No disponible ({ls_detail})"

    with TASKS_LOCK:
        active_tasks = [
            f"  • #{t['id']} [{t['label']}] desde {t['started_at']}: {t['prompt']}"
            for t in RUNNING_TASKS.values()
        ]
    tasks_text = "\n".join(active_tasks) if active_tasks else "  (ninguna)"
    git_text = truncate_text(_get_git_status(workspace), 1200)

    msg = (
        f"📊 Estado de Antigravity\n\n"
        f"📂 Workspace: {workspace}\n"
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
        {"command": "status", "description": "Estado del agente, LS y git"},
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


def main() -> int:
    _log("Starting Antigravity Telegram Remote Control bot...")
    offset: int | None = None
    commands_registered = False

    while True:
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


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        _log("Bot interrupted, exiting.")
        sys.exit(0)
