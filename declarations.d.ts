import type { Breakpoint } from '@webitel/ui-sdk/plugins/breakpoint/breakpoint.plugin.js';

// Re-declared so `$breakpoint` resolves without pulling the plugin's own
// declaration file into the type graph.
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
		_config?: Record<string, unknown>;
	}
}
