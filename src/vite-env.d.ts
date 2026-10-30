// https://vite.dev/guide/env-and-mode#intellisense-for-typescript
/// <reference types="vite/client" />

// [Claude] package.json version, injected via `define` in vite.config.ts
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
	readonly VITE_STAGING_ENV: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
