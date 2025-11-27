import { formatDate } from '@webitel/ui-sdk/utils';

export default function(ms) {
  formatDate(Number(ms), 'date');
}
