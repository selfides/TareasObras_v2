#!/usr/bin/env python3
"""Antigravity lifecycle hook handler and shared helpers for Telegram integration."""

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
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "config.env"
STATE_PATH = BASE_DIR / "state.json"
LOCK_PATH = Path(tempfile.gettempdir()) / "antigravity-telegram-state.lock"
BOT_SCRIPT_PATH = BASE_DIR / "telegram_bot.py"
BOT_PID_PATH = BASE_DIR / "bot.pid"
BOT_LOG_PATH = BASE_DIR / "bot.log"
BOT_LOCK_PATH = BASE_DIR / "bot.lock"
BRAIN_DIR = Path("/root/.gemini/antigravity/brain")
CLI_BRAIN_DIR = Path("/root/.gemini/antigravity-cli/brain")
BRAIN_DIRS = (BRAIN_DIR, CLI_BRAIN_DIR)

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


def is_running_in_sandbox() -> bool:
    """Return True if running inside an isolated bwrap/container PID namespace."""
    try:
        comm = Path("/proc/1/comm").read_text(encoding="utf-8", errors="replace").strip()
    except OSError:
        return True
    return comm not in ("systemd", "init")


def check_ls_reachable(env_map: dict[str, Any]) -> tuple[bool, str]:
    """Check whether the Antigravity Language Server address in env_map accepts TCP."""
    addr = str(env_map.get("ANTIGRAVITY_LS_ADDRESS") or "").strip()
    token = str(env_map.get("ANTIGRAVITY_CSRF_TOKEN") or "").strip()
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


def _parse_proc_environ(proc_dir: Path) -> dict[str, str]:
    env_map: dict[str, str] = {}
    try:
        raw = (proc_dir / "environ").read_bytes()
    except OSError:
        return env_map
    for item in raw.split(b"\x00"):
        if b"=" not in item:
            continue
        k_bytes, v_bytes = item.split(b"=", 1)
        key = k_bytes.decode("utf-8", errors="replace")
        if key in ENV_KEYS:
            val = v_bytes.decode("utf-8", errors="replace").strip()
            if val:
                env_map[key] = val
    return env_map


def _find_proc_listening_ports(proc_dir: Path) -> list[int]:
    inodes: set[str] = set()
    fd_dir = proc_dir / "fd"
    try:
        for fd_entry in fd_dir.iterdir():
            try:
                target = os.readlink(fd_entry)
            except OSError:
                continue
            if target.startswith("socket:[") and target.endswith("]"):
                inodes.add(target[8:-1])
    except OSError:
        return []

    if not inodes:
        return []

    ports: list[int] = []
    for tcp_name in ("tcp", "tcp6"):
        tcp_path = proc_dir / "net" / tcp_name
        try:
            lines = tcp_path.read_text(encoding="utf-8", errors="replace").splitlines()[1:]
        except OSError:
            continue
        for line in lines:
            parts = line.split()
            if len(parts) < 10:
                continue
            local_addr, state_hex, inode = parts[1], parts[3], parts[9]
            if state_hex != "0A" or inode not in inodes or ":" not in local_addr:
                continue
            try:
                port = int(local_addr.rsplit(":", 1)[1], 16)
            except ValueError:
                continue
            if port > 0 and port not in ports:
                ports.append(port)
    return ports


def discover_ls_env() -> dict[str, str]:
    """Discover a live Antigravity Language Server environment from os.environ or /proc."""
    os_env = {
        key: os.environ.get(key, "").strip()
        for key in ENV_KEYS
        if os.environ.get(key, "").strip()
    }
    if os_env.get("ANTIGRAVITY_LS_ADDRESS") and os_env.get("ANTIGRAVITY_CSRF_TOKEN"):
        ok, _ = check_ls_reachable(os_env)
        if ok:
            os_env.setdefault("ANTIGRAVITY_AGENTAPI_EXE", "/root/.gemini/bin/agy")
            return os_env

    if is_running_in_sandbox():
        return {}

    proc_root = Path("/proc")
    if not proc_root.exists():
        return {}

    pids: list[int] = []
    try:
        for entry in proc_root.iterdir():
            if entry.name.isdigit():
                pids.append(int(entry.name))
    except OSError:
        return {}
    pids.sort(reverse=True)

    # 1. Scan /proc/<pid>/environ for child processes carrying LS env vars.
    for pid in pids:
        proc_dir = proc_root / str(pid)
        candidate = _parse_proc_environ(proc_dir)
        if candidate.get("ANTIGRAVITY_LS_ADDRESS") and candidate.get("ANTIGRAVITY_CSRF_TOKEN"):
            ok, _ = check_ls_reachable(candidate)
            if ok:
                candidate.setdefault("ANTIGRAVITY_AGENTAPI_EXE", "/root/.gemini/bin/agy")
                return candidate

    # 2. Fallback: scan /proc/<pid>/cmdline for --csrf_token / -csrf_token on LS processes.
    for pid in pids:
        proc_dir = proc_root / str(pid)
        try:
            raw_cmd = (proc_dir / "cmdline").read_bytes()
        except OSError:
            continue
        if not raw_cmd:
            continue
        args = [
            part.decode("utf-8", errors="replace")
            for part in raw_cmd.split(b"\x00")
            if part
        ]
        csrf = ""
        for idx, arg in enumerate(args):
            if arg in ("--csrf_token", "-csrf_token") and idx + 1 < len(args):
                csrf = args[idx + 1].strip()
                break
            if arg.startswith("--csrf_token=") or arg.startswith("-csrf_token="):
                csrf = arg.split("=", 1)[1].strip()
                break
        if not csrf:
            continue

        ports = _find_proc_listening_ports(proc_dir)
        if not ports:
            continue

        chosen_port: int | None = None
        for port in ports:
            try:
                req = urllib.request.Request(
                    f"http://localhost:{port}/healthz", method="GET"
                )
                with urllib.request.urlopen(req, timeout=1.0) as resp:
                    if 200 <= resp.status < 400:
                        chosen_port = port
                        break
            except Exception:
                continue

        if chosen_port is None:
            for port in ports:
                cand = {
                    "ANTIGRAVITY_LS_ADDRESS": f"localhost:{port}",
                    "ANTIGRAVITY_CSRF_TOKEN": csrf,
                }
                if check_ls_reachable(cand)[0]:
                    chosen_port = port
                    break

        if chosen_port is not None:
            candidate = _parse_proc_environ(proc_dir)
            candidate["ANTIGRAVITY_LS_ADDRESS"] = f"localhost:{chosen_port}"
            candidate["ANTIGRAVITY_CSRF_TOKEN"] = csrf
            candidate.setdefault("ANTIGRAVITY_AGENTAPI_EXE", "/root/.gemini/bin/agy")
            return candidate

    return {}


def is_bot_running() -> tuple[bool, int | None]:
    """Check whether the Telegram bot daemon currently holds BOT_LOCK_PATH."""
    BOT_LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    lock_fh = open(BOT_LOCK_PATH, "a+", encoding="utf-8")
    try:
        try:
            fcntl.flock(lock_fh.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError as exc:
            if isinstance(exc, BlockingIOError) or exc.errno in (errno.EACCES, errno.EAGAIN):
                pid: int | None = None
                try:
                    raw = BOT_PID_PATH.read_text(encoding="utf-8").strip()
                    if raw.isdigit():
                        pid = int(raw)
                except OSError:
                    pass
                return True, pid
            raise
        fcntl.flock(lock_fh.fileno(), fcntl.LOCK_UN)
        return False, None
    finally:
        lock_fh.close()


def _terminate_unlocked_bot_processes() -> None:
    """Terminate any legacy telegram_bot.py processes not holding the daemon lock."""
    proc_root = Path("/proc")
    if not proc_root.exists():
        return
    self_pid = os.getpid()
    killed_any = False
    try:
        for entry in proc_root.iterdir():
            if not entry.name.isdigit():
                continue
            pid = int(entry.name)
            if pid == self_pid:
                continue
            try:
                raw_cmd = (entry / "cmdline").read_bytes()
            except OSError:
                continue
            if not raw_cmd:
                continue
            args = [
                part.decode("utf-8", errors="replace")
                for part in raw_cmd.split(b"\x00")
                if part
            ]
            if not args:
                continue
            exe_name = Path(args[0]).name.lower()
            if "python" not in exe_name:
                continue
            if any(
                Path(arg).name == "telegram_bot.py" or arg == str(BOT_SCRIPT_PATH)
                for arg in args[1:]
            ):
                try:
                    os.kill(pid, signal.SIGTERM)
                    killed_any = True
                except OSError:
                    pass
    except OSError:
        return
    if killed_any:
        time.sleep(0.5)


def ensure_bot_running(config: dict[str, str]) -> None:
    """Ensure telegram_bot.py daemon is running on the host."""
    if is_running_in_sandbox():
        return
    token = config.get("TELEGRAM_BOT_TOKEN", "").strip()
    if not token or not BOT_SCRIPT_PATH.exists():
        return

    running, _ = is_bot_running()
    if running:
        return

    _terminate_unlocked_bot_processes()

    BOT_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(BOT_LOG_PATH, "a", encoding="utf-8") as log_fh:
        proc = subprocess.Popen(
            [sys.executable, str(BOT_SCRIPT_PATH)],
            cwd=str(BASE_DIR),
            stdin=subprocess.DEVNULL,
            stdout=log_fh,
            stderr=subprocess.STDOUT,
            start_new_session=True,
            close_fds=True,
        )
    try:
        _atomic_write_text(BOT_PID_PATH, f"{proc.pid}\n")
    except OSError:
        pass


def extract_last_planner_response(transcript_path_str: str | None, conv_id: str) -> str:
    """Read the latest non-empty PLANNER_RESPONSE content from transcript.jsonl."""
    candidates: list[Path] = []
    if transcript_path_str:
        candidates.append(Path(transcript_path_str))
    if conv_id:
        for brain_root in BRAIN_DIRS:
            candidates.append(
                brain_root / conv_id / ".system_generated" / "logs" / "transcript.jsonl"
            )

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


def ls_rpc_request(
    env_map: dict[str, Any],
    method: str,
    payload: dict[str, Any] | None = None,
    timeout: float = 4.0,
) -> dict[str, Any] | None:
    """Call an Antigravity LanguageServerService Connect JSON RPC endpoint."""
    addr = str(env_map.get("ANTIGRAVITY_LS_ADDRESS") or "").strip()
    token = str(env_map.get("ANTIGRAVITY_CSRF_TOKEN") or "").strip()
    if not addr or not token:
        return None
    url = f"http://{addr}/exa.language_server_pb.LanguageServerService/{method}"
    data = json.dumps(payload or {}).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Connect-Protocol-Version": "1",
        "x-codeium-csrf-token": token,
    }
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status != 200:
                return None
            parsed = json.loads(resp.read().decode("utf-8"))
            return parsed if isinstance(parsed, dict) else None
    except Exception:
        return None


def _extract_client_configs(data: dict[str, Any] | None) -> list[dict[str, Any]]:
    if not isinstance(data, dict):
        return []
    for key in ("clientModelConfigs", "client_model_configs"):
        val = data.get(key)
        if isinstance(val, list):
            return [m for m in val if isinstance(m, dict)]
    for nested_key in ("cascadeModelConfigData", "cascade_model_config_data"):
        nested = data.get(nested_key)
        if isinstance(nested, dict):
            res = _extract_client_configs(nested)
            if res:
                return res
    return []


def _extract_user_tier(user_status_resp: dict[str, Any] | None) -> str:
    if not isinstance(user_status_resp, dict):
        return ""
    us = user_status_resp.get("userStatus") or user_status_resp.get("user_status")
    if not isinstance(us, dict):
        return ""
    for key in ("g1Tier", "g1_tier", "userTier", "user_tier"):
        val = us.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()
        if isinstance(val, dict):
            for sub in ("name", "displayName", "display_name", "id", "tier"):
                sval = val.get(sub)
                if isinstance(sval, str) and sval.strip():
                    return sval.strip()
    ps = us.get("planStatus") or us.get("plan_status")
    if isinstance(ps, dict):
        pi = ps.get("planInfo") or ps.get("plan_info")
        if isinstance(pi, dict):
            for sub in ("planName", "plan_name", "teamsTier", "teams_tier"):
                sval = pi.get(sub)
                if isinstance(sval, str) and sval.strip():
                    return sval.strip()
    return ""


def fetch_quota_snapshot(env_map: dict[str, Any]) -> dict[str, Any] | None:
    """Fetch per-model remaining quota percentages from the live Language Server."""
    model_cfg_resp = ls_rpc_request(env_map, "GetCascadeModelConfigData", {})
    user_status_resp = ls_rpc_request(env_map, "GetUserStatus", {})

    client_configs = _extract_client_configs(model_cfg_resp)
    if not client_configs and isinstance(user_status_resp, dict):
        us = user_status_resp.get("userStatus") or user_status_resp.get("user_status")
        if isinstance(us, dict):
            client_configs = _extract_client_configs(us)

    user_tier = _extract_user_tier(user_status_resp)
    models: list[dict[str, Any]] = []
    for m in client_configs:
        label = str(
            m.get("label")
            or m.get("displayName")
            or m.get("display_name")
            or m.get("modelId")
            or m.get("model_id")
            or ""
        ).strip()
        model_id = str(m.get("modelId") or m.get("model_id") or "").strip()
        mor = m.get("modelOrAlias") or m.get("model_or_alias")
        if not model_id and isinstance(mor, dict):
            model_id = str(mor.get("model") or mor.get("alias") or "").strip()
        disabled = bool(m.get("disabled", False))
        q = m.get("quotaInfo") or m.get("quota_info")
        if isinstance(q, dict):
            reset_time = str(q.get("resetTime") or q.get("reset_time") or "").strip()
            if "remainingFraction" in q or "remaining_fraction" in q:
                raw_frac = (
                    q.get("remainingFraction")
                    if "remainingFraction" in q
                    else q.get("remaining_fraction")
                )
                try:
                    frac = float(raw_frac if raw_frac is not None else 0.0)
                except (TypeError, ValueError):
                    frac = 0.0
            elif reset_time or disabled:
                frac = 0.0
            else:
                frac = 1.0
        else:
            reset_time = ""
            frac = 0.0 if disabled else 1.0

        frac = max(0.0, min(1.0, frac))
        remaining_pct = round(frac * 100.0, 1)
        models.append(
            {
                "label": label or model_id or "(sin nombre)",
                "modelId": model_id,
                "disabled": disabled,
                "remainingFraction": frac,
                "remainingPct": remaining_pct,
                "resetTime": reset_time,
            }
        )

    if not models:
        return None

    return {
        "updatedAt": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "userTier": user_tier,
        "models": models,
    }


def record_hook_state(payload: dict[str, Any]) -> None:
    """Record Antigravity environment and conversation metadata into state.json."""
    conv_id = str(payload.get("conversationId") or "").strip()
    hook_event = str(payload.get("hookEventName") or "").strip()
    now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    existing_state = load_state()
    existing_env = existing_state.get("env")
    if not isinstance(existing_env, dict):
        existing_env = {}
    existing_ok = check_ls_reachable(existing_env)[0]
    os_env = {
        key: os.environ.get(key, "").strip()
        for key in ENV_KEYS
        if os.environ.get(key, "").strip()
    }
    has_newer_os_env = any(os_env.get(k) != existing_env.get(k) for k in os_env)
    discovered_env: dict[str, str] = {}
    if not existing_ok or has_newer_os_env:
        discovered_env = discover_ls_env()

    effective_env: dict[str, Any] = (
        dict(discovered_env) if discovered_env else dict(existing_env)
    )
    if not discovered_env:
        effective_env.update(os_env)

    quota_snap: dict[str, Any] | None = None
    if not is_running_in_sandbox() and check_ls_reachable(effective_env)[0]:
        quota_snap = fetch_quota_snapshot(effective_env)

    def _mutate(state: dict[str, Any]) -> None:
        env_store = state.setdefault("env", {})
        if discovered_env:
            for key in ENV_KEYS:
                val = discovered_env.get(key, "").strip()
                if val:
                    env_store[key] = val
        else:
            for key, val in os_env.items():
                env_store[key] = val

        if quota_snap is not None:
            state["quotaSnapshot"] = quota_snap

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
        ensure_bot_running(config)
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
