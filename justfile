# List available commands
default:
    @just --list

# Install dependencies
install:
    npm install

# Start Expo development server
start:
    npx expo start

# Start Expo with QR code cleared
start-clear:
    npx expo start --clear

# Start on Android device/emulator
android:
    npm run android

# Start on iOS simulator (macOS only)
ios:
    npm run ios

# Start web version
web:
    npm run web

# Clean all generated files and caches
clean:
    rm -rf node_modules
    rm -rf .expo
    rm -rf dist
    rm -rf web-build
    npm cache clean --force

# Clean and reinstall dependencies
reset: clean install

# Check TypeScript types
typecheck:
    npx tsc --noEmit

# Format code (if prettier is installed)
format:
    npx prettier --write "src/**/*.{ts,tsx,js,jsx,json}"

# Build APK for Android (requires EAS CLI: npm install -g eas-cli)
build-apk:
    eas build --platform android --profile preview

# Build production APK
build-apk-prod:
    eas build --platform android --profile production

# Configure EAS build
build-configure:
    eas build:configure

# Tag current commit and push (triggers APK build in GitHub Actions)
# Usage: just tag v1.0.0
tag TAG:
    @echo "Creating and pushing tag: {{TAG}}"
    git tag {{TAG}}
    git push origin {{TAG}}
    @echo "✓ Tag {{TAG}} pushed successfully"
    @echo "→ APK build will start at: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[\/:]\(.*\)\.git/\1/')/actions"

# Delete a tag locally and remotely
# Usage: just untag v1.0.0
untag TAG:
    @echo "Deleting tag: {{TAG}}"
    git tag -d {{TAG}}
    git push origin :refs/tags/{{TAG}}
    @echo "✓ Tag {{TAG}} deleted"

# Show project info
info:
    @echo "Project: vc-tkn-app"
    @echo "Node version: $(node --version)"
    @echo "NPM version: $(npm --version)"
    @echo ""
    @echo "Test credentials:"
    @echo "  CPF: 123.456.789-00"
    @echo "  Password: 12345678"
