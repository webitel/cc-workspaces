#!/usr/bin/env node
/**
 * Keeps every `@webitel/*` dependency of this app on one release train.
 *
 * The packages published from webitel-ui-sdk version as `YY.M.PATCH`, where `YY.M`
 * names the product release train. A `~26.8` range therefore means "patches of the
 * 26.08 train only" — which is what makes a release branch actually frozen, and
 * what lets a hotfix reach it without a manual bump. A single `^` range breaks
 * that: it lets one library run ahead of the train the rest of the app is pinned
 * to, which is how this app ends up on a months-newer datalist than its SDK.
 *
 * Two shapes pass:
 *   - all ranges `~YY.M`, all on the same train (the normal case);
 *   - all ranges exact (`1.0.84`), i.e. an app parked on a pre-lockstep train.
 *
 * Usage: node scripts/check-webitel-train.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Versioned as semver for consumers outside the frontend team, not lockstepped. */
const SEMVER_EXCEPTIONS = new Set([
	'@webitel/chat-web-sdk',
]);

const pkg = JSON.parse(readFileSync(resolve(APP_ROOT, 'package.json'), 'utf8'));

const entries = [];
for (const field of [
	'dependencies',
	'devDependencies',
]) {
	for (const [name, range] of Object.entries(pkg[field] ?? {})) {
		if (!name.startsWith('@webitel/') || SEMVER_EXCEPTIONS.has(name)) continue;
		entries.push({
			field,
			name,
			range,
		});
	}
}

if (!entries.length) {
	console.log('check-webitel-train: no lockstepped @webitel/* dependencies');
	process.exit(0);
}

const isExact = (range) => /^\d+\.\d+\.\d+$/.test(range);

if (entries.every(({ range }) => isExact(range))) {
	console.log(
		`check-webitel-train: frozen on exact pins (${entries.map((e) => `${e.name}@${e.range}`).join(', ')})`,
	);
	process.exit(0);
}

const errors = [];
const trains = new Set();

for (const { field, name, range } of entries) {
	const match = /^~(\d+\.\d+)$/.exec(range);
	if (!match) {
		errors.push(
			`${field}.${name} is "${range}" — expected "~YY.M" (a caret range lets this library drift off the train)`,
		);
		continue;
	}
	trains.add(match[1]);
}

if (trains.size > 1) {
	errors.push(
		`mixed trains: ${[
			...trains,
		]
			.sort()
			.join(', ')} — every @webitel/* dep must name the same one`,
	);
}

if (errors.length) {
	console.error('check-webitel-train: failed\n');
	for (const error of errors) console.error(`  ✗ ${error}`);
	process.exit(1);
}

console.log(
	`check-webitel-train: all @webitel/* deps on train ${
		[
			...trains,
		][0]
	}`,
);
