import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  merge,
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { AgentServiceApiFactory } from 'webitel-sdk';

import instance from '../../../../../app/api/instance';
import configuration from '../../../../../app/api/openAPIConfig';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const convertStatusDuration = (value) => {
  if (value > 60 * 60 * 24) return '>24:00:00';
  return convertDuration(value);
};

const getAgentsList = async (params) => {
  const listResponseHandler = (items) => {
    return items.map((item) => ({
      ...item,
      statusDuration: convertStatusDuration(item.statusDuration),
    }));
  };

  const {
    page,
    size,
    search,
    sort,
    fields,
    id,
    team,
    skill,
    isSupervisor,
    isNotSupervisor,
    notTeamId,
    supervisorId,
    notSkillId,
  } = applyTransform(params, [
    merge(getDefaultGetParams())
  ]);

  try {
    const response = await agentService.searchAgent(
      page,
      size,
      search,
      sort,
      fields,
      id,
      undefined,
      supervisorId,
      team,
      undefined,
      undefined,
      isSupervisor,
      skill,
      undefined,
      isNotSupervisor,
      undefined,
      undefined,
      notTeamId,
      notSkillId,
    );
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [listResponseHandler]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};


const AgentsAPI = {
  getList: getAgentsList,
};

export default AgentsAPI;
