import { AgentServiceApiFactory } from 'webitel-sdk';
import configuration from '../../utils/openAPIConfig';
import instance from '../../instance';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const defaultParams = {
  from: new Date().setHours(0, 0, 0, 0),
  to: Date.now(),
  fields: ['count', 'handles', 'abandoned', 'avg_talk_sec', 'avg_hold_sec'],
};

const prettifySec = (value) => (
  new Date(Math.round(value) * 1000).toISOString().substr(11, 8)
);

const formatResponse = (stats) => ({
  count: stats.count,
  handles: stats.handles,
  abandoned: stats.abandoned,
  avgHoldSec: prettifySec(stats.avgHoldSec),
  avgTalkSec: prettifySec(stats.avgTalkSec),
  maxHoldSec: prettifySec(stats.maxHoldSec),
  maxTalkSec: prettifySec(stats.maxTalkSec),
  minHoldSec: prettifySec(stats.minHoldSec),
  minTalkSec: prettifySec(stats.minTalkSec),
  sumHoldSec: prettifySec(stats.sumHoldSec),
  sumTalkSec: prettifySec(stats.sumTalkSec),
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
