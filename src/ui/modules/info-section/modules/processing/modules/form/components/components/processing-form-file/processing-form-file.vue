<template>
  <div class="processing-form-file">
    <div class="processing-form-file__icon">
      <wt-icon
        color="contrast"
        icon="docs"
        size="sm"
      ></wt-icon>
    </div>
    <h4 class="processing-form-file__title">
      {{ label }}
      <wt-hint
        v-if="hint"
      >{{ hint }}
      </wt-hint>
      <div class="processing-form-file__actions-wrapper">
<!--        <wt-tooltip v-if="readonly">-->
<!--          <template v-slot:activator>-->
<!--            <wt-icon-btn-->
<!--              icon="download"-->
<!--              @click="downloadAll"-->
<!--            ></wt-icon-btn>-->
<!--          </template>-->
<!--          {{ $t('reusable.downloadAll') }}-->
<!--        </wt-tooltip>-->
        <wt-icon-btn
          v-show="collapsible || !collapsed"
          :icon="collapsed ? 'arrow-right' : 'arrow-down'"
          @click="handleCollapse"
        ></wt-icon-btn>
      </div>
    </h4>
    <div
      v-show="!collapsible || !collapsed"
      class="processing-form-file__content-wrapper"
    >
      <form-file-line
        v-for="{ name, mime, size, id } of parseFiles"
        :id="id"
        :key="id"
        :name="name"
        :type="mime"
        :readonly="readonly"
        :size="size"
      ></form-file-line>
    </div>
    <!--    <input type="file" @input="handleFileInput">-->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import collapsibleProcessingFormComponentMixin from '../../../mixins/collapsibleProcessingFormComponentMixin';
import processingFormComponentMixin from '../../../mixins/processingFormComponentMixin';
import FormFileLine from './processing-form-file-line.vue';

export default {
  name: 'processing-form-file',
  components: { FormFileLine },
  mixins: [processingFormComponentMixin, collapsibleProcessingFormComponentMixin],
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    attemptId: {
      type: Number,
    },
  },
  computed: {
    ...mapState({
                  client: (state) => state.client,
                }),
    parseFiles() {
      return JSON.parse(this.initialValue);
    },
  },
  methods: {
    // downloadAll() {
    //   document.querySelectorAll('.processing-form-file-line__name').forEach((el) => el.click());
    // },
    async handleFileInput(event) {
      const files = Array.from(event.target.files);
      const client = await this.client.getCliInstance();
      const progress = (e) => { console.info(e); };
      const storedFiles = await client.storeFile(this.attemptId, files, progress);
      console.info(storedFiles, files);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>

.processing-form-file {
  position: relative;
  padding: var(--spacing-sm);
  border: 1px dashed var(--job-color);
  border-radius: var(--border-radius);

  .processing-form-file__icon {
    position: absolute;
    top: 0;
    right: var(--spacing-xs);
    padding: var(--spacing-3xs);
    line-height: 0;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    background: var(--job-color);
  }

  .processing-form-file__title {
    display: flex;
    align-items: center;
  }
}

.processing-form-file__actions-wrapper {
  display: flex;
  margin-left: auto;
  line-height: 0;
  gap: var(--spacing-xs);
}
</style>
