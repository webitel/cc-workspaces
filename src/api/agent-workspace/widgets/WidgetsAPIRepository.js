import { AgentServiceApiFactory } from 'webitel-sdk';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import configuration from '../../utils/openAPIConfig';
import instance from '../../instance';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const defaultParams = {
  from: new Date().setHours(0, 0, 0, 0),
  to: new Date().setHours(23, 59, 59, 999),
  fields: ['count', 'handles', 'abandoned', 'avg_talk_sec', 'avg_hold_sec'],
};

const formatResponse = (stats) => ({
  count: stats.count,
  handles: stats.handles,
  abandoned: stats.abandoned,
  avgHoldSec: convertDuration(stats.avgHoldSec),
  avgTalkSec: convertDuration(stats.avgTalkSec),
  maxHoldSec: convertDuration(stats.maxHoldSec),
  maxTalkSec: convertDuration(stats.maxTalkSec),
  minHoldSec: convertDuration(stats.minHoldSec),
  minTalkSec: convertDuration(stats.minTalkSec),
  sumHoldSec: convertDuration(stats.sumHoldSec),
  sumTalkSec: convertDuration(stats.sumTalkSec),
});

const fetchWidgets = async ({
                              from,
                              to,
                              agentId,
                              fields,
                            }) => {
  try {
    const defaultObject = {
      count: 0,
      handles: 0,
      abandoned: 0,
      avgHoldSec: 0,
      avgTalkSec: 0,
      maxHoldSec: 0,
      maxTalkSec: 0,
      minHoldSec: 0,
      minTalkSec: 0,
      sumHoldSec: 0,
      sumTalkSec: 0,
    };
    console.log(to);
    const response = await agentService
      .searchAgentCallStatistics(
        undefined,
        undefined,
        from,
        to,
        agentId,
        undefined,
        undefined,
        fields,
      );

    let data = {};
    if (Array.isArray(response.items)) {
      data = response.items.pop();
    }
    return formatResponse({ ...defaultObject, ...data });
  } catch (err) {
    throw err;
  }
};

const widgetsAPIRepository = {
  async getWidgets(argParams) {
    const params = {
      ...defaultParams,
      ...argParams,
    };
    return fetchWidgets(params);
  },
};

export default widgetsAPIRepository;
