import type { Breakpoint } from '@webitel/ui-sdk/plugins/breakpoint/breakpoint.plugin.js';

// The breakpoint plugin injects `$breakpoint` as a Vue global property.
// Re-declared here so it resolves without relying on the plugin's own
// declaration file being pulled into the type graph.
declare module 'vue' {
	interface ComponentCustomProperties {
		$breakpoint: Breakpoint;
	}
}

// `ua` (the underlying JsSIP UserAgent) exists at runtime on SipClient but is
// not declared in webitel-sdk's published types.
declare module 'webitel-sdk' {
	interface SipClient {
		ua?: object;
	}
}

declare global {
	interface Window {
		// Electron injects runtime config onto window before app init.
		_config?: Record<string, unknown>;
	}
}
