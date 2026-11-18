#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.env"
STATE_FILE="$SCRIPT_DIR/state.json"
BOT_SCRIPT="$SCRIPT_DIR/telegram_bot.py"
PID_FILE="$SCRIPT_DIR/bot.pid"
LOG_FILE="$SCRIPT_DIR/bot.log"

load_env() {
  if [[ -f "$CONFIG_FILE" ]]; then
    # shellcheck disable=SC1090
    source "$CONFIG_FILE"
  fi
}

in_sandbox() {
  local comm
  comm="$(cat /proc/1/comm 2>/dev/null || true)"
  [[ "$comm" != "systemd" && "$comm" != "init" ]]
}

is_running() {
  python3 - "$SCRIPT_DIR" <<'PYEOF'
import sys
sys.path.insert(0, sys.argv[1])
from hook_handler import is_bot_running

running, _ = is_bot_running()
sys.exit(0 if running else 1)
PYEOF
}

cmd_start() {
  load_env
  if [[ -z "${TELEGRAM_BOT_TOKEN:-}" ]]; then
    echo "Error: TELEGRAM_BOT_TOKEN no está configurado en $CONFIG_FILE" >&2
    echo "Ejecuta: $0 setup <BOT_TOKEN> [CHAT_ID]" >&2
    exit 1
  fi

  if in_sandbox; then
    if is_running; then
      touch "$BOT_SCRIPT"
      echo "Ejecutando dentro de sandbox: el demonio en el host está activo (PID $(cat "$PID_FILE" 2>/dev/null || echo '?')). Se solicitó hot-reload automático."
    else
      echo "Ejecutando dentro de sandbox: no se lanzan procesos efímeros aquí; hook_handler.py auto-iniciará el bot en el host."
    fi
    return 0
  fi

  if is_running; then
    echo "El bot ya está en ejecución (PID $(cat "$PID_FILE" 2>/dev/null || echo '?'))."
    return 0
  fi

  nohup python3 "$BOT_SCRIPT" >>"$LOG_FILE" 2>&1 </dev/null &
  local pid=$!
  echo "$pid" >"$PID_FILE"
  sleep 1

  if kill -0 "$pid" 2>/dev/null && is_running; then
    echo "Bot de Telegram iniciado en segundo plano (PID $pid)."
    echo "Logs: $LOG_FILE"
  else
    rm -f "$PID_FILE"
    echo "Error: el bot no pudo mantenerse en ejecución. Revisa $LOG_FILE:" >&2
    tail -n 20 "$LOG_FILE" >&2 || true
    exit 1
  fi
}

cmd_stop() {
  if in_sandbox; then
    echo "Ejecutando dentro de sandbox: no se puede detener el demonio del host desde el entorno aislado; hook_handler.py lo gestiona en el host."
    return 0
  fi

  if ! is_running && ! [[ -f "$PID_FILE" ]]; then
    echo "El bot no está en ejecución."
    return 0
  fi

  local pid
  pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -z "$pid" ]] || ! kill -0 "$pid" 2>/dev/null; then
    rm -f "$PID_FILE"
    echo "El bot no estaba activo (se limpió $PID_FILE)."
    return 0
  fi

  kill "$pid" 2>/dev/null || true
  for _ in $(seq 1 10); do
    if ! kill -0 "$pid" 2>/dev/null; then
      break
    fi
    sleep 0.5
  done

  if kill -0 "$pid" 2>/dev/null; then
    kill -9 "$pid" 2>/dev/null || true
  fi
  rm -f "$PID_FILE"
  echo "Bot detenido (PID $pid)."
}

cmd_restart() {
  if in_sandbox; then
    if is_running; then
      touch "$BOT_SCRIPT"
      echo "Ejecutando dentro de sandbox: se tocó telegram_bot.py para activar hot-reload en el demonio del host (PID $(cat "$PID_FILE" 2>/dev/null || echo '?'))."
    else
      echo "Ejecutando dentro de sandbox: no se reinicia aquí; hook_handler.py auto-iniciará el bot en el host."
    fi
    return 0
  fi
  cmd_stop
  cmd_start
}

cmd_setup() {
  local token="${1:-}"
  local chat_id="${2:-}"
  if [[ -z "$token" ]]; then
    echo "Uso: $0 setup <BOT_TOKEN> [CHAT_ID]" >&2
    exit 1
  fi

  echo "Validando token con la API de Telegram..."
  local getme_resp
  getme_resp="$(curl -fsS "https://api.telegram.org/bot${token}/getMe")" || {
    echo "Error: no se pudo validar el token contra api.telegram.org." >&2
    exit 1
  }

  local bot_username
  bot_username="$(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); assert d.get("ok"), d; print(d["result"].get("username",""))' "$getme_resp")" || {
    echo "Error: token rechazado por Telegram ($getme_resp)" >&2
    exit 1
  }

  python3 - "$SCRIPT_DIR" "$token" "$chat_id" <<'PYEOF'
import sys
from pathlib import Path

script_dir = Path(sys.argv[1])
token = sys.argv[2]
chat_id = sys.argv[3]
sys.path.insert(0, str(script_dir))
from hook_handler import save_config_value

save_config_value("TELEGRAM_BOT_TOKEN", token)
if chat_id:
    save_config_value("TELEGRAM_CHAT_ID", chat_id)
PYEOF

  echo "Token válido (@${bot_username}) guardado en $CONFIG_FILE."
  cmd_restart

  if [[ -z "$chat_id" ]]; then
    echo ""
    echo "Siguiente paso: abre @${bot_username} en tu móvil y envíale /start para vincular automáticamente tu Chat ID."
  else
    echo ""
    echo "Chat ID configurado ($chat_id). Puedes probar con: $0 test"
  fi
}

cmd_status() {
  load_env
  echo "=== Antigravity Telegram Remote Control ==="
  if is_running; then
    echo "Daemon: RUNNING (PID $(cat "$PID_FILE" 2>/dev/null || echo '?'))"
  else
    echo "Daemon: STOPPED"
  fi

  if [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]]; then
    local masked="${TELEGRAM_BOT_TOKEN:0:6}...${TELEGRAM_BOT_TOKEN: -4}"
    echo "Bot Token: configurado ($masked)"
  else
    echo "Bot Token: NO configurado"
  fi

  if [[ -n "${TELEGRAM_CHAT_ID:-}" ]]; then
    echo "Chat ID: ${TELEGRAM_CHAT_ID}"
  else
    echo "Chat ID: pendiente (envía /start al bot para auto-vincular)"
  fi

  echo "Notify on Stop: ${NOTIFY_ON_STOP:-1}"
  echo "Workspace: ${WORKSPACE_DIR:-/opt/tareas-obras}"

  if [[ -f "$STATE_FILE" ]]; then
    python3 - "$STATE_FILE" <<'PYEOF'
import json, sys
try:
    d = json.load(open(sys.argv[1], encoding="utf-8"))
    print("Active Conversation:", d.get("activeConversationId") or "(ninguna)")
    env = d.get("env") or {}
    print("IDE LS Address:", env.get("ANTIGRAVITY_LS_ADDRESS") or "(sin registrar)")
    print("Saved Conversations:", len(d.get("conversations") or {}))
except Exception as exc:
    print("State read error:", exc)
PYEOF
  else
    echo "State file: no creado todavía"
  fi
}

cmd_test() {
  load_env
  if [[ -z "${TELEGRAM_BOT_TOKEN:-}" ]] || [[ -z "${TELEGRAM_CHAT_ID:-}" ]]; then
    echo "Error: TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID deben estar configurados en $CONFIG_FILE." >&2
    exit 1
  fi

  python3 - "$SCRIPT_DIR" "${TELEGRAM_BOT_TOKEN}" "${TELEGRAM_CHAT_ID}" <<'PYEOF'
import sys
from pathlib import Path

sys.path.insert(0, sys.argv[1])
from hook_handler import send_telegram_message

ok = send_telegram_message(
    sys.argv[2],
    sys.argv[3],
    "🔔 Prueba de conexión exitosa desde Antigravity (/opt/tareas-obras).",
)
if not ok:
    sys.exit(1)
print("Mensaje de prueba enviado correctamente.")
PYEOF
}

cmd_logs() {
  if [[ -f "$LOG_FILE" ]]; then
    tail -n 50 "$LOG_FILE"
  else
    echo "No existe log todavía en $LOG_FILE."
  fi
}

usage() {
  cat <<EOF
Uso: $0 <comando>

Comandos:
  setup <BOT_TOKEN> [CHAT_ID]   Configura token (y chat_id opcional), valida e inicia el bot
  start                         Inicia el bot en segundo plano
  stop                          Detiene el bot
  restart                       Reinicia el bot
  status                        Muestra estado del daemon y configuración
  test                          Envía un mensaje de prueba al chat configurado
  logs                          Muestra las últimas 50 líneas de bot.log
EOF
}

main() {
  local cmd="${1:-}"
  shift || true
  case "$cmd" in
    setup)   cmd_setup "$@" ;;
    start)   cmd_start ;;
    stop)    cmd_stop ;;
    restart) cmd_restart ;;
    status)  cmd_status ;;
    test)    cmd_test ;;
    logs)    cmd_logs ;;
    ""|-h|--help|help) usage ;;
    *)
      echo "Comando desconocido: $cmd" >&2
      usage >&2
      exit 1
      ;;
  esac
}

main "$@"
