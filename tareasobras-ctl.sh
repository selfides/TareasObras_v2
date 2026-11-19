#!/usr/bin/env bash
set -euo pipefail

API_SERVICE="tareasobras-api.service"
FRONTEND_SERVICE="tareasobras-frontend.service"
NGINX_SERVICE="nginx.service"

usage() {
  cat <<EOF
Uso: $(basename "$0") <acción> [servicio]

Acciones:
  restart [all|api|frontend|nginx]   Reinicia los servicios (por defecto: all = api + frontend)
  start   [all|api|frontend]         Inicia los servicios
  stop    [all|api|frontend]         Detiene los servicios
  status                             Muestra el estado de API, Frontend y Nginx
  logs    [api|frontend] [líneas]    Muestra los logs recientes (o en tiempo real si líneas = -f)

Ejemplos:
  $(basename "$0") restart
  $(basename "$0") restart api
  $(basename "$0") restart frontend
  $(basename "$0") status
  $(basename "$0") logs api 50
EOF
}

resolve_services() {
  local target="${1:-all}"
  case "$target" in
    all)
      echo "$API_SERVICE $FRONTEND_SERVICE"
      ;;
    api|backend)
      echo "$API_SERVICE"
      ;;
    frontend|front|web)
      echo "$FRONTEND_SERVICE"
      ;;
    nginx)
      echo "$NGINX_SERVICE"
      ;;
    *)
      echo "Servicio desconocido: $target" >&2
      usage
      exit 1
      ;;
  esac
}

run_systemctl() {
  if [ "$(id -u)" -eq 0 ]; then
    systemctl "$@"
  else
    sudo systemctl "$@"
  fi
}

CMD="${1:-}"
TARGET="${2:-all}"

case "$CMD" in
  restart|start|stop)
    SERVICES=$(resolve_services "$TARGET")
    echo "Ejecutando '$CMD' sobre: $SERVICES"
    # shellcheck disable=SC2086
    run_systemctl "$CMD" $SERVICES
    # shellcheck disable=SC2086
    run_systemctl is-active $SERVICES
    ;;
  status)
    run_systemctl status "$API_SERVICE" "$FRONTEND_SERVICE" "$NGINX_SERVICE" --no-pager -l || true
    ;;
  logs)
    SVC=$(resolve_services "${2:-api}")
    LINES="${3:-80}"
    if [ "$LINES" = "-f" ]; then
      journalctl -u "$SVC" -f
    else
      journalctl -u "$SVC" -n "$LINES" --no-pager
    fi
    ;;
  -h|--help|help|"")
    usage
    ;;
  *)
    echo "Acción desconocida: $CMD" >&2
    usage
    exit 1
    ;;
esac
