import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { guardMainFrameNavigation } from '../navigation_guard';

const ORIGIN = 'https://example.test';

const setup = (getAllowedOrigin = () => ORIGIN) => {
	const handlers = {};
	const webContents = {
		on: vi.fn((event, handler) => {
			handlers[event] = handler;
		}),
	};
	guardMainFrameNavigation(webContents, getAllowedOrigin);

	const navigate = (
		url,
		{ event = 'will-navigate', isMainFrame = true } = {},
	) => {
		const details = {
			url,
			isMainFrame,
			preventDefault: vi.fn(),
		};
		handlers[event](details);
		return details.preventDefault;
	};

	return navigate;
};

describe('guardMainFrameNavigation', () => {
	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('lets the main frame stay on its own origin', () => {
		const navigate = setup();

		expect(navigate(`${ORIGIN}/other/page`)).not.toHaveBeenCalled();
	});

	it.each([
		'will-navigate',
		'will-redirect',
	])('blocks the main frame from leaving its origin on %s', (event) => {
		const navigate = setup();

		expect(
			navigate('https://attacker.test/', {
				event,
			}),
		).toHaveBeenCalled();
	});

	it('lets an iframe go to another origin', () => {
		const navigate = setup();

		expect(
			navigate('https://kb.example.org/', {
				isMainFrame: false,
			}),
		).not.toHaveBeenCalled();
	});

	it('blocks everything while there is no allowed origin', () => {
		const navigate = setup(() => null);

		expect(navigate('smb://a.test/1')).toHaveBeenCalled();
	});

	it('follows a changed allowed origin', () => {
		let allowedOrigin = ORIGIN;
		const navigate = setup(() => allowedOrigin);

		allowedOrigin = 'https://new.example.test';

		expect(navigate(`${ORIGIN}/page`)).toHaveBeenCalled();
		expect(navigate('https://new.example.test/page')).not.toHaveBeenCalled();
	});
});
