#!/bin/bash

# Conduktor Documentation Redirect Validator
# Works with bash 3.2+ (macOS compatible)

set -euo pipefail

# Default configuration
DOCS_JSON="docs.json"
BASE_URL="https://docs.conduktor.io"
TIMEOUT=5
VERBOSE=false
SHOW_HELP=false

# Function to show help
show_help() {
    cat << 'EOF'
Conduktor Documentation Redirect Validator

USAGE:
  ./scripts/test-redirects.sh [OPTIONS] [DOCS_JSON_FILE]

ARGUMENTS:
  DOCS_JSON_FILE          Path to docs.json file (default: docs.json)

OPTIONS:
  --base-url <url>        Base URL for testing redirects (default: https://docs.conduktor.io)
                          Can be localhost, IP address, or full URL with protocol
  --timeout <seconds>     Request timeout in seconds (default: 3)
  --verbose, -v           Show detailed output for failed redirects
  --help, -h              Show this help message

EXAMPLES:
  # Test using default settings
  ./scripts/test-redirects.sh

  # Test specific file with verbose output
  ./scripts/test-redirects.sh --verbose docs.json

  # Test against staging environment
  ./scripts/test-redirects.sh --base-url https://staging.docs.conduktor.io

  # Test against local development server
  ./scripts/test-redirects.sh --base-url localhost:3000

  # Test with custom timeout and verbose output  
  ./scripts/test-redirects.sh --timeout 10 --verbose docs.json

REQUIREMENTS:
  - curl: For HTTP requests
  - jq: For JSON parsing
  - bc: For calculations (usually pre-installed)

EOF
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --base-url)
                BASE_URL="$2"
                shift 2
                ;;
            --timeout)
                TIMEOUT="$2"
                shift 2
                ;;
            --verbose|-v)
                VERBOSE=true
                shift
                ;;
            --help|-h)
                SHOW_HELP=true
                shift
                ;;
            --*)
                echo "Error: Unknown option $1" >&2
                echo "Use --help for usage information" >&2
                exit 1
                ;;
            *)
                # Positional argument - assume it's the docs.json file
                DOCS_JSON="$1"
                shift
                ;;
        esac
    done
}

# Validate arguments
validate_args() {
    # Validate timeout
    if ! [[ "$TIMEOUT" =~ ^[0-9]+$ ]] || [[ "$TIMEOUT" -le 0 ]]; then
        echo "Error: Invalid timeout value '$TIMEOUT'. Must be a positive integer." >&2
        exit 1
    fi
    
    # Add http:// prefix if no protocol specified (for localhost, IP addresses, etc.)
    if ! [[ "$BASE_URL" =~ ^https?:// ]]; then
        BASE_URL="http://$BASE_URL"
    fi
    
    # Remove trailing slash from base URL if present
    BASE_URL="${BASE_URL%/}"
}

# Parse arguments
parse_args "$@"

# Show help if requested
if [[ "$SHOW_HELP" == true ]]; then
    show_help
    exit 0
fi

# Validate arguments
validate_args

# Disable colors in CI or when output is not a terminal
if [[ -n "${CI:-}" ]] || [[ ! -t 1 ]]; then
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
else
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
fi

# Counters
PASSED=0
FAILED=0
ERRORS=0

log() {
    echo -e "$1"
}

# Check prerequisites
if ! command -v curl &> /dev/null; then
    log "${RED}❌ curl is required but not installed${NC}"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    log "${RED}❌ jq is required but not installed${NC}"
    log "Install with: brew install jq (macOS) or apt install jq (Ubuntu)"
    exit 1
fi

# Validate docs.json
if [[ ! -f "$DOCS_JSON" ]]; then
    log "${RED}❌ File not found: $DOCS_JSON${NC}"
    exit 1
fi

if ! jq empty "$DOCS_JSON" 2>/dev/null; then
    log "${RED}❌ Invalid JSON in $DOCS_JSON${NC}"
    exit 1
fi

# Count redirects
TOTAL=$(jq '.redirects | length' "$DOCS_JSON")

if [[ "$TOTAL" -eq 0 ]]; then
    log "${RED}❌ No redirects found in $DOCS_JSON${NC}"
    exit 1
fi

log "${BLUE}Testing $TOTAL redirects from $DOCS_JSON${NC}"
log "Base URL: $BASE_URL"
log "$(printf '=%.0s' $(seq 1 50))"

# Test function
test_redirect() {
    local source="$1"
    local expected="$2"
    local index="$3"
    
    local source_url="${BASE_URL}${source}"
    local expected_url="${BASE_URL}${expected}"
    
    # Get final URL after redirects
    local final_url
    if final_url=$(curl -Ls --max-time "$TIMEOUT" --connect-timeout 5 --max-redirs 5 \
        -w "%{url_effective}" \
        -o /dev/null \
        "$source_url" 2>/dev/null); then
        # curl succeeded, clean up any trailing characters
        final_url=$(echo "$final_url" | tr -d '\n\r%')
    else
        final_url="ERROR"
    fi
    
    local status symbol color
    
    if [[ "$final_url" == "ERROR" ]]; then
        status="ERROR"
        symbol="⚠️"
        color="$YELLOW"
        ERRORS=$((ERRORS + 1))
    elif [[ "$final_url" == "$BASE_URL/" ]] || [[ "$final_url" == "$BASE_URL" ]]; then
        status="BROKEN"
        symbol="💥"
        color="$RED"
        FAILED=$((FAILED + 1))
    elif [[ "${final_url%/}" == "${expected_url%/}" ]]; then
        status="PASS"
        symbol="✅"
        color="$GREEN" 
        PASSED=$((PASSED + 1))
    else
        status="FAIL"
        symbol="❌"
        color="$RED"
        FAILED=$((FAILED + 1))
    fi
    
    printf "[%3d/%d] %b%s%b %s -> %s\n" "$index" "$TOTAL" "$color" "$symbol" "$NC" "$source" "$expected"
    
    if [[ "$VERBOSE" == true && "$status" != "PASS" ]]; then
        echo "      Expected: $expected_url"
        if [[ "$final_url" != "ERROR" ]]; then
            echo "      Got:      $final_url"
        fi
    fi
}

# Main testing loop
index=1
while IFS=$'\t' read -r source destination; do
    [[ -n "$source" && -n "$destination" ]] || continue
    test_redirect "$source" "$destination" "$index"
    index=$((index + 1))
    sleep 0.1  # Be nice to the server
done < <(jq -r '.redirects[] | [.source, .destination] | @tsv' "$DOCS_JSON")

# Summary
TOTAL_TESTED=$((PASSED + FAILED + ERRORS))
SUCCESS_RATE=0
if [[ $TOTAL_TESTED -gt 0 ]]; then
    SUCCESS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL_TESTED" | bc -l 2>/dev/null || echo "0")
fi

log ""
log "$(printf '=%.0s' $(seq 1 50))"
log "${BLUE}SUMMARY${NC}"
log "$(printf '=%.0s' $(seq 1 50))"
log "Total tested: $TOTAL_TESTED"
log "${GREEN}✅ Passed: $PASSED${NC}"
log "${RED}❌ Failed: $FAILED${NC}"
log "${YELLOW}⚠️  Errors: $ERRORS${NC}"
log "Success rate: ${SUCCESS_RATE}%"

if [[ $FAILED -gt 0 || $ERRORS -gt 0 ]]; then
    log ""
    log "${YELLOW}Some redirects need attention. Run with --verbose for details:${NC}"
    log "./scripts/test-redirects.sh --verbose"
    exit 1
else
    log ""
    log "${GREEN}✅ All redirects working correctly!${NC}"
    exit 0
fi