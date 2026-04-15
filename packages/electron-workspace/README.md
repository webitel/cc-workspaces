### Project setup
```
npm install
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
