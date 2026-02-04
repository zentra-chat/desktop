#!/bin/bash
# Setup script for Zentra Desktop
# Run this after cloning the repository

set -e

echo "Setting up Zentra Desktop..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Run this script from the desktop directory"
    exit 1
fi

# Initialize submodule if not already done
if [ ! -f "frontend/.git" ]; then
    echo "Initializing frontend submodule..."
    git submodule update --init --recursive
else
    echo "Frontend submodule already initialized"
fi

# Create symlinks
echo "Creating symlinks..."
ln -sf frontend/src src
ln -sf frontend/static static
echo "Symlinks created"

# Install dependencies
echo "Installing dependencies..."
pnpm install
echo "Dependencies installed"

# Sync SvelteKit
echo "Syncing SvelteKit..."
pnpm exec svelte-kit sync
echo "SvelteKit synced"

echo ""
echo "Setup complete!"
echo ""
echo "To start development:"
echo "  pnpm tauri dev"
echo ""
echo "To build:"
echo "  pnpm tauri build"
echo ""
