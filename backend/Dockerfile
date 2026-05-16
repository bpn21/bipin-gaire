FROM python:3.10-alpine

WORKDIR /app

# 1. Install system dependencies
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    python3-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend .

COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Difference between CMD and ENTRYPOINTC
# CMD provides the default command/
# ENTRYPOINT is also “default”, but different:
# It is the default executable

# Docker does not execute top-to-bottom like a script.

# Instead:

# It reads the whole image definition
# Then combines ENTRYPOINT + CMD at runtime

# One-line summary
# “Default” in Docker usually means CMD — the fallback arguments used when no custom command is provided.