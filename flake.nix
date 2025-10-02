{
  description = "React Native Expo app development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            allowUnfree = true;
            android_sdk.accept_license = true;
          };
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js and package managers
            nodejs_20
            nodePackages.npm

            # Just task runner
            just

            # Android development (optional, uncomment if needed)
            # android-studio
            # jdk17

            # iOS development (macOS only)
            # cocoapods

            # Useful utilities
            git
            watchman

            # For better shell experience
            direnv
          ];

          shellHook = ''
            echo "🚀 React Native Expo development environment loaded"
            echo "📱 Project: vc-tkn-app"
            echo ""
            echo "Available commands:"
            echo "  just --list    - Show all available tasks"
            echo "  npm install    - Install dependencies"
            echo "  npx expo start - Start Expo development server"
            echo ""

            # Set up environment variables
            export EXPO_NO_TELEMETRY=1
            export NODE_ENV=development
          '';
        };
      }
    );
}
