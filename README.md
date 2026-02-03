# Zentra Desktop

Desktop application for Zentra built with Tauri.

## Architecture

This desktop app uses **git submodules** to import the main frontend codebase, making it so that we only maintain one version of the frontend for both web and desktop.

## Setup

### Initial Setup

```bash
# Clone the repository with submodules
git clone --recursive https://github.com/zentra-chat/zentra-desktop.git
cd zentra-desktop

# Run the setup script
./setup.sh
```

Or manually:

```bash
# Initialize submodule
git submodule update --init --recursive

# Create symlinks
ln -sf frontend/src src
ln -sf frontend/static static

# Install dependencies
pnpm install

# Sync SvelteKit
pnpm exec svelte-kit sync
```

### Development

```bash
# Run in development mode (hot reload)
pnpm tauri dev
```

This will:
1. Start the Vite dev server on port 5173
2. Compile and run the Rust/Tauri backend
3. Open the desktop app window

### Building

```bash
# Build the desktop app
pnpm tauri build
```

The built application will be in `src-tauri/target/release/`.

## Updating the Frontend

Since the frontend is a git submodule, you can update it like this:

```bash
# Pull latest changes from frontend
cd frontend
git pull origin main
cd ..

# Commit the submodule update
git add frontend
git commit -m "Update frontend submodule"
```
## Releases

### Automatic Releases

The desktop app uses GitHub Actions to automatically build and release for all platforms:

- **Linux** (AppImage, deb)
- **macOS** (Intel & Apple Silicon)
- **Windows** (MSI, NSIS installer)

To create a release:

```bash
# Tag the release
git tag v1.0.0
git push origin v1.0.0
```

The GitHub Action will automatically:
1. Build for all platforms
2. Create a GitHub release
3. Upload the installers as release assets