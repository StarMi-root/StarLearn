#!/usr/bin/env bash
set -euo pipefail

BASE="/opt/techlearn"
BACKUP="/var/backups/techlearn"
STAMP="$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP" "$BASE/shared"

CURRENT="$(readlink -f "$BASE/current")"
if [ ! -d "$CURRENT" ]; then
  echo "current release not found: $CURRENT" >&2
  exit 1
fi
CURRENT_REL="$(realpath --relative-to="$BASE" "$CURRENT")"

# -h 让 current 软链接指向的实际发布内容进入归档，而不是只备份一个链接。
tar -czhf "$BACKUP/site-$STAMP.tar.gz" \
  -C "$BASE" "$CURRENT_REL" shared

find "$BACKUP" -name 'site-*.tar.gz' -mtime +14 -delete
echo "backup complete: $BACKUP/site-$STAMP.tar.gz"
