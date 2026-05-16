#!/bin/sh

# sh (Shell)
# Standard compatibility
# Minimal in Features
# Small in Size
# scripts, containers (Common Use)


# bash (Shell)
# Developer-friendly shell  (Shell)
# Rich features
# Larger in Size
# Linux dev, CI/CD (Common Use)


# ash (Shell)
# Lightweight shell (Purpose)
# Very minimal (Features)
# Tiny (Size)
# Alpine Docker (Common Use)

set -e

if [ $# -eq 0 ]; then
    # $# → number of arguments
    # -eq: equal
    # -ne: not equal
    # gt: greater than
    # lt: less than
    # ge: greater or equal to
    # le: less or equal to
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    # “Start the FastAPI app using uvicorn, expose it to the network on port 8000, reload on code changes, and replace the current container process with the server.”
else
    # This runs if
    # Docker comopse up run python
    # Then it becomes, exec python, we can do to terminal
    exec "$@"
fi

# docker compose up . It only starts services defined in docker-compose.yml


# Note: exec (very important in Docker)

# This replaces the current shell process with uvicorn

# In a container:

# without exec: uvicorn runs as a child process
# with exec: uvicorn becomes the main process

# Why this matters:

# proper signal handling (CTRL+C, shutdown)
# avoids zombie processes
# Docker lifecycle works correctly