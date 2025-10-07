# GitHub Actions Workflows

## Build and Release Android APK

This workflow automatically builds and releases an Android APK when you push a version tag.

### Setup Required

1. **Create an Expo Account** (if you don't have one):
   - Go to https://expo.dev/signup
   - Create an account

2. **Generate an Expo Access Token**:
   - Go to https://expo.dev/accounts/[your-account]/settings/access-tokens
   - Click "Create Token"
   - Give it a name (e.g., "GitHub Actions")
   - Copy the token

3. **Add the token to GitHub Secrets**:
   - Go to your repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `EXPO_TOKEN`
   - Value: Paste the token you copied
   - Click "Add secret"

4. **Configure EAS Build** (first time only):
   - Run locally: `npx eas build:configure`
   - Commit the generated `eas.json` file

### Usage

To trigger a build and release:

```bash
# Tag your commit with a version
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

The workflow will:
1. Build the Android APK using EAS Build
2. Create a GitHub Release with the APK attached
3. Make it available for download

### Download the APK

After the workflow completes:
1. Go to your repository's Releases page
2. Find the release for your tag (e.g., v1.0.0)
3. Download the `vc-tkn-app.apk` file
4. Install it on your Android device

### Notes

- The build happens in the cloud via Expo EAS Build
- Build time is typically 5-15 minutes
- You need an Expo account (free tier works fine)
- The APK is a preview build, suitable for testing and distribution
