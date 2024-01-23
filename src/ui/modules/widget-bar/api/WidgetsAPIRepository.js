import { UserHelperServiceApiFactory } from 'webitel-sdk';
import applyTransform, {
  merge,
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import configuration from '../../../../app/api/openAPIConfig';
import instance from '../../../../app/api/instance';

const userHelperService = new UserHelperServiceApiFactory(configuration, '', instance);

const getWidgets = async () => {
  const defaultObject = {
    callInbound: 0,
    callHandled: 0,
    callMissed: 0,
    avgHoldSec: 0,
    avgTalkSec: 0,
    occupancy: 0,
    utilization: 0,
    chatAccepts: 0,
    chatAht: 0,
    scoreCount: 0,
    scoreRequiredAvg: 0,
    sumTalkSec: 0,
    processing: 0,
    available: 0,
    voiceMail: 0,
    queueTalkSec: 0,
    taskAccepts: 0,
  };

  const responseHandler = (stats) =>  ({
    ...stats,
    avgHoldSec: convertDuration(stats.avgHoldSec),
    avgTalkSec: convertDuration(stats.avgTalkSec),
    occupancy: `${stats.occupancy.toFixed(2)}%`,
    utilization: `${stats.utilization.toFixed(2)}%`,
    scoreRequiredAvg: `${stats.scoreRequiredAvg.toFixed()}`,
    chatAht: convertDuration(stats.chatAht),
    sumTalkSec: convertDuration(stats.sumTalkSec),
    processing: convertDuration(stats.processing),
    voiceMail: convertDuration(stats.voiceMail),
    queueTalkSec: convertDuration(stats.queueTalkSec),
    available: convertDuration(stats.available),
  });

  try {
    const response = await userHelperService.activityWorkspaceWidget();
    return applyTransform(response.data, [
      snakeToCamel(),
      merge(defaultObject),
      responseHandler,
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const widgetsAPIRepository = {
  getWidgets,
};

export default widgetsAPIRepository;
