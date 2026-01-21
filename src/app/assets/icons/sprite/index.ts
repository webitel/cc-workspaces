// @ts-expect-error він там є!
import { fillIconsRepository } from '@webitel/ui-sdk';

import wsAgent from './ws-agent.svg?raw';
import wsWidgetAvgHold from './ws-widget-avg-hold.svg?raw';
import wsWidgetAvgTalk from './ws-widget-avg-talk.svg?raw';
import wsWidgetChatAccepts from './ws-widget-chat-accepts.svg?raw';
import wsWidgetChatAht from './ws-widget-chat-aht.svg?raw';
import wsWidgetCallHandled from './ws-widget-call-handled.svg?raw';
import wsWidgetCallInbound from './ws-widget-call-inbound.svg?raw';
import wsWidgetCallMissed from './ws-widget-call-missed.svg?raw';
import wsWidgetOccupancy from './ws-widget-occupancy.svg?raw';
import wsWidgetUtilization from './ws-widget-utilization.svg?raw';
import wsWidgetScoreCount from './ws-widget-score-count.svg?raw';
import wsWidgetScoreAvg from './ws-widget-score-avg.svg?raw';
import wsWidgetAvailable from './ws-widget-available.svg?raw';
import wsWidgetProcessing from './ws-widget-processing.svg?raw';
import wsWidgetQueueTalk from './ws-widget-queue-talk.svg?raw';
import wsWidgetSumTalk from './ws-widget-sum-talk.svg?raw';
import wsWidgetTaskAccepts from './ws-widget-task-accepts.svg?raw';
import wsWidgetVoiceMail from './ws-widget-voice-mail.svg?raw';
import wsClientInfo from './ws-client-info.svg?raw';
import wsGeneralInfo from './ws-general-info.svg?raw';
import wsKnowledgeBase from './ws-knowledge-base.svg?raw';
import wsProcessing from './ws-processing.svg?raw';
import wsPause from './ws-pause.svg?raw';
import wsBreakout from './ws-breakout.svg?raw';
import wsUserDescription from './ws-user-description.svg?raw';
import wsClientDisconnection from './ws-client-disconnection.svg?raw';
import wsAgentDisconnection from './ws-agent-disconnection.svg?raw';
import wsTimeoutDisconnection from './ws-timeout-disconnection.svg?raw';
import wsWidgetAllCallMissed from './ws-widget-all-call-missed.svg?raw';
import wsWidgetAllDialerCalls from './ws-widget-all-dialer-calls.svg?raw';
import wsWidgetCallInboundQueue from './ws-widget-call-inbound-queue.svg?raw';
import wsWidgetManualCalls from './ws-widget-manual-calls.svg?raw';
import wsWidgetQueueMissed from './ws-widget-queue-missed.svg?raw';
import protectionError from './protection-error.svg?raw';

const icons = {
    'ws-agent': wsAgent,
    'ws-widget-avg-hold': wsWidgetAvgHold,
    'ws-widget-avg-talk': wsWidgetAvgTalk,
    'ws-widget-chat-accepts': wsWidgetChatAccepts,
    'ws-widget-chat-aht': wsWidgetChatAht,
    'ws-widget-call-handled': wsWidgetCallHandled,
    'ws-widget-call-inbound': wsWidgetCallInbound,
    'ws-widget-call-missed': wsWidgetCallMissed,
    'ws-widget-occupancy': wsWidgetOccupancy,
    'ws-widget-utilization': wsWidgetUtilization,
    'ws-widget-score-count': wsWidgetScoreCount,
    'ws-widget-score-avg': wsWidgetScoreAvg,
    'ws-widget-available': wsWidgetAvailable,
    'ws-widget-processing': wsWidgetProcessing,
    'ws-widget-queue-talk': wsWidgetQueueTalk,
    'ws-widget-sum-talk': wsWidgetSumTalk,
    'ws-widget-task-accepts': wsWidgetTaskAccepts,
    'ws-widget-voice-mail': wsWidgetVoiceMail,
    'ws-client-info': wsClientInfo,
    'ws-general-info': wsGeneralInfo,
    'ws-knowledge-base': wsKnowledgeBase,
    'ws-processing': wsProcessing,
    'ws-pause': wsPause,
    'ws-breakout': wsBreakout,
    'ws-user-description': wsUserDescription,
    'ws-client-disconnection': wsClientDisconnection,
    'ws-agent-disconnection': wsAgentDisconnection,
    'ws-timeout-disconnection': wsTimeoutDisconnection,
    'ws-widget-all-call-missed': wsWidgetAllCallMissed,
    'ws-widget-all-dialer-calls': wsWidgetAllDialerCalls,
    'ws-widget-call-inbound-queue': wsWidgetCallInboundQueue,
    'ws-widget-manual-calls': wsWidgetManualCalls,
    'ws-widget-queue-missed': wsWidgetQueueMissed,
    'protection-error': protectionError,
};

fillIconsRepository({ icons: Object.entries(icons).map(([iconName, svg]) => ({ iconName, svg })) });

export default icons;