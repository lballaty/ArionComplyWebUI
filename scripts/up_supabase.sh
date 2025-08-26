#!/usr/bin/env bash
set -euo pipefail

# 0) Ensure Colima is up
if ! colima status >/dev/null 2>&1; then
  colima start --vm-type=vz --arch aarch64 --cpu 6 --memory 16 --disk 100 -f
fi

# 1) Ensure Docker context "colima" exists and use it
if ! docker context ls --format '{{.Name}}' | grep -q '^colima$'; then
  docker context create colima --docker "host=unix://${HOME}/.colima/default/docker.sock"
fi
docker context use colima >/dev/null

# 2) Quick Docker sanity
docker info >/dev/null

# 3) Start Supabase using the VM socket (works with vz/virtiofs)
DOCKER_HOST=unix:///var/run/docker.sock supabase start

# 4) Status + container list
supabase status
docker ps --format "table {{.Names}}\t{{.Status}}" | grep supabase || echo "no supabase containers?"

