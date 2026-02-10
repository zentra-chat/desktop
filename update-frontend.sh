#!/usr/bin/env bash

set -e

SUBMODULE="frontend"
BRANCH="main"

echo "Updating $SUBMODULE submodule to latest $BRANCH and discarding local changes..."

# Initialize submodule if missing
git submodule update --init --recursive "$SUBMODULE"

# Enter submodule
cd "$SUBMODULE"

# Fetch latest remote changes
git fetch origin

# Force submodule to exactly match remote branch
git reset --hard "origin/$BRANCH"
git clean -fd

cd ..

# Update parent repo pointer
git add "$SUBMODULE"

# Commit only if pointer changed
if ! git diff --cached --quiet; then
    git commit -m "Update $SUBMODULE submodule to latest version"
    echo "Submodule updated and committed."
else
    echo "Submodule already up to date."
fi
