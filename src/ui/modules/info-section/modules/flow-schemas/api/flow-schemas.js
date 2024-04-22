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

const fieldsToSend = ['name', 'schema', 'enabled', 'description'];

// const preRequestHandler = (parentId) => (item) => ({
//   ...item,
//   teamId: parentId,
// });

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
    parentId,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
  ]);

  try {
    const response = await flowSchemaService.searchTeamTrigger(
      parentId,
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

//переробити повністю (сире)
const runFlowSchema = async ({ itemId: id }) => {
  const defaultObject = {
    // name: '',
    // description: '',
    // enabled: false,
    // schema: {},
  };

  try {
    const response = await flowSchemaService.runTeamTrigger(id);
    return applyTransform(response.data, [
      snakeToCamel(),
      merge(defaultObject),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};


const TeamFlowsAPI = {
  getList: getFlowSchemasList,
  run: runFlowSchema,
};

export default TeamFlowsAPI;
