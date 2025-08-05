#!/bin/bash

# Simple network connectivity test for GitHub Actions debugging

set -euo pipefail

echo "=== Network Connectivity Test ==="
echo "Testing basic network connectivity..."

# Test 1: Simple ping-like test with curl
echo "Test 1: Can we reach docs.conduktor.io?"
if curl -I -s --max-time 5 --connect-timeout 2 https://docs.conduktor.io/ > /dev/null 2>&1; then
    echo "✅ Basic connectivity to docs.conduktor.io works"
else
    echo "❌ Cannot reach docs.conduktor.io"
    exit 1
fi

# Test 2: Test a simple redirect manually
echo "Test 2: Testing a simple redirect manually"
echo "Trying to follow redirect from a known URL..."
final_url=$(curl -Ls --max-time 3 --connect-timeout 2 --max-redirs 5 \
    -w "%{url_effective}" \
    -o /dev/null \
    "https://docs.conduktor.io/gateway/get-started/docker/" 2>/dev/null || echo "ERROR")

echo "Final URL: $final_url"
if [[ "$final_url" == "ERROR" ]]; then
    echo "❌ Curl failed completely"
    exit 1
else
    echo "✅ Curl succeeded, got: $final_url"
fi

# Test 3: Test JSON parsing
echo "Test 3: Testing JSON parsing with jq"
if [[ -f "docs.json" ]]; then
    echo "docs.json exists"
    redirect_count=$(jq '.redirects | length' docs.json 2>/dev/null || echo "ERROR")
    if [[ "$redirect_count" == "ERROR" ]]; then
        echo "❌ Cannot parse docs.json"
        exit 1
    else
        echo "✅ Found $redirect_count redirects in docs.json"
    fi
else
    echo "❌ docs.json not found"
    exit 1
fi

echo "=== All tests passed! Network and parsing are working ==="