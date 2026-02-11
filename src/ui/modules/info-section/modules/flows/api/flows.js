import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge, mergeEach,
  notify, sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { TeamTriggerServiceApiFactory } from 'webitel-sdk';

import instance from '../../../../../../app/api/instance';
import configuration from '../../../../../../app/api/openAPIConfig';
import i18n from '../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

const flowSchemaService = new TeamTriggerServiceApiFactory(configuration, '', instance);

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
  } = applyTransform(params, [
    starToSearch('search'),
  ]);

    const response = await flowSchemaService.searchAgentTrigger(
      undefined,
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
};

const runFlowSchema = async ({ id }) => {
  try {
    const response = await flowSchemaService.runTeamTrigger(id, {});
    return applyTransform(response.data, [
      snakeToCamel(),
      notify(({ callback }) => callback({
        type: 'success',
        text: t('infoSec.flows.runFlowSuccess'),
      })),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify(({ callback }) => callback({
        type: 'error',
        text: t('infoSec.flows.runFlowError'),
      })),
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
