import {
	getDefaultGetListResponse,
	getDefaultGetParams,
	getDefaultInstance,
} from '@webitel/api-services/api/defaults';
import {
	addQueryParamsToUrl,
	applyTransform,
	camelToSnake,
	generateUrl,
	merge,
	notify,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';

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
