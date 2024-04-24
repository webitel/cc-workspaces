import { TeamTriggerServiceApi } from 'webitel-sdk';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  camelToSnake,
  merge, mergeEach,
  notify, sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers';
import instance from '../../../../../../app/api/instance';
import configuration from '../../../../../../app/api/openAPIConfig';

const flowSchemaService = new TeamTriggerServiceApi(configuration, '', instance);

const getFlowSchemasList = async (params) => {
  const defaultObject = {
    enabled: false,
  };

  const {
    page,
    size,
    search,
    sort,
    fields,
    id,
    enabled,
    teamId,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
  ]);

  try {
    const response = await flowSchemaService.searchTeamTrigger(
      teamId,
      page,
      size,
      search,
      sort,
      fields,
      enabled,
      id,
    );
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [
        mergeEach(defaultObject),
      ]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const runFlowSchema = async ({ itemId: id }) => {
  try {
    const response = await flowSchemaService.runTeamTrigger(id, {});
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const getFlowsLookup = (params) => getFlowSchemasList({
  ...params,
  fields: params.fields || ['id', 'name', 'enabled'],
});


const FlowsAPI = {
  getList: getFlowSchemasList,
  run: runFlowSchema,
  getLookup: getFlowsLookup,
};

export default FlowsAPI;
