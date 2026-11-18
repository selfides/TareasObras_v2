#!/usr/bin/env python3
"""Antigravity lifecycle hook handler and shared helpers for Telegram integration."""

from __future__ import annotations

import datetime
import fcntl
import json
import os
import re
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "config.env"
STATE_PATH = BASE_DIR / "state.json"
LOCK_PATH = Path(tempfile.gettempdir()) / "antigravity-telegram-state.lock"
BRAIN_DIR = Path("/root/.gemini/antigravity/brain")

ENV_KEYS = (
    "ANTIGRAVITY_LS_ADDRESS",
    "ANTIGRAVITY_CSRF_TOKEN",
    "ANTIGRAVITY_PROJECT_ID",
    "ANTIGRAVITY_AGENTAPI_EXE",
)


def load_config(config_path: Path = CONFIG_PATH) -> dict[str, str]:
    """Load key=value pairs from config.env."""
    config: dict[str, str] = {
        "TELEGRAM_BOT_TOKEN": "",
        "TELEGRAM_CHAT_ID": "",
        "NOTIFY_ON_STOP": "1",
        "WORKSPACE_DIR": "/opt/tareas-obras",
    }
    if not config_path.exists():
        return config
    for raw_line in config_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and (
            (value.startswith('"') and value.endswith('"'))
            or (value.startswith("'") and value.endswith("'"))
        ):
            value = value[1:-1]
        config[key] = value
    return config


def save_config_value(key: str, value: str, config_path: Path = CONFIG_PATH) -> None:
    """Update or insert a key=value entry in config.env atomically."""
    lines: list[str] = []
    if config_path.exists():
        lines = config_path.read_text(encoding="utf-8").splitlines()
    escaped = value.replace('"', '\\"')
    new_line = f'{key}="{escaped}"'
    updated = False
    out_lines: list[str] = []
    pattern = re.compile(rf"^\s*{re.escape(key)}\s*=")
    for line in lines:
        if pattern.match(line):
            if not updated:
                out_lines.append(new_line)
                updated = True
        else:
            out_lines.append(line)
    if not updated:
        out_lines.append(new_line)
    content = "\n".join(out_lines) + "\n"
    _atomic_write_text(config_path, content)


def _atomic_write_text(target: Path, content: str) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=f".{target.name}.", dir=str(target.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(content)
        os.replace(tmp_name, target)
    except Exception:
        try:
            os.unlink(tmp_name)
        except OSError:
            pass
        raise


def load_state(state_path: Path = STATE_PATH) -> dict[str, Any]:
    """Read state.json safely, returning default structure if missing/corrupt."""
    default: dict[str, Any] = {
        "env": {},
        "activeConversationId": "",
        "conversations": {},
    }
    if not state_path.exists():
        return default
    try:
        data = json.loads(state_path.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            return default
        data.setdefault("env", {})
        data.setdefault("activeConversationId", "")
        data.setdefault("conversations", {})
        return data
    except Exception:
        return default


def update_state(mutator: Any, state_path: Path = STATE_PATH) -> dict[str, Any]:
    """Read-modify-write state.json under an exclusive file lock."""
    state_path.parent.mkdir(parents=True, exist_ok=True)
    with open(LOCK_PATH, "w", encoding="utf-8") as lock_fh:
        fcntl.flock(lock_fh, fcntl.LOCK_EX)
        try:
            state = load_state(state_path)
            mutator(state)
            _atomic_write_text(
                state_path, json.dumps(state, indent=2, ensure_ascii=False) + "\n"
            )
            return state
        finally:
            fcntl.flock(lock_fh, fcntl.LOCK_UN)


def set_active_conversation(conv_id: str) -> dict[str, Any]:
    """Persist activeConversationId in state.json."""
    def _mutate(state: dict[str, Any]) -> None:
        state["activeConversationId"] = conv_id

    return update_state(_mutate)


def truncate_text(text: str, max_len: int) -> str:
    """Truncate text cleanly to max_len characters."""
    text = text.strip()
    if len(text) <= max_len:
        return text
    if max_len <= 3:
        return text[:max_len]
    return text[: max_len - 3].rstrip() + "..."


def telegram_api_request(
    token: str,
    method: str,
    payload: dict[str, Any] | None = None,
    timeout: int = 15,
) -> dict[str, Any]:
    """Perform a Telegram Bot API HTTP request using stdlib urllib."""
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = None
    headers: dict[str, str] = {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def send_telegram_message(
    token: str,
    chat_id: str,
    text: str,
    reply_to_message_id: int | None = None,
    timeout: int = 10,
) -> bool:
    """Send a Telegram message, splitting cleanly if over 4096 chars."""
    if not token or not chat_id or not text:
        return False
    chunks = _split_message(text, limit=4000)
    ok = True
    for idx, chunk in enumerate(chunks):
        payload: dict[str, Any] = {
            "chat_id": chat_id,
            "text": chunk,
        }
        if idx == 0 and reply_to_message_id is not None:
            payload["reply_to_message_id"] = reply_to_message_id
        try:
            res = telegram_api_request(token, "sendMessage", payload, timeout=timeout)
            if not res.get("ok"):
                ok = False
        except urllib.error.HTTPError as exc:
            sys.stderr.write(f"[telegram-hook] HTTPError sending message: {exc.code}\n")
            ok = False
        except Exception as exc:
            sys.stderr.write(f"[telegram-hook] Error sending message: {exc}\n")
            ok = False
    return ok


def _split_message(text: str, limit: int = 4000) -> list[str]:
    if len(text) <= limit:
        return [text]
    chunks: list[str] = []
    remaining = text
    while len(remaining) > limit:
        split_at = remaining.rfind("\n", 0, limit)
        if split_at <= limit // 2:
            split_at = remaining.rfind(" ", 0, limit)
        if split_at <= 0:
            split_at = limit
        chunks.append(remaining[:split_at].rstrip())
        remaining = remaining[split_at:].lstrip()
    if remaining:
        chunks.append(remaining)
    return chunks


def extract_last_planner_response(transcript_path_str: str | None, conv_id: str) -> str:
    """Read the latest non-empty PLANNER_RESPONSE content from transcript.jsonl."""
    candidates: list[Path] = []
    if transcript_path_str:
        candidates.append(Path(transcript_path_str))
    if conv_id:
        candidates.append(BRAIN_DIR / conv_id / ".system_generated" / "logs" / "transcript.jsonl")

    transcript_path = next((p for p in candidates if p.exists()), None)
    if not transcript_path:
        return ""

    try:
        lines = transcript_path.read_text(encoding="utf-8", errors="replace").splitlines()
    except OSError:
        return ""

    for raw in reversed(lines):
        raw = raw.strip()
        if not raw:
            continue
        try:
            entry = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if entry.get("type") != "PLANNER_RESPONSE":
            continue
        content = entry.get("content")
        truncated = entry.get("truncated_fields") or []
        if "content" in truncated:
            full_path = transcript_path.parent / "transcript_full.jsonl"
            full_content = _lookup_full_transcript_content(
                full_path, entry.get("step_index")
            )
            if full_content:
                content = full_content
        if isinstance(content, str) and content.strip():
            return content.strip()
    return ""


def _lookup_full_transcript_content(full_path: Path, step_index: Any) -> str:
    if step_index is None or not full_path.exists():
        return ""
    try:
        with open(full_path, "r", encoding="utf-8", errors="replace") as fh:
            for raw in fh:
                raw = raw.strip()
                if not raw:
                    continue
                try:
                    entry = json.loads(raw)
                except json.JSONDecodeError:
                    continue
                if entry.get("step_index") == step_index:
                    content = entry.get("content")
                    if isinstance(content, str) and content.strip():
                        return content.strip()
    except OSError:
        return ""
    return ""


def record_hook_state(payload: dict[str, Any]) -> None:
    """Record Antigravity environment and conversation metadata into state.json."""
    conv_id = str(payload.get("conversationId") or "").strip()
    hook_event = str(payload.get("hookEventName") or "").strip()
    now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    def _mutate(state: dict[str, Any]) -> None:
        env_store = state.setdefault("env", {})
        for key in ENV_KEYS:
            val = os.environ.get(key, "").strip()
            if val:
                env_store[key] = val

        if conv_id:
            state["activeConversationId"] = conv_id
            conversations = state.setdefault("conversations", {})
            prev = conversations.get(conv_id) if isinstance(conversations.get(conv_id), dict) else {}
            last_input = payload.get("lastUserInput")
            if not isinstance(last_input, str) or not last_input.strip():
                last_input = prev.get("lastUserInput", "")
            transcript_path = payload.get("transcriptPath") or prev.get("transcriptPath", "")
            cwd = payload.get("cwd") or prev.get("cwd", "")
            conversations[conv_id] = {
                "conversationId": conv_id,
                "lastUserInput": last_input,
                "transcriptPath": transcript_path,
                "cwd": cwd,
                "updatedAt": now_iso,
                "lastEvent": hook_event,
            }
            # Keep at most 100 recent conversations in state.json
            if len(conversations) > 100:
                sorted_keys = sorted(
                    conversations.keys(),
                    key=lambda k: conversations[k].get("updatedAt", ""),
                    reverse=True,
                )
                for old_key in sorted_keys[100:]:
                    conversations.pop(old_key, None)

    update_state(_mutate)


def handle_stop_event(payload: dict[str, Any], config: dict[str, str]) -> None:
    """Send Telegram notification when a Stop hook fires and agent is idle."""
    if config.get("NOTIFY_ON_STOP", "1") != "1":
        return
    if os.environ.get("AGY_SKIP_STOP_HOOK_NOTIFY") == "1":
        return

    token = config.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = config.get("TELEGRAM_CHAT_ID", "").strip()
    if not token or not chat_id:
        return

    if payload.get("fullyIdle", True) is not True:
        return

    conv_id = str(payload.get("conversationId") or "desconocida").strip()
    last_user_input = str(payload.get("lastUserInput") or "").strip()
    if not last_user_input:
        state = load_state()
        last_user_input = str(
            state.get("conversations", {}).get(conv_id, {}).get("lastUserInput", "")
        ).strip()
    task_summary = truncate_text(last_user_input, 200) if last_user_input else "(sin descripción)"

    response_text = extract_last_planner_response(
        payload.get("transcriptPath"), conv_id
    )
    termination_reason = str(payload.get("terminationReason") or "").strip()
    hook_error = str(payload.get("error") or "").strip()

    if not response_text:
        if hook_error:
            response_text = f"Error: {hook_error}"
        elif termination_reason:
            response_text = f"(Finalizado con estado: {termination_reason})"
        else:
            response_text = "(Sin texto de respuesta registrado)"

    response_summary = truncate_text(response_text, 3200)
    header = "✅ Agente finalizado"
    if hook_error or termination_reason == "ERROR":
        header = "⚠️ Agente detenido con error"
    elif termination_reason == "USER_CANCELED":
        header = "🛑 Agente cancelado"

    message = (
        f"{header}\n"
        f"🆔 [Conv: {conv_id}]\n"
        f"📝 Tarea: {task_summary}\n\n"
        f"💬 Respuesta:\n"
        f"{response_summary}\n\n"
        f"↩️ Responde (Reply) a este mensaje para darle otra instrucción."
    )
    send_telegram_message(token, chat_id, message, timeout=10)


def main() -> int:
    hook_event = ""
    try:
        raw_stdin = sys.stdin.read().strip()
        payload = json.loads(raw_stdin) if raw_stdin else {}
        if not isinstance(payload, dict):
            payload = {}
    except Exception:
        payload = {}

    hook_event = str(payload.get("hookEventName") or "").strip()

    try:
        record_hook_state(payload)
        config = load_config()
        if hook_event == "Stop":
            handle_stop_event(payload, config)
    except Exception as exc:
        sys.stderr.write(f"[telegram-hook] Unexpected error: {exc}\n")

    if hook_event == "Stop":
        sys.stdout.write(json.dumps({"decision": "allow"}) + "\n")
    else:
        sys.stdout.write("{}\n")
    sys.stdout.flush()
    return 0


if __name__ == "__main__":
    sys.exit(main())
