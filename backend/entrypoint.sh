#!/bin/sh

set -e

if [ $# -eq 0 ]; then
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
else
    exec "$@"
fi
