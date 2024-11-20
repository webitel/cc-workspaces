<template>
  <processing-wrapper
    ref="processing-form"
    :task="task"
  >
    <template v-if="formTitle" v-slot:title>
      {{ formTitle }}
    </template>
    <template v-slot:form>
<!--      pass size prop only to form file component -->

<!--      тут пробував робити 2 окремих <component> для wt-select і для інших компонентів, але до толку я це не довів, та і таке рішення мені не подобається -->
      <component
        :is="processingComponent[el.view.component] || el.view.component"
        v-for="(el, key) of formBody"
        :key="el.id+key.toString()"
        v-model="el.value"
        :label-props="{ hint: el.view.hint }"
        :attempt-id="task.attempt.id"
        :size="el.view.component === 'form-file' ? size : null"
        v-bind="el.view"
      ></component>
    </template>
    <template v-slot:actions>
      <wt-button
        v-for="(action) of formActions"
        :key="action.id"
        :color="action.view.color"
        @click="sendForm({ action, task })"
        ref="form-action-buttons"
      >{{ action.view.text || action.view.id }}
      </wt-button>
    </template>
  </processing-wrapper>
</template>

<script>
import { mapActions } from 'vuex';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import processingModuleMixin from '../../../mixins/processingModuleMixin';
import FormIFrame from './components/processing-form-i-frame.vue';
import FormSelect from './components/processing-form-select.vue';
import FormText from './components/processing-form-text.vue';
import FormFile from './components/processing-form-file/processing-form-file.vue';
import RichTextEditorSkeleton from './components/skeletons/rich-text-editor-skeleton.vue';
import FormDatetimepicker from './components/processing-form-datetimepicker.vue';
import { useHotkeys } from '../../../../../../../hotkeys/useHotkeys';
import HotkeyAction from '../../../../../../../hotkeys/HotkeysActiom.enum';

export default {
  name: 'the-processing-form',
  mixins: [
    processingModuleMixin,
    sizeMixin,
  ],
  components: {
    FormIFrame,
    FormText,
    FormSelect,
    FormFile,
    FormDatetimepicker,
    RichTextEditor: () => ({
      component: import(
        './components/rich-text-editor.vue'
        ),
      loading: RichTextEditorSkeleton,
    }),
  },
  data: () => ({
    namespace: 'ui/infoSec/processing/form',
    processingComponent: {
      'wt-select': 'form-select',
      'wt-datetimepicker': 'form-datetimepicker',
      'form-i-frame': 'form-i-frame',
    },
    hotkeyUnsubscribers: [],
  }),
  computed: {
    formTitle() {
      return this.task.attempt.form?.title || '';
    },
    formBody() {
      return this.task.attempt.form?.body || [];
    },
    formActions() {
      return this.task.attempt.form?.actions || [];
    },
  },
  methods: {
    ...mapActions({
      sendForm(dispatch, payload) {
        console.log(JSON.stringify(this.formBody));
        return dispatch(`${this.namespace}/SEND_FORM`, payload).then(() => {
          this.formBody.forEach((component) => {
            if (component.view.component === 'wt-select') {
              // при тому що я чищу значення і if відпрацьовує, але баг такий самий
              component.value = '';
              console.log(component.value); // виводить пустий рядок, але в селекті баг такий самий
            }
          });
        });
      },
      sendReporting(dispatch, payload) {
        return dispatch(`${this.namespace}/SEND_REPORTING`, payload);
      },
    }),
    initializeValues() {
      this.formBody.forEach((component) => {
        if (isEmpty(component.value) && component.view.initialValue) {
          try {
            component.value = JSON.parse(component.view.initialValue);
          } catch {
            component.value = component.view.initialValue;
          }
        }
      });
    },
    setupAutofocus() {
      const input = this.$refs['processing-form'].$el.querySelector('input, textarea');
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
      this.hotkeyUnsubscribers  = useHotkeys(subscripers);
    },
  },
  // видаляв вотчер, баг відтворюється
  watch: {
    formBody: {
      handler() {
        this.initializeValues();
      },
      immediate: true,
    },
  },
  // видаляв маунтед, баг відтворюється
  mounted() {
    this.setupAutofocus();
    this.setupHotkeys();
  },

  unmounted() {
    this.hotkeyUnsubscribers((unsubscribe) => unsubscribe());
  }
};
</script>

<style lang="scss" scoped>
 footer.processing-actions .wt-button:focus {
    // https://stackoverflow.com/questions/73658895/document-getelementbyid-focus-not-working-on-button
    outline: -webkit-focus-ring-color auto 1px;
  }
</style>
