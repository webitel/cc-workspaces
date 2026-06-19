// https://vite.dev/guide/env-and-mode#intellisense-for-typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_STAGING_ENV: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
