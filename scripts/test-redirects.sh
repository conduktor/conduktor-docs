#!/bin/bash

# Simple redirect tester for quick validation
# Works with bash 3.2+ (macOS compatible)

set -euo pipefail

DOCS_JSON="${1:-docs.json}"
BASE_URL="https://docs.conduktor.io"
TIMEOUT=3
VERBOSE="${2:-false}"

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
    final_url=$(curl -Ls --max-time "$TIMEOUT" --connect-timeout 2 --max-redirs 5 \
        -w "%{url_effective}" \
        -o /dev/null \
        "$source_url" 2>/dev/null || echo "ERROR")
    
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
    
    if [[ "$VERBOSE" == "verbose" && "$status" != "PASS" ]]; then
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
    log "${YELLOW}Some redirects need attention. Run with 'verbose' for details:${NC}"
    log "./scripts/test-redirects.sh docs.json verbose"
    exit 1
else
    log ""
    log "${GREEN}✅ All redirects working correctly!${NC}"
    exit 0
fi