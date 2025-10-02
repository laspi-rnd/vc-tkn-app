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

# Show project info
info:
    @echo "Project: vc-tkn-app"
    @echo "Node version: $(node --version)"
    @echo "NPM version: $(npm --version)"
    @echo ""
    @echo "Test credentials:"
    @echo "  CPF: 123.456.789-00"
    @echo "  Password: 12345678"
