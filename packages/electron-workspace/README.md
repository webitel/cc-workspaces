### Prerequisites

Native SIP module (`electron-sip`) links against [pjproject](https://www.pjsip.org/). Install before `npm install`:

- **macOS**: `brew install pjproject`. Build picks up libs/headers from `brew --prefix pjproject` automatically.
- **Linux**: install pjproject dev package + `pkg-config`. Examples:
  - Build from source: `./configure --enable-shared && make dep && make && sudo make install`
  - Fedora: `dnf install pjproject-devel pkgconf`
  - Ensure `pkg-config --libs libpjproject` resolves before running `npm install`.
- **Windows**: build pjproject (Visual Studio solution under `pjproject/pjsip-apps/build/vs/`) or `vcpkg install pjsip`. Set env var `PJSIP_PREFIX` to install root (the dir containing `include/` and `lib/`). `npm install` reads it.

Build toolchain: Node ≥ 18, Python 3, plus the platform compiler (Xcode CLT / GCC / MSVC).

### Project setup
```
npm install
```

On Windows, if `npm run start` fails with *"Electron failed to install correctly"*, run:
```
npm run install:clean
```

### Development start
```
npm run start
```

Use `.env.local` for real domains/endpoints (kept out of git).

### Type checking
```
npm run typecheck
```

### Build renderer UI (Vue + Vite)
```
npm run build:renderer
```

### Build desktop distributive
```
npm run dist
```

### Structure
- `src/electron/main` - Electron main-process orchestration and windows
- `src/electron/preload` - preload bridge scripts
- `src/electron/shared` - config, storage and i18n helpers
- `src/renderer` - legacy renderer HTML/CSS/JS windows
- `src/ui` - new Vue renderer sources

### Vue call popup opt-in
The legacy call popup remains default. To load the Vue-built call popup, set:
```
ELECTRON_USE_VUE_CALL_UI=1
```

### Configuration example
```
{
  "URL": "https://example.webitel.com/workspace/",
  "openUrlOnAnswer": "link"
}
```

### Local env example
```
WEBITEL_WORKSPACE_URL=https://your-real-domain.example/workspace/
```

### Windows: `SecurityError` on `npm run start`
Dev mode and the installed app share `%APPDATA%\webitel\`. Close the
installed app (and any stray `electron.exe`) before launching dev:
```
Stop-Process -Name Webitel -Force
```

### macOS: "app is damaged" after download
CI builds are ad-hoc signed (no Apple Developer ID), so macOS Gatekeeper
blocks them with a misleading "damaged" message once the quarantine
attribute is applied on download. The app is not damaged. Clear the
quarantine attribute after installing:
```
xattr -cr /Applications/Webitel.app
```
Then launch normally. This is only needed once per install. Real fix
(Developer ID signing + notarization) requires an Apple Developer
account and is not configured.
