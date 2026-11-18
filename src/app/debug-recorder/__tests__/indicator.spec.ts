import { afterEach, describe, expect, it, vi } from 'vitest';
import { showIndicator } from '../indicator';

function setup() {
	const actions = {
		download: vi.fn(async () => {}),
		stop: vi.fn(async () => {}),
		stats: vi.fn(async () => ({
			records: 1053,
			chars: 0,
			firstT: Date.now(),
			lastT: Date.now(),
			byChannel: {},
		})),
	};
	const hide = showIndicator(actions);
	const button = (text: string) => {
		const found = [
			...document.querySelectorAll('button'),
		].find((b) => b.textContent?.startsWith(text));
		if (!found) throw new Error(`no button "${text}"`);
		return found;
	};
	const menu = () => document.querySelector<HTMLElement>('[role="menu"]');
	return {
		actions,
		hide,
		button,
		menu,
	};
}

describe('REC indicator menu', () => {
	let cleanup: (() => void) | null = null;
	afterEach(() => {
		cleanup?.();
		cleanup = null;
	});

	it('opens on click with the event count and downloads from the menu', async () => {
		const { actions, hide, button, menu } = setup();
		cleanup = hide;
		expect(menu()?.style.display).toBe('none');

		button('● REC').click();
		expect(menu()?.style.display).toBe('block');
		await vi.waitFor(() =>
			expect(menu()?.textContent).toContain('1,053 events'),
		);

		button('Download archive').click();
		expect(actions.download).toHaveBeenCalledOnce();
	});

	it('asks before stopping, cancel keeps recording', async () => {
		const { actions, hide, button } = setup();
		cleanup = hide;
		button('● REC').click();
		button('Stop and delete data').click();
		expect(actions.stop).not.toHaveBeenCalled();

		button('Cancel').click();
		expect(actions.stop).not.toHaveBeenCalled();

		button('Stop and delete data').click();
		button('Delete and stop').click();
		expect(actions.stop).toHaveBeenCalledOnce();
	});

	it('closes on Escape and removes itself on hide', () => {
		const { hide, button, menu } = setup();
		button('● REC').click();
		document.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
			}),
		);
		expect(menu()?.style.display).toBe('none');
		hide();
		expect(menu()).toBeNull();
	});
});
