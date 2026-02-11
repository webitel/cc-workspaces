import { FormatDateMode } from '@webitel/ui-sdk/enums';
import { formatDate } from '@webitel/ui-sdk/utils';

export default function (ms) {
	return formatDate(Number(ms), FormatDateMode.DATE);
}
