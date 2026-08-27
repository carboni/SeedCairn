#!/usr/bin/env bash
set -eu

echo "Starting infrastructure diff: $(date)"

# Type-check
npm run build

cdk diff

echo "End: $(date)"
