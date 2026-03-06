#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
cd "$SCRIPT_DIR"

python manage.py migrate --noinput
python manage.py collectstatic --noinput || true

PORT_VALUE="${PORT:-8000}"
exec daphne -b 0.0.0.0 -p "$PORT_VALUE" backend.asgi:application
