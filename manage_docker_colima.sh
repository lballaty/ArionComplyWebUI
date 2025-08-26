#!/usr/bin/env bash
set -euo pipefail

# ---------- config ----------
# M4 MacBook Pro optimized defaults  
VM_CPU=${VM_CPU:-8}       # M4 Pro has 10-14 cores, M4 Max has 14-16 cores
VM_MEM=${VM_MEM:-20}      # GiB - M4 typically has 18GB+ unified memory
VM_DISK=${VM_DISK:-100}   # GiB
DB_HOST=127.0.0.1
DB_PORT=54322
DB_USER=postgres
DB_NAME=postgres
SUPABASE_DIR="./supabase"
REQUIRED_FILES=( "$SUPABASE_DIR/config.toml" )

# Optional enhancements (can be disabled)
ENABLE_VERSION_CHECKS=${ENABLE_VERSION_CHECKS:-true}
ENABLE_INTERACTIVE_MENU=${ENABLE_INTERACTIVE_MENU:-true}
MIN_SUPABASE_VERSION="2.30.0"
MIN_COLIMA_VERSION="0.6.0"
# ----------------------------

# Cleanup temp files on exit
trap 'rm -f /tmp/{supabase,colima,uname}_*.{log,txt} 2>/dev/null || true' EXIT

# Output functions
banner() { printf "\n============ %s ============\n" "$*"; }
ok()     { printf "✅ %s\n" "$*"; }
fail()   { printf "❌ %s\n" "$*" >&2; exit 1; }
warn()   { printf "⚠️  %s\n" "$*" >&2; }
info()   { printf "→ %s\n" "$*"; }

# Enhanced error reporting with solutions (optional)
fail_with_fix() {
  local error_msg="$1"
  local fix_cmd="$2"
  local explanation="${3:-}"
  
  printf "❌ ERROR: %s\n" "$error_msg" >&2
  [[ -n "$explanation" ]] && printf "   Reason: %s\n" "$explanation" >&2
  printf "   Fix: %s\n" "$fix_cmd" >&2
  exit 1
}

# Version comparison helper (optional)
version_compare() {
  local version1=$1 operator=$2 version2=$3
  
  # Simple string comparison approach
  # Convert to format like "002.030.001" for string comparison
  local v1_str v2_str
  v1_str=$(echo "$version1" | awk -F. '{printf "%03d.%03d.%03d", $1, $2, $3}')
  v2_str=$(echo "$version2" | awk -F. '{printf "%03d.%03d.%03d", $1, $2, $3}')
  
  case $operator in
    ">=") [[ "$v1_str" > "$v2_str" || "$v1_str" == "$v2_str" ]] ;;
    ">")  [[ "$v1_str" > "$v2_str" ]] ;;
    "<=") [[ "$v1_str" < "$v2_str" || "$v1_str" == "$v2_str" ]] ;;
    "<")  [[ "$v1_str" < "$v2_str" ]] ;;
    "==") [[ "$v1_str" == "$v2_str" ]] ;;
    *) return 1 ;;
  esac
}

# Helper function for version warnings with continue option
warn_version_and_prompt() {
  local tool="$1"
  local current_version="$2" 
  local min_version="$3"
  local upgrade_cmd="$4"
  
  warn "$tool v$current_version is outdated (recommended: >=$min_version)"
  echo "   Upgrade: $upgrade_cmd"
  echo -n "   Continue anyway? [y/N]: "
  read -r continue_choice
  case "$continue_choice" in
    [Yy]|[Yy][Ee][Ss]) 
      info "Continuing with $tool v$current_version..."
      ;;
    *)
      echo "Exiting. Please upgrade $tool and try again."
      exit 1
      ;;
  esac
}

# Version validation (optional)
check_versions() {
  banner "VERSION CHECKS"
  
  # Check Supabase CLI version
  if command -v supabase >/dev/null 2>&1; then
    local current_supabase
    current_supabase=$(supabase --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "0.0.0")
    if version_compare "$current_supabase" ">=" "$MIN_SUPABASE_VERSION"; then
      ok "Supabase CLI v$current_supabase (required: >=$MIN_SUPABASE_VERSION)"
    else
      warn_version_and_prompt "Supabase CLI" "$current_supabase" "$MIN_SUPABASE_VERSION" "brew upgrade supabase/tap/supabase"
    fi
  else
    fail_with_fix \
      "Supabase CLI not found" \
      "brew install supabase/tap/supabase" \
      "Supabase CLI is required to manage local development environment"
  fi
  
  # Check Colima version
  if command -v colima >/dev/null 2>&1; then
    local current_colima
    current_colima=$(colima version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "0.0.0")
    if version_compare "$current_colima" ">=" "$MIN_COLIMA_VERSION"; then
      ok "Colima v$current_colima (required: >=$MIN_COLIMA_VERSION)"
    else
      warn_version_and_prompt "Colima" "$current_colima" "$MIN_COLIMA_VERSION" "brew upgrade colima"
    fi
  else
    fail_with_fix \
      "Colima not found" \
      "brew install colima" \
      "Colima provides Docker runtime on macOS without Docker Desktop"
  fi
  
  # Check Docker CLI
  if command -v docker >/dev/null 2>&1; then
    local docker_version
    docker_version=$(docker --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
    ok "Docker CLI v$docker_version"
  else
    fail_with_fix \
      "Docker CLI not found" \
      "brew install docker" \
      "Docker CLI is needed to communicate with Colima's Docker daemon"
  fi
}

# --- Safety: DOCKER_HOST must NOT be set globally ---
if [[ -n "${DOCKER_HOST:-}" ]]; then
  echo "❌ ERROR: DOCKER_HOST is globally set to '${DOCKER_HOST}'. This bypasses Docker contexts and breaks Supabase."
  echo "🔎 Searching dotfiles for DOCKER_HOST..."
  found=false
  for f in ~/.zshrc ~/.bashrc ~/.bash_profile ~/.profile ~/.zprofile; do
    [[ -f "$f" ]] || continue
    if grep -n "DOCKER_HOST" "$f"; then
      echo "   ↳ Found in: $f"
      found=true
    fi
  done
  [[ "$found" == false ]] && echo "   Not found in common rc files; it may be set in the current shell."
  echo "👉 Fix: remove/comment the export, reload shell (e.g., 'source ~/.zshrc'), then re-run."
  exit 1
fi

# --- Core management functions (preserving original logic) ---
check_supabase_init() {
  [[ -d "$SUPABASE_DIR" ]] || fail "Supabase not initialized (missing $SUPABASE_DIR). Run: supabase init"
  [[ -f "$SUPABASE_DIR/config.toml" ]] || fail "Missing $SUPABASE_DIR/config.toml. Run: supabase init"
  ok "Supabase initialized"
}

need_files() {
  local missing=0
  for f in "${REQUIRED_FILES[@]}"; do
    [[ -f "$f" ]] && ok "Found $f" || { warn "Missing: $f"; missing=1; }
  done
  [[ $missing -eq 0 ]] || fail "Supabase project not initialized correctly."
}

ensure_colima() {
  if ! colima status >/dev/null 2>&1; then
    info "Starting Colima (vz aarch64 ${VM_CPU}CPU/${VM_MEM}GiB/${VM_DISK}GiB)…"
    colima start --vm-type=vz --arch aarch64 --cpu "$VM_CPU" --memory "$VM_MEM" --disk "$VM_DISK" --mount-type virtiofs
  else
    ok "Colima already running"
  fi
}

ensure_context() {
  if ! docker context ls --format '{{.Name}}' | grep -q '^colima$'; then
    docker context create colima --docker "host=unix://${HOME}/.colima/default/docker.sock" >/dev/null
  fi
  docker context use colima >/dev/null
}

start_supabase() {
  need_files
  info "Starting Supabase…"
  DOCKER_HOST=unix:///var/run/docker.sock supabase start >/tmp/supabase_start.log 2>&1 || {
    echo "--- supabase start log (tail) ---"; tail -n 120 /tmp/supabase_start.log; echo "---------------------------------"
    fail "Supabase failed to start"
  }
}

stop_supabase() {
  info "Stopping Supabase…"
  supabase stop >/tmp/supabase_stop.log 2>&1 || true
}

stop_colima() {
  info "Stopping Colima…"
  colima stop >/dev/null 2>&1 || true
}

# --- Health check functions (preserving original logic) ---
health_colima() {
  banner "COLIMA"
  if colima status >/tmp/colima_status.txt 2>/dev/null; then
    local rt mt
    rt=$(awk '/runtime:/ {print $2}' /tmp/colima_status.txt)
    mt=$(awk '/mountType/ {print $2}' /tmp/colima_status.txt)
    ok "Running (runtime=$rt, mountType=$mt)"
  else
    warn "Not running"
  fi
}

health_docker() {
  banner "DOCKER"
  if docker info >/dev/null 2>&1; then
    local ctx
    ctx=$(docker context ls --format '{{if .Current}}*{{end}}{{.Name}}' | sed -n 's/^\*//p')
    [[ "$ctx" == "colima" ]] && ok "Context=colima" || warn "Context=$ctx"
    docker run --rm --pull never alpine uname -m >/tmp/uname_arch 2>/dev/null || docker run --rm alpine uname -m >/tmp/uname_arch
    ok "Arch=$(cat /tmp/uname_arch 2>/dev/null || echo '?')"
  else
    fail "Docker daemon not reachable"
  fi
}

health_supabase() {
  banner "SUPABASE"
  if docker ps --format '{{.Names}}' | grep -q '^supabase_'; then
    local cnt; cnt=$(docker ps --format '{{.Names}}' | grep -c '^supabase_')
    ok "Containers running ($cnt)"
  else
    warn "No Supabase containers"
  fi
  if supabase status >/tmp/supabase_status.txt 2>/dev/null; then
    ok "Status accessible"
    grep -E 'API URL|DB URL|anon key|service_role key' -i /tmp/supabase_status.txt || true
  else
    warn "supabase status failed"
  fi
}

# ORIGINAL health_db logic - tries default password FIRST
health_db() {
  banner "POSTGRES"
  if ! command -v psql >/dev/null 2>&1; then
    warn "psql not found (brew install libpq; add to PATH)"; return
  fi
  if PGPASSWORD=postgres psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "select 1" >/dev/null 2>&1; then
    warn "Default DB password in use ('postgres'). Change in supabase/config.toml."
  else
    local pass
    pass=$(awk -F= '/^\[db\]/{f=1} f && /password/ {gsub(/[ "]/,"",$2);print $2;exit}' "$SUPABASE_DIR/config.toml" 2>/dev/null || true)
    if [[ -n "${pass:-}" ]]; then
      PGPASSWORD="$pass" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "select 1" >/dev/null 2>&1 \
        && ok "Reachable with custom password" || fail "DB not reachable with configured password"
    else
      warn "DB password not detected; skipping password check"
    fi
  fi
}

# Display service URLs clearly
show_service_urls() {
  banner "SERVICE URLS"
  
  if [[ -f /tmp/supabase_status.txt ]]; then
    echo "🌐 Web Interfaces:"
    echo "   Supabase Studio: http://127.0.0.1:54323"
    echo ""
    echo "🔌 API Endpoints:"
    grep -i "API URL" /tmp/supabase_status.txt | sed 's/^/   /'
    echo ""
    echo "🗄️  Database:"
    grep -i "DB URL" /tmp/supabase_status.txt | sed 's/^/   /'
    echo ""
    echo "🔑 Keys:"
    grep -i "anon key\|service_role key" /tmp/supabase_status.txt | sed 's/^/   /'
  else
    warn "Service URLs not available - run supabase status first"
  fi
}

# Test API endpoints
test_api_endpoints() {
  banner "API TESTS"
  
  # Get the anon key from supabase status
  local anon_key
  anon_key=$(grep -i "anon key" /tmp/supabase_status.txt 2>/dev/null | awk '{print $NF}' || echo "")
  
  if [[ -n "$anon_key" ]]; then
    # Test REST API
    if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:54321/rest/v1/" -H "apikey: $anon_key" | grep -q "200\|404"; then
      ok "REST API responsive (http://127.0.0.1:54321)"
    else
      warn "REST API not responding"
    fi
    
    # Test Auth API  
    if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:54321/auth/v1/settings" -H "apikey: $anon_key" | grep -q "200"; then
      ok "Auth API responsive"
    else
      warn "Auth API not responding"
    fi
  else
    warn "Cannot test APIs - anon key not found"
  fi
}

# Test database connection comprehensively
test_database_connection() {
  banner "DATABASE CONNECTION TESTS"
  
  if ! command -v psql >/dev/null 2>&1; then
    warn "psql not found - install with: brew install libpq"
    return
  fi
  
  # Test with default password
  if PGPASSWORD=postgres psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\l" >/dev/null 2>&1; then
    ok "Database connection successful (default password)"
    
    # Get database info
    local db_info
    db_info=$(PGPASSWORD=postgres psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT version();" 2>/dev/null | xargs)
    ok "PostgreSQL: $db_info"
    
    # Test schemas
    local schema_count
    schema_count=$(PGPASSWORD=postgres psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM information_schema.schemata;" 2>/dev/null | xargs)
    ok "Database schemas: $schema_count"
  else
    warn "Database connection failed"
  fi
}

# Detailed container status
detailed_container_status() {
  banner "CONTAINER DETAILS"
  
  if docker ps --format '{{.Names}}' | grep -q '^supabase_'; then
    echo "📦 Running Containers:"
    docker ps --filter "name=supabase_" --format "   ✅ {{.Names}} ({{.Status}})"
    
    echo ""
    echo "💾 Container Resources:"
    #//docker stats --no-stream --filter "name=supabase_" --format "   {{.Name}}: CPU {{.CPUPerc}} | Memory {{.MemUsage}}"
    docker stats --no-stream $(docker ps --filter "name=supabase_" --format "{{.Names}}") --format "   {{.Name}}: CPU {{.CPUPerc}} | Memory {{.MemUsage}}" 2>/dev/null || echo "   Resource info unavailable"
  else
    warn "No Supabase containers running"
  fi
}

# Comprehensive status check
status_all() {
  # Version checks removed from status_all to avoid duplicates
  # (versions are checked at command start instead)
  
  banner "STATUS"
  health_colima
  health_docker
  detailed_container_status
  health_supabase
  health_db
  test_database_connection
  show_service_urls
  test_api_endpoints

  banner "SUMMARY"
  echo "OK if: Colima running, Docker context=colima, Supabase containers present, DB reachable."
}

# --- Interactive menu system (optional) ---
show_menu() {
  echo
  echo "=========================================="
  echo "  Supabase/Colima Development Manager"
  echo "=========================================="
  echo
  echo "Select an option:"
  echo "  1) Start everything (Colima + Supabase)"
  echo "  2) Stop everything"
  echo "  3) Status/Health check"
  echo "  4) Start Colima only"
  echo "  5) Stop Colima only"
  echo "  6) Start Supabase only"
  echo "  7) Stop Supabase only"
  echo "  8) Restart everything"
  echo "  9) Restart Supabase only"
  echo "  0) Exit"
  echo
  echo -n "Enter your choice [0-9]: "
}

interactive_menu() {
  
    show_menu
    read -r choice
    
    case $choice in
      1)
        banner "START ALL"
        if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
        check_supabase_init; ensure_colima; ensure_context; start_supabase; status_all;;
      2)
        banner "STOP ALL"
        stop_supabase; stop_colima; status_all;;
      3)
        status_all;;
      4)
        banner "START COLIMA"
        if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
        ensure_colima; ensure_context; status_all;;
      5)
        banner "STOP COLIMA"
        stop_colima; status_all;;
      6)
        banner "START SUPABASE"
        if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
        check_supabase_init; start_supabase; status_all;;
      7)
        banner "STOP SUPABASE"
        stop_supabase; status_all;;
      8)
        banner "RESTART ALL"
        if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
        stop_supabase || true; stop_colima || true
        ensure_colima; ensure_context; start_supabase; status_all;;
      9)
        banner "RESTART SUPABASE"
        if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
        stop_supabase || true; start_supabase; status_all;;
      0)
        echo "Goodbye!"
        exit 0 ;;
      *)
        echo "Invalid choice. Please enter a number between 0-9."
        echo "Press Enter to continue..."; read -r ;;
    esac
}

# --- Command dispatcher ---
case "${1:-}" in
  start)
    banner "START ALL"
    if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
    check_supabase_init; ensure_colima; ensure_context; start_supabase; status_all ;;
  start-colima)
    banner "START COLIMA"
    if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
    ensure_colima; ensure_context; status_all ;;
  start-supabase)
    banner "START SUPABASE"
    if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
    check_supabase_init; start_supabase; status_all ;;
  stop)
    banner "STOP ALL"
    stop_supabase; stop_colima; status_all ;;
  stop-colima)
    banner "STOP COLIMA"
    stop_colima; status_all ;;
  stop-supabase)
    banner "STOP SUPABASE"
    stop_supabase; status_all ;;
  restart-all)
    banner "RESTART ALL"
    if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
    stop_supabase || true; stop_colima || true
    ensure_colima; ensure_context; start_supabase; status_all ;;
  restart-supabase)
    banner "RESTART SUPABASE"
    if [[ "$ENABLE_VERSION_CHECKS" == "true" ]]; then check_versions; fi
    stop_supabase || true; start_supabase; status_all ;;
  status|health)
    status_all ;;
  menu|interactive)
    if [[ "$ENABLE_INTERACTIVE_MENU" == "true" ]]; then
      interactive_menu
    else
      echo "Interactive menu disabled. Use ENABLE_INTERACTIVE_MENU=true to enable."
      status_all
    fi ;;
  "")
    # Default behavior - interactive menu if enabled, otherwise status
    if [[ "$ENABLE_INTERACTIVE_MENU" == "true" ]]; then
      info "No command provided, starting interactive menu..."
      interactive_menu
    else
      info "No command provided, running status check..."
      status_all
    fi ;;
  *)
    SCRIPT_NAME=$(basename "$0")
    cat <<USAGE
$SCRIPT_NAME - Supabase/Colima Development Environment Manager

USAGE:
  $SCRIPT_NAME COMMAND

COMMANDS:
  start               Start Colima+Supabase, then run health checks
  stop                Stop Colima+Supabase, then run health checks
  status              Run health checks only
  start-colima        Start Colima only, then run health checks
  stop-colima         Stop Colima only, then run health checks
  start-supabase      Start Supabase only, then run health checks
  stop-supabase       Stop Supabase only, then run health checks
  restart-all         Restart Colima+Supabase, then run health checks
  restart-supabase    Restart Supabase only, then run health checks
  menu                Show interactive menu (if enabled)

CONFIGURATION:
  VM_CPU=$VM_CPU              # Colima CPU cores (M4 optimized: 8+)
  VM_MEM=$VM_MEM               # Colima memory in GiB (M4 optimized: 20+)
  VM_DISK=$VM_DISK            # Colima disk in GiB
  
OPTIONAL FEATURES (set to false to disable):
  ENABLE_VERSION_CHECKS=$ENABLE_VERSION_CHECKS     # Version validation before operations
  ENABLE_INTERACTIVE_MENU=$ENABLE_INTERACTIVE_MENU   # Interactive menu system

EXAMPLES:
  # Original behavior (no version checks, no menu)
  ENABLE_VERSION_CHECKS=false ENABLE_INTERACTIVE_MENU=false $SCRIPT_NAME start
  
  # Enhanced behavior (default)
  $SCRIPT_NAME start
  
  # Just run status
  $SCRIPT_NAME status

TROUBLESHOOTING:
  - Dependencies: brew install supabase/tap/supabase colima docker
  - Reset everything: $SCRIPT_NAME stop && $SCRIPT_NAME start
  - Check logs: tail -f /tmp/supabase_start.log
USAGE
    exit 1 ;;
esac
