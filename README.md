# FotoOwl Gallery

A React Native and TypeScript gallery application built with Expo. It provides a local registration/login flow, persistent sessions and favorites, a searchable Picsum gallery, image saving, sharing, and profile management.

## Requirements

- Node.js 22.13 or newer (Expo SDK 57 requirement)
- npm 9 or newer
- Expo Go, Android emulator, or iOS simulator

## Run Locally

```bash
npm install
npm start
```

Use `a` in the Expo terminal to launch Android, `i` for iOS on macOS, or scan the displayed QR code with Expo Go.

Useful commands:

```bash
npm run android
npm run web
npx tsc --noEmit
```

## Features

- Registration with required-field, email, 10-digit mobile, password length, and password-match validation.
- Local credential validation at login and automatic session restoration after app relaunch.
- Picsum API gallery rendered with `FlatList`, pull-to-refresh, guarded infinite scroll, loading/error states, and duplicate-result protection.
- Debounced author search combined with `All`, `A-M`, and `N-Z` author filters.
- Favorites persisted independently in AsyncStorage, searchable from a dedicated tab.
- Detail view with a full-size image, device-gallery download, and native share action.
- Editable profile that synchronizes both the active session and saved login record immediately.

## Architecture

```text
src/
  api/           Picsum network service
  components/    Reusable buttons, fields, image card, filter controls
  hooks/         Debounced input and guarded paginated fetch hooks
  navigation/    Conditional auth/root navigation and tab navigation
  screens/       Authentication, gallery, favorites, detail, profile views
  store/         Zustand auth and favorites state with persistence actions
  types/         Domain and route TypeScript definitions
  utils/         AsyncStorage access and form validation helpers
```

Zustand is the centralized state layer. AsyncStorage access is kept in the stores and `utils/storage.ts`, avoiding persistence concerns in screen components. The gallery API lifecycle is isolated in `useFetchImages`; its ref guard prevents refresh and pagination requests from running concurrently.

## Libraries

- `@react-navigation/native`, `native-stack`, `bottom-tabs` for app flow and navigation.
- `zustand` for centralized state.
- `@react-native-async-storage/async-storage` for the user record, active session, and favorites.
- `expo-media-library` and `expo-file-system` to download and save images to the device gallery.
- `expo-sharing` to share an image link.
- `react-dom` and `react-native-web` for the supported web export.

## Assumptions

- This is a client-side assignment app, so credentials are deliberately stored locally rather than sent to a backend. Production apps should use a remote authentication service and secure tokens.
- City selection uses the platform picker for native dropdown behavior.
- Image saving requires gallery permission and is available on Android/iOS. The screen gives a device-specific note on web.
- Picsum is the source of truth for gallery data; network failure provides an inline retry path.

## Android APK

For a distributable Android APK, configure an Expo account and run:

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

The included `eas.json` preview profile produces an installable APK.

## Web Deployment

The production web build is deployed live at:

- **GitHub Pages**: https://arimillisandeep.github.io/React-Native-Intern-Assignment-Overview/
- **Vercel**: https://fotoowl-gallery-9szfifftb-sandeeparimilli2001-4822s-projects.vercel.app

Both are built from `npx expo export --platform web`. The `gh-pages` branch contains the web build for GitHub Pages, and the Vercel deployment (`fotoowl-gallery` project) is automatically configured from the repository.
