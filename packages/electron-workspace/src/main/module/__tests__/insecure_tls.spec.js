import { describe, expect, it, vi } from 'vitest';

import { applyInsecureTlsSwitches } from '../insecure_tls';

describe('applyInsecureTlsSwitches', () => {
	it('leaves TLS verification on by default', () => {
		const commandLine = {
			appendSwitch: vi.fn(),
		};

		applyInsecureTlsSwitches({}, commandLine);

		expect(commandLine.appendSwitch).not.toHaveBeenCalled();
	});

	it('restores the old behaviour when insecure is set', () => {
		const commandLine = {
			appendSwitch: vi.fn(),
		};

		applyInsecureTlsSwitches(
			{
				insecure: true,
			},
			commandLine,
		);

		expect(commandLine.appendSwitch).toHaveBeenCalledWith(
			'ignore-certificate-errors',
			'true',
		);
		expect(commandLine.appendSwitch).toHaveBeenCalledWith(
			'allow-insecure-localhost',
			'true',
		);
	});

	it.each([
		false,
		0,
		'',
		null,
		undefined,
	])('treats falsy insecure (%s) as off', (insecure) => {
		const commandLine = {
			appendSwitch: vi.fn(),
		};

		applyInsecureTlsSwitches(
			{
				insecure,
			},
			commandLine,
		);

		expect(commandLine.appendSwitch).not.toHaveBeenCalled();
	});
});
