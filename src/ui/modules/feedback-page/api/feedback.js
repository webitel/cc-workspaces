import {
	getDefaultGetListResponse,
	getDefaultInstance,
} from '@webitel/api-services/api/defaults';
import {
	applyTransform,
	generateUrl,
	merge,
	notify,
} from '@webitel/api-services/api/transformers';

const instance = getDefaultInstance();

const getFeedback = async ({ ...params }) => {
	const url = applyTransform(params, [
		generateUrl('feedback'),
	]);

	try {
		const response = await instance.get(url);
		const { data } = applyTransform(response.data, [
			merge(getDefaultGetListResponse()),
		]);

		return data;
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const setFeedback = async ({ ...params }) => {
	try {
		const url = applyTransform(params, [
			generateUrl('feedback'),
		]);

		const response = await instance.post(url);
		const { data } = applyTransform(response.data, [
			merge(getDefaultGetListResponse()),
		]);

		return data;
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const FeedbackApi = {
	getFeedback,
	setFeedback,
};

export default FeedbackApi;
