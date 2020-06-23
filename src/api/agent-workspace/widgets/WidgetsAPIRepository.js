import { AgentServiceApiFactory } from 'webitel-sdk';
import configuration from '../../utils/openAPIConfig';
import instance from '../../instance';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const defaultParams = {
  from: new Date().setHours(0, 0, 0, 0),
  to: Date.now(),
  fields: ['count', 'handles', 'abandoned', 'avg_talk_time', 'avg_hold_time'],
};

const fetchWidgets = async ({
                              from,
                              to,
                              agentId,
                              fields,
                            }) => {
  try {
    const defaultObject = {
      abandoned: 0,
      avgHoldSec: 0,
      avgTalkSec: 0,
      count: 0,
      handles: 0,
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
    if (Array.isArray(response.items)) {
      const data = response.items.pop();
      return { ...defaultObject, ...data };
    }
    return defaultObject;
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
