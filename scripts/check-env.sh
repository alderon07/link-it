#!/usr/bin/env bash
# ============================================
# Environment Variable Validation Script
# ============================================
# Usage:
#   ./scripts/check-env.sh build                         # Check build vars, default .env
#   ./scripts/check-env.sh runtime --env-file .env.prod  # Check runtime vars
#   ./scripts/check-env.sh all --quiet                   # CI mode, only errors
#
# Exit codes:
#   0 = pass
#   1 = missing required
#   2 = invalid format

set -uo pipefail

# Colors (disabled in quiet mode or non-TTY)
if [[ -t 1 ]] && [[ -z "${QUIET:-}" ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
fi

# Defaults
ENV_FILE=".env"
CHECK_MODE="all"
QUIET=false
EXIT_CODE=0

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        build|runtime|all)
            CHECK_MODE="$1"
            shift
            ;;
        --env-file)
            ENV_FILE="$2"
            shift 2
            ;;
        --quiet|-q)
            QUIET=true
            RED=''
            GREEN=''
            YELLOW=''
            BLUE=''
            NC=''
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [build|runtime|all] [--env-file FILE] [--quiet]"
            echo ""
            echo "Modes:"
            echo "  build    Check build-time variables (NEXT_PUBLIC_*)"
            echo "  runtime  Check runtime variables (CLERK_SECRET_KEY)"
            echo "  all      Check all variables (default)"
            echo ""
            echo "Options:"
            echo "  --env-file FILE  Use specified env file (default: .env)"
            echo "  --quiet, -q      Only show errors (CI mode)"
            echo ""
            echo "Exit codes:"
            echo "  0  All checks passed"
            echo "  1  Missing required variable"
            echo "  2  Invalid format"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Functions
log_info() {
    if [[ "$QUIET" != true ]]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    fi
}

log_success() {
    if [[ "$QUIET" != true ]]; then
        echo -e "${GREEN}[OK]${NC} $1"
    fi
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load env file if it exists
load_env_file() {
    if [[ -f "$ENV_FILE" ]]; then
        log_info "Loading environment from $ENV_FILE"
        # Source the file, ignoring lines that start with # and empty lines
        # Also handle export statements
        set -a
        while IFS= read -r line || [[ -n "$line" ]]; do
            # Skip empty lines and comments
            [[ -z "$line" ]] && continue
            [[ "$line" =~ ^[[:space:]]*# ]] && continue
            # Remove 'export ' prefix if present
            line="${line#export }"
            # Only process lines that look like VAR=value
            if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
                eval "$line" 2>/dev/null || true
            fi
        done < "$ENV_FILE"
        set +a
    else
        log_warn "Env file not found: $ENV_FILE"
        log_info "Checking variables from current environment"
    fi
}

# Check if variable is set and non-empty
check_required() {
    local var_name="$1"
    local var_value="${!var_name:-}"

    if [[ -z "$var_value" ]]; then
        log_error "Missing required: $var_name"
        EXIT_CODE=1
        return 1
    fi
    return 0
}

# Validate URL format for Convex
validate_convex_url() {
    local var_name="NEXT_PUBLIC_CONVEX_URL"
    local var_value="${!var_name:-}"

    if [[ -z "$var_value" ]]; then
        return 0  # Let check_required handle missing
    fi

    # Must be https://*.convex.cloud
    if [[ ! "$var_value" =~ ^https://[a-zA-Z0-9-]+\.convex\.cloud/?$ ]]; then
        log_error "Invalid format: $var_name must match https://*.convex.cloud"
        log_error "  Got: $var_value"
        [[ $EXIT_CODE -lt 2 ]] && EXIT_CODE=2
        return 1
    fi
    log_success "$var_name format valid"
    return 0
}

# Validate Clerk publishable key format
validate_clerk_pk() {
    local var_name="NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    local var_value="${!var_name:-}"

    if [[ -z "$var_value" ]]; then
        return 0  # Let check_required handle missing
    fi

    if [[ ! "$var_value" =~ ^pk_ ]]; then
        log_error "Invalid format: $var_name must start with 'pk_'"
        log_error "  Got: ${var_value:0:10}..."
        [[ $EXIT_CODE -lt 2 ]] && EXIT_CODE=2
        return 1
    fi
    log_success "$var_name format valid"
    return 0
}

# Validate Clerk secret key format
validate_clerk_sk() {
    local var_name="CLERK_SECRET_KEY"
    local var_value="${!var_name:-}"

    if [[ -z "$var_value" ]]; then
        return 0  # Let check_required handle missing
    fi

    if [[ ! "$var_value" =~ ^sk_ ]]; then
        log_error "Invalid format: $var_name must start with 'sk_'"
        log_error "  Got: ${var_value:0:10}..."
        [[ $EXIT_CODE -lt 2 ]] && EXIT_CODE=2
        return 1
    fi
    log_success "$var_name format valid"
    return 0
}

# Check paired optional variables (PostHog)
check_posthog_pair() {
    local key="${NEXT_PUBLIC_POSTHOG_KEY:-}"
    local host="${NEXT_PUBLIC_POSTHOG_HOST:-}"

    if [[ -n "$key" ]] && [[ -z "$host" ]]; then
        log_warn "NEXT_PUBLIC_POSTHOG_KEY is set but NEXT_PUBLIC_POSTHOG_HOST is missing"
        log_warn "  PostHog will not work correctly without both variables"
    elif [[ -z "$key" ]] && [[ -n "$host" ]]; then
        log_warn "NEXT_PUBLIC_POSTHOG_HOST is set but NEXT_PUBLIC_POSTHOG_KEY is missing"
        log_warn "  PostHog will not work correctly without both variables"
    elif [[ -n "$key" ]] && [[ -n "$host" ]]; then
        log_success "PostHog configuration complete (both KEY and HOST set)"
    else
        log_info "PostHog not configured (both KEY and HOST empty)"
    fi
}

# Check build-time variables
check_build_vars() {
    log_info "Checking build-time variables..."

    check_required "NEXT_PUBLIC_CONVEX_URL" || true
    validate_convex_url

    check_required "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" || true
    validate_clerk_pk

    check_posthog_pair
}

# Check runtime variables
check_runtime_vars() {
    log_info "Checking runtime variables..."

    check_required "CLERK_SECRET_KEY" || true
    validate_clerk_sk
}

# Main
main() {
    log_info "Environment validation mode: $CHECK_MODE"
    echo ""

    load_env_file
    echo ""

    case "$CHECK_MODE" in
        build)
            check_build_vars
            ;;
        runtime)
            check_runtime_vars
            ;;
        all)
            check_build_vars
            echo ""
            check_runtime_vars
            ;;
    esac

    echo ""
    if [[ $EXIT_CODE -eq 0 ]]; then
        log_success "All checks passed!"
    elif [[ $EXIT_CODE -eq 1 ]]; then
        log_error "Validation failed: missing required variables"
    else
        log_error "Validation failed: invalid variable format"
    fi

    exit $EXIT_CODE
}

main
