import {
	getDefaultGetListResponse,
	getDefaultGetParams,
} from '@webitel/api-services/api/defaults';
import {
	applyTransform,
	merge,
	notify,
	sanitize,
	snakeToCamel,
	translateError,
} from '@webitel/api-services/api/transformers';
import {
	CatalogGetDialogsQueryParams,
	getMessages,
} from '@webitel/api-services/gen';
import { getShallowFieldsToSendFromZodSchema } from '@webitel/api-services/gen/utils';

const DEFAULT_FIELDS = [
	'id',
	'via',
	'from',
	'message',
	'members',
	'queue',
	'context',
];
const toUuid = (id) =>
	/^[0-9a-f]{32}$/i.test(id || '')
		? [
				id.slice(0, 8),
				id.slice(8, 12),
				id.slice(12, 16),
				id.slice(16, 20),
				id.slice(20),
			].join('-')
		: id;

const normalizeIds = (dialog) => ({
	...dialog,
	id: toUuid(dialog.id),
	members: dialog.members?.map((member) => ({
		...member,
		id: toUuid(member.id),
		invite: member.invite && {
			...member.invite,
			from: toUuid(member.invite.from),
		},
	})),
	message: dialog.message && {
		...dialog.message,
		sender: dialog.message.sender && {
			...dialog.message.sender,
			id: toUuid(dialog.message.sender.id),
		},
		chat: dialog.message.chat && {
			...dialog.message.chat,
			id: toUuid(dialog.message.chat.id),
		},
	},
});

const getActiveChatsList = async (params = {}) => {
	const fieldsToSend = getShallowFieldsToSendFromZodSchema(
		CatalogGetDialogsQueryParams,
	);

	const requestParams = applyTransform(params, [
		merge(getDefaultGetParams()),
		(params) => ({
			online: true,
			...params,
			'peer.id': params.peerId,
			fields: params.fields?.length ? params.fields : DEFAULT_FIELDS,
		}),
		sanitize(fieldsToSend),
	]);

	try {
		const response = await getMessages().catalogGetDialogs(requestParams);

		const { data, next } = applyTransform(response.data || {}, [
			merge(getDefaultGetListResponse()),
		]);

		return {
			items: applyTransform(data || [], [
				snakeToCamel([
					'context', // variables; to avoid `cc_attempt_id` -> `ccAttemptId`
				]),
				(items) => items.map(normalizeIds),
			]),
			next,
		};
	} catch (err) {
		throw applyTransform(err, [
			translateError,
			notify,
		]);
	}
};

const ActiveChatsAPI = {
	getList: getActiveChatsList,
};

export default ActiveChatsAPI;
