/**
 * ТИМЧАСОВИЙ ДЕБАГ — видалити разом із викликом у `RELOAD_CHAT_LIST`.
 * Викликається ПІСЛЯ сетання: показує, що в клієнті і що з рест діалогів
 * реально доїхало до стора sdk.
 */

// свіжість чату: створення або останнє повідомлення — що новіше
const conversationFreshness = (chat) => {
	const last = chat._messages?.[chat._messages.length - 1];

	return Math.max(
		Number(chat.createdAt) || 0,
		Number(last?.created_at) || 0,
		Number(last?.timestamp) || 0,
	);
};

// те саме для сирого рест діалога
const dialogFreshness = (dialog) =>
	Math.max(
		Number(dialog.started) || 0,
		Number(dialog.date) || 0,
		Number(dialog.message?.date) || 0,
	);

const byFreshness = (getTime) => (a, b) => getTime(b) - getTime(a);

export const debugActiveChatsMapping = ({
	client,
	dialogs = [],
	skippedAsExisting = [],
	skippedAsNull = [],
}) => {
	const all = [
		...client.allConversations(),
	].sort(byFreshness(conversationFreshness));

	const ws = all.filter((chat) => chat.data?.origin !== 'rest');
	const rest = all.filter((chat) => chat.data?.origin === 'rest');

	const restBefore = [
		...dialogs,
	].sort(byFreshness(dialogFreshness));

	console.group('[debug] чати в сторі sdk');
	console.log('client:', client);
	console.log(`allConversations() — ${all.length}, від найновіших:`, all);
	console.log(`ws чати — ${ws.length}:`, ws);
	console.log(`rest чати ДО мапінгу — ${restBefore.length}:`, restBefore);
	console.log(`rest чати ПІСЛЯ мапінгу — ${rest.length}:`, rest);

	// чат вважається «в сторі», якщо він там є під будь-яким origin
	const inStore = new Set(all.map(({ conversationId }) => conversationId));
	const missing = restBefore.filter(({ id }) => !inStore.has(id));

	console.log(
		`діалогів з рест: ${dialogs.length}`,
		`| вже були по ws: ${skippedAsExisting.length}`,
		`| створено з реста: ${rest.length}`,
		`| без currentAgent: ${skippedAsNull.length}`,
		`| взагалі відсутні в сторі: ${missing.length}`,
	);
	if (skippedAsNull.length)
		console.log('без currentAgent (members):', skippedAsNull);
	if (missing.length) console.log('відсутні в сторі:', missing);

	console.groupEnd();
};
