import type { RecorderStats } from './types';

export interface IndicatorActions {
	download(): Promise<void>;
	stop(): Promise<void>;
	stats(): Promise<RecorderStats | null>;
}

const RED = '#d32f2f';
const FONT = '13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif';

function styled<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	style: Partial<CSSStyleDeclaration>,
	text?: string,
): HTMLElementTagNameMap[K] {
	const el = document.createElement(tag);
	Object.assign(el.style, style);
	if (text !== undefined) el.textContent = text;
	return el;
}

function menuButton(text: string, danger = false): HTMLButtonElement {
	const button = styled(
		'button',
		{
			display: 'block',
			width: '100%',
			padding: '6px 10px',
			margin: '4px 0 0',
			font: FONT,
			textAlign: 'left',
			color: danger ? RED : '#1d1d1f',
			background: '#f3f3f5',
			border: '0',
			borderRadius: '6px',
			cursor: 'pointer',
		},
		text,
	);
	button.type = 'button';
	return button;
}

function summary(stats: RecorderStats | null): string {
	if (!stats) return 'Recording is on.';
	const since = stats.firstT
		? new Date(stats.firstT).toLocaleString(undefined, {
				dateStyle: 'short',
				timeStyle: 'short',
			})
		: '—';
	return `${stats.records.toLocaleString()} events since ${since}.`;
}

/** short-lived note in the chip's corner, e.g. after the recording was stopped */
export function flash(text: string, ms = 4_000): void {
	const note = styled(
		'div',
		{
			position: 'fixed',
			left: '8px',
			bottom: '8px',
			zIndex: '2147483647',
			padding: '6px 10px',
			font: FONT,
			color: '#fff',
			background: '#333',
			borderRadius: '8px',
		},
		text,
	);
	note.setAttribute('role', 'status');
	document.body?.appendChild(note);
	setTimeout(() => note.remove(), ms);
}

/** red REC chip in the corner; opens a menu to download the archive or stop and delete the data */
export function showIndicator(actions: IndicatorActions): () => void {
	const root = styled('div', {
		position: 'fixed',
		left: '8px',
		bottom: '8px',
		zIndex: '2147483647',
		font: FONT,
	});
	const chip = styled(
		'button',
		{
			padding: '2px 8px',
			font: '600 11px/16px system-ui, sans-serif',
			color: '#fff',
			background: RED,
			border: '0',
			borderRadius: '10px',
			opacity: '0.85',
			cursor: 'pointer',
		},
		'● REC',
	);
	chip.type = 'button';
	chip.title = 'Debug recording is on. Click for options.';
	chip.setAttribute('aria-haspopup', 'menu');
	chip.setAttribute('aria-expanded', 'false');

	const menu = styled('div', {
		display: 'none',
		position: 'absolute',
		left: '0',
		bottom: '26px',
		width: '260px',
		padding: '10px',
		color: '#1d1d1f',
		background: '#fff',
		borderRadius: '10px',
		boxShadow: '0 6px 24px rgba(0, 0, 0, 0.25)',
	});
	menu.setAttribute('role', 'menu');
	const title = styled(
		'div',
		{
			fontWeight: '600',
		},
		'Debug recording',
	);
	const info = styled('div', {
		color: '#6b6b70',
		margin: '2px 0 6px',
	});
	const status = styled('div', {
		color: '#6b6b70',
		marginTop: '6px',
	});
	const downloadButton = menuButton('Download archive');
	const stopButton = menuButton('Stop and delete data…', true);

	const confirm = styled('div', {
		display: 'none',
		marginTop: '6px',
	});
	confirm.append(
		styled(
			'div',
			{},
			'Recording stops and everything recorded is deleted. This cannot be undone. Download the archive first if support needs it.',
		),
	);
	const confirmDelete = menuButton('Delete and stop', true);
	const cancel = menuButton('Cancel');
	confirm.append(confirmDelete, cancel);
	menu.append(title, info, downloadButton, stopButton, confirm, status);
	root.append(menu, chip);

	const setOpen = (open: boolean) => {
		menu.style.display = open ? 'block' : 'none';
		chip.setAttribute('aria-expanded', String(open));
		confirm.style.display = 'none';
		stopButton.style.display = 'block';
		status.textContent = '';
		if (!open) return;
		info.textContent = 'Recording is on.';
		actions
			.stats()
			.then((stats) => {
				info.textContent = summary(stats);
			})
			.catch(() => {});
	};
	const buttons = [
		downloadButton,
		stopButton,
		confirmDelete,
		cancel,
	];
	const busy = async (text: string, task: () => Promise<void>) => {
		status.textContent = text;
		for (const button of buttons) button.disabled = true;
		try {
			await task();
			status.textContent = '';
		} catch {
			status.textContent =
				'Failed. Try again, or use webitelDebug in the console.';
		} finally {
			for (const button of buttons) button.disabled = false;
		}
	};

	chip.addEventListener('click', () => setOpen(menu.style.display === 'none'));
	downloadButton.addEventListener('click', () =>
		busy('Preparing archive…', actions.download),
	);
	stopButton.addEventListener('click', () => {
		stopButton.style.display = 'none';
		confirm.style.display = 'block';
	});
	cancel.addEventListener('click', () => setOpen(true));
	confirmDelete.addEventListener('click', () =>
		busy('Deleting…', actions.stop),
	);

	const onOutside = (event: MouseEvent) => {
		if (!root.contains(event.target as Node)) setOpen(false);
	};
	const onKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape') setOpen(false);
	};
	document.addEventListener('mousedown', onOutside, true);
	document.addEventListener('keydown', onKey);

	const mount = () => document.body.appendChild(root);
	if (document.body) mount();
	else
		document.addEventListener('DOMContentLoaded', mount, {
			once: true,
		});

	return () => {
		document.removeEventListener('mousedown', onOutside, true);
		document.removeEventListener('keydown', onKey);
		root.remove();
	};
}
