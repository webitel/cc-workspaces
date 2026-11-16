import { describe, expect, it, vi } from 'vitest';

import { applyInsecureTlsSwitches } from '../insecure_tls';

describe('applyInsecureTlsSwitches', () => {
	it.each([
		{},
		{
			insecure: false,
		},
	])('leaves TLS verification on for %o', (conf) => {
		const commandLine = {
			appendSwitch: vi.fn(),
		};

		applyInsecureTlsSwitches(conf, commandLine);

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
});
