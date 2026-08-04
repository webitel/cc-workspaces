import { fillIconsRepository } from '@webitel/ui-sdk';
import hideWindow from './hide-window.svg?raw';

const icons = {
	'electron-workspace:hide-window': hideWindow,
};

fillIconsRepository({
	icons: Object.entries(icons).map(([iconName, svg]) => ({
		iconName,
		svg,
	})),
});

export default icons;
