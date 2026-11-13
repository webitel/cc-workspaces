import { mount } from '@vue/test-utils';

import RichTextEditor from '../rich-text-editor.vue';

const editorStub = {
	name: 'WtRichTextEditor',
	props: [
		'modelValue',
		'label',
		'labelProps',
		'output',
		'height',
		'plugins',
		'toolbar',
	],
	emits: [
		'update:modelValue',
	],
	template: '<div class="editor" />',
};

const mountEditor = (props = {}) =>
	mount(RichTextEditor, {
		props,
		global: {
			// ui-sdk registers the editor app-wide as an async component, which
			// stubs don't reach; a component registered here replaces it
			components: {
				WtRichTextEditor: editorStub,
			},
		},
	});

describe('RichTextEditor', () => {
	it("hands ui-sdk's editor the schema settings", () => {
		const editor = mountEditor({
			value: '<p>Hi</p>',
			label: 'Summary',
			hint: 'Visible to the customer',
			output: 'text',
			height: 200,
		}).findComponent(editorStub);

		expect(editor.props()).toMatchObject({
			modelValue: '<p>Hi</p>',
			label: 'Summary',
			labelProps: {
				hint: 'Visible to the customer',
			},
			output: 'text',
			height: 200,
		});
	});

	// [Claude] Pinned to the editor ui-sdk used to default to, so agents see no change
	it('sets up the html editor for the processing form', () => {
		const editor = mountEditor({
			output: 'html',
		}).findComponent(editorStub);

		expect(editor.props('plugins')).toEqual([
			'advlist',
			'emoticons',
			'fullscreen',
			'image',
			'link',
			'lists',
			'table',
		]);
		expect(editor.props('toolbar')).toEqual([
			[
				'undo',
				'redo',
			],
			[
				'bold',
				'italic',
				'underline',
				'strikethrough',
			],
			[
				'fullscreen',
			],
			[
				'fontfamily',
				'fontsize',
			],
			[
				'alignleft',
				'aligncenter',
				'alignright',
				'alignjustify',
			],
			[
				'numlist',
				'bullist',
			],
			[
				'forecolor',
				'backcolor',
				'removeformat',
			],
			[
				'emoticons',
				'image',
				'link',
				'table',
			],
		]);
	});

	it("leaves plain text to ui-sdk's defaults", () => {
		const editor = mountEditor({
			output: 'text',
		}).findComponent(editorStub);

		expect(editor.props('plugins')).toBeUndefined();
		expect(editor.props('toolbar')).toBeUndefined();
	});

	it('gives the editor a string, whatever the seed was', () => {
		expect(
			mountEditor({
				value: 42,
			})
				.findComponent(editorStub)
				.props('modelValue'),
		).toBe('42');
		expect(mountEditor().findComponent(editorStub).props('modelValue')).toBe(
			'',
		);
	});

	it('re-emits edits as input, for the processing form', async () => {
		const wrapper = mountEditor();

		await wrapper
			.findComponent(editorStub)
			.vm.$emit('update:modelValue', '<p>Done</p>');

		expect(wrapper.emitted('input')?.[0]).toEqual([
			'<p>Done</p>',
		]);
	});
});
