import { createI18n } from 'vue-i18n';

export type Locale = 'en' | 'ru' | 'uk';

declare global {
	interface Window {
		electronStorage?: {
			getItem: (k: string) => string | null;
		};
		/** Electron renderer Node require (nodeIntegration: true). */
		require?: NodeRequire;
	}
}

/**
 * Read lang from electron-localstorage via Electron's runtime require.
 * Do NOT use a bare `require('electron-localstorage')` — Vite bundles that
 * package and stubs Node `path`/`fs` as `{}`, so `path.join` throws at runtime.
 */
function readStoredLang(): string | null {
	try {
		const fromWindow = window.electronStorage?.getItem?.('lang');
		if (fromWindow != null && fromWindow !== '') return fromWindow;

		const nodeRequire = window.require;
		if (typeof nodeRequire !== 'function') return null;
		return nodeRequire('electron-localstorage').getItem('lang') ?? null;
	} catch {
		return null;
	}
}

function detectLocale(): Locale {
	const stored = readStoredLang();
	if (stored === 'ru' || stored === 'uk' || stored === 'en') return stored;
	return 'en';
}

export function createWindowI18n(
	messages: Partial<Record<Locale, Record<string, string>>> = {},
) {
	return createI18n({
		legacy: false,
		locale: detectLocale(),
		fallbackLocale: 'en',
		messages,
	});
}
