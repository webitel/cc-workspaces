import {
	getDefaultGetListResponse,
	getDefaultGetParams,
	getDefaultInstance,
} from '@webitel/ui-sdk/src/api/defaults/index';
import applyTransform, {
	addQueryParamsToUrl,
	camelToSnake,
	generateUrl,
	merge,
	notify,
	snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index';

const instance = getDefaultInstance();

const getList = async ({ path, filters, ...params }) => {
	const url = applyTransform(params, [
		merge(getDefaultGetParams()),
		(params) => ({
			...params,
			q: params.search,
		}),
		camelToSnake([
			'fields',
		]),
		generateUrl(path),
		addQueryParamsToUrl(filters),
	]);

	try {
		const response = await instance.get(url);
		const { data, items, next } = applyTransform(response.data, [
			merge(getDefaultGetListResponse()),
			snakeToCamel(),
		]);

		return {
			// Some endpoints return data, some return items so we need to check for both of them
			items: data || items,
			next,
		};
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const TableApi = {
	getList,
};

export default TableApi;
