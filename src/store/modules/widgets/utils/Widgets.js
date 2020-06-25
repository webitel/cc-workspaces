import i18n from '../../../../locale/i18n';

export default {
  INBOUND: {
    type: 'inbound',
    field: 'count',
    icon: 'widget-inbound',
    text: () => i18n.t('widgets.inbound'),
    show: true,
  },
  HANDLES: {
    type: 'handles',
    field: 'handles',
    icon: 'widget-handles',
    text: () => i18n.t('widgets.handles'),
    show: true,
  },
  MISSED: {
    type: 'missed',
    field: 'abandoned',
    icon: 'widget-missed',
    text: () => i18n.t('widgets.missed'),
    show: true,
  },
  AVG_TALK: {
    type: 'avgTalk',
    field: 'avgTalkSec',
    icon: 'widget-avg-talk',
    text: () => i18n.t('widgets.avgTalk'),
    show: true,
  },
  AVG_HOLD: {
    type: 'avgHold',
    field: 'avgHoldSec',
    icon: 'widget-avg-hold',
    text: () => i18n.t('widgets.avgHold'),
    show: true,
  },
};
