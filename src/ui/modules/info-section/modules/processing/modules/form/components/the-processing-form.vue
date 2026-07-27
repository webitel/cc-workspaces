<template>
  <processing-wrapper
    ref="processing-form"
    :task="task"
  >
    <template v-if="formTitle" #title>
      {{ formTitle }}
    </template>
    <template #form>
      <!--      pass size prop only to form file component -->
      <component
        :is="processingComponent[el.view.component] || el.view.component"
        v-for="(el, key) of formBody"
        :key="el.id+key.toString()"
        v-model="el.value"
        :label-props="{ hint: el.view.hint }"
        :attempt-id="task.attempt.id"
        :component-id="el.id"
        :size="el.view.component === 'form-file' ? size : null"
        v-bind="el.view"
        @input="change({el, value: $event})"
        @call-table-action="sendTableAction"
      />
    </template>
    <template #actions>
      <wt-button
        v-for="(action) of formActions"
        :key="action.id"
        ref="form-action-buttons"
        :color="action.view.color"
        @click="sendForm({ action, task })"
      >{{ action.view.text || action.view.id }}
      </wt-button>
    </template>
  </processing-wrapper>

</template>

<script>
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { debounce } from 'lodash-es';
import { nextTick } from 'vue';
import { mapActions, mapGetters } from 'vuex';

import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import HotkeyAction from '../../../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../../../hotkeys/useHotkeys';
import processingModuleMixin from '../../../mixins/processingModuleMixin';
import { formattingFormBeforeSend } from '../../../script/formattingFormBeforeSend.js';
import FormCaseStatusSelect from './components/processing-form-case-status-select.vue';
import FormDatetimepicker from './components/processing-form-datetimepicker.vue';
import FormFile from './components/processing-form-file/processing-form-file.vue';
import FormIFrame from './components/processing-form-i-frame.vue';
import FormInputText from './components/processing-form-input-text.vue';
import FormSelect from './components/processing-form-select.vue';
import FormSelectFromObject from './components/processing-form-select-from-object/processing-form-select-from-object.vue';
import FormSelectService from './components/processing-form-select-service.vue';
import FormTable from './components/processing-form-table/processing-form-table.vue';
import FormText from './components/processing-form-text.vue';
import RichTextEditorSkeleton from './components/skeletons/rich-text-editor-skeleton.vue';

const AUTOSAVE_DEBOUNCE_MS = 1500;
const AUTOSAVE_BEFORE_TIMEOUT_MS = 1000;

export default {
	name: 'TheProcessingForm',
	components: {
		FormIFrame,
		FormText,
		FormSelect,
		FormInputText,
		FormSelectService,
		FormFile,
		FormDatetimepicker,
		FormSelectFromObject,
		FormTable,
		FormCaseStatusSelect,
		RichTextEditor: () => ({
			component: import('./components/rich-text-editor.vue'),
			loading: RichTextEditorSkeleton,
		}),
	},
	mixins: [
		processingModuleMixin,
		sizeMixin,
	],
	data: () => ({
		namespace: 'ui/infoSec/processing/form',
		processingComponent: {
			'wt-select': 'form-select',
			'wt-input': 'form-input-text',
			'wt-datetimepicker': 'form-datetimepicker',
			'form-i-frame': 'form-i-frame',
			'form-select-case-status': 'form-case-status-select',
		},
		hotkeyUnsubscribers: [],
		debouncedAutosave: null,
	}),
	computed: {
		...mapGetters('workspace', {
			isCall: 'IS_CALL_WORKSPACE',
		}),
		now() {
			return this.$store.state.ui.now.now;
		},
		formTitle() {
			return this.task.attempt.form?.title || '';
		},
		formBody() {
			return this.task.attempt.form?.body || [];
		},
		formMetadata() {
			return this.task.attempt.form?.metadata || {};
		},
		formActions() {
			return this.task.attempt.form?.actions || [];
		},
	},
	methods: {
		...mapActions({
			sendForm(dispatch, payload) {
				return dispatch(`${this.namespace}/SEND_FORM`, payload);
			},
			sendReporting(dispatch, payload) {
				return dispatch(`${this.namespace}/SEND_REPORTING`, payload);
			},
		}),
		initializeValues() {
			this.formBody.forEach((component) => {
				if (!this.shouldInitComponent(component)) return;

				if (component.view.component === 'wt-select') {
					component.value = this.getSelectInitialValue(
						component.view.initialValue,
						component.view.options,
					);
					return;
				}

				if (component.view.component === 'wt-datetimepicker') {
					component.value = this.getDatetimepickerInitialValue(
						component.view.initialValue,
						component.view,
					);
					return;
				}

				if (component.view.component === 'form-select-case-status') {
					component.value = this.getCaseStatusInitialValue(
						component.view.initialValue,
						component.view.options,
					);
					return;
				}

				component.value = this.parseInitialValueToJson(
					component.view.initialValue,
				);
			});

			this.task.attempt.form.metadata.isInited = true;
		},

		shouldInitComponent(component) {
			return isEmpty(component.value) && component.view.initialValue;
		},

		getSelectInitialValue(initialValue, options = []) {
			// For component wt-select we need get by initialValue value from options
			// https://webitel.atlassian.net/browse/WTEL-6742
			return (
				options.find((option) => option.value === initialValue) || initialValue
			);
		},

		getCaseStatusInitialValue(initialValue, options = []) {
			// For component case status select we need get by initialValue value from options or cleare value
			// https://webitel.atlassian.net/browse/WTEL-9188
			return options?.find((option) => option.id === Number(initialValue));
		},

		getDatetimepickerInitialValue(initialValue, { currentTime } = {}) {
			return currentTime || initialValue === 'now' ? Date.now() : initialValue;
		},

		parseInitialValueToJson(initialValue) {
			try {
				const parsed = JSON.parse(initialValue);

				// For component form-text if pass object without keys we need set null
				// https://webitel.atlassian.net/browse/WTEL-6568
				if (typeof parsed === 'object') {
					return Object.keys(parsed).length ? parsed : null;
				}

				return parsed;
			} catch {
				return initialValue;
			}
		},
		setupAutofocus() {
			const input =
				this.$refs['processing-form'].$el.querySelector('input, textarea');
			if (input && !input.className.includes('select')) input.focus();
		},
		setupHotkeys() {
			const subscripers = [
				{
					event: HotkeyAction.SUBMIT_FORM,
					callback: (event) => {
						// get digit form event.code. e.g "1" form "Digit1" string
						const digit = event.code[event.code.length - 1];
						const index = +digit - 1;
						const button = this.$refs['form-action-buttons'][index].$el;
						if (button) button.focus();
					},
				},
			];
			this.hotkeyUnsubscribers = useHotkeys(subscripers);
		},
		change({ el, value }) {
			el.value = value;
			nextTick(() => {
				// we have to save any changes from formBody in task (for back-end) https://webitel.atlassian.net/browse/WTEL-6153
				if (this.isCall)
					this.task.attempt.form.fields = formattingFormBeforeSend(
						this.formBody,
					);
				// pass the attempt so debounce.flush() re-invokes with the last one,
				// saving the right task even after keep-alive reuse for another task
				this.debouncedAutosave(this.task.attempt);
			});
		},
		autosaveForm(attempt) {
			if (!attempt?.form || !attempt.processingAutosave) return;
			const fields =
				attempt.form.fields ||
				formattingFormBeforeSend(attempt.form.body || []);
			attempt.saveForm(null, fields);
		},
		flushAutosave() {
			this.debouncedAutosave.flush();
		},
		handleVisibilityChange() {
			if (document.visibilityState === 'hidden') this.flushAutosave();
		},
		sendTableAction({ action, componentId, row }) {
			const vars = {
				[action]: row,
			};
			this.task.attempt.componentAction(componentId, action, vars);
			// https://webitel.atlassian.net/browse/WTEL-6707
		},
	},
	watch: {
		formBody: {
			handler(value) {
				if (value.length && !this.formMetadata.isInited) {
					this.task.attempt.form.metadata = {}; // init form metadata
					this.initializeValues();
				}
			},
			immediate: true,
		},
		// друга лінія: активний таск близько таймауту, а debounce міг не спрацювати
		// (оператор друкує без пауз) → форсуємо збереження, поки attempt живий
		now(currentNow) {
			const attempt = this.task.attempt;
			if (!attempt?.processingTimeoutAt) return;
			const msLeft = attempt.processingTimeoutAt - currentNow;
			if (msLeft > AUTOSAVE_BEFORE_TIMEOUT_MS || msLeft <= 0) return;
			this.flushAutosave();
		},
		// перемикання на інший таск: зберігаємо незбережені зміни попереднього,
		// поки спільний debounce-таймер не скасувався введенням у новий таск
		'task.attempt.id'() {
			this.flushAutosave();
		},
	},
	created() {
		this.debouncedAutosave = debounce(this.autosaveForm, AUTOSAVE_DEBOUNCE_MS);
	},

	mounted() {
		this.setupAutofocus();
		this.setupHotkeys();
		document.addEventListener('visibilitychange', this.handleVisibilityChange);
		window.addEventListener('pagehide', this.flushAutosave);
	},

	unmounted() {
		this.hotkeyUnsubscribers.forEach((unsubscribe) => {
			unsubscribe();
		});
		document.removeEventListener(
			'visibilitychange',
			this.handleVisibilityChange,
		);
		window.removeEventListener('pagehide', this.flushAutosave);
		this.flushAutosave();
		this.debouncedAutosave.cancel();
	},
};
</script>

<style lang="scss" scoped>
footer.processing-actions .wt-button:focus {
  // https://stackoverflow.com/questions/73658895/document-getelementbyid-focus-not-working-on-button
  outline: -webkit-focus-ring-color auto 1px;
}

.wt-select {
  :deep(.multiselect__content-wrapper) {
    z-index: calc(var(--p-galleria-mask-z-index) - 2);
  }
  :deep(.multiselect--active) {
    z-index: calc(var(--p-galleria-mask-z-index) - 2); // lowered z-index to prevent overlapping the gallery and video container
  }
}
</style>
