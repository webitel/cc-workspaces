import i18n from '../../../../locale/i18n';

export default Object.freeze({
  INBOUND: {
    type: 'inbound',
    field: 'count',
    icon: 'widget-inbound',
    text: () => i18n.t('widgets.inbound'),
  },
  HANDLES: {
    type: 'handles',
    field: 'handles',
    icon: 'widget-handles',
    text: () => i18n.t('widgets.handles'),
  },
  ABANDONED: {
    type: 'abandoned',
    field: 'abandoned',
    icon: 'widget-abandoned',
    text: () => i18n.t('widgets.abandoned'),
  },
  AVG_TALK: {
    type: 'avgTalk',
    field: 'avgTalkSec',
    icon: 'widget-avg-talk',
    text: () => i18n.t('widgets.avgTalk'),
  },
  AVG_HOLD: {
    type: 'avgHold',
    field: 'avgHoldSec',
    icon: 'widget-avg-hold',
    text: () => i18n.t('widgets.avgHold'),
  },
});
