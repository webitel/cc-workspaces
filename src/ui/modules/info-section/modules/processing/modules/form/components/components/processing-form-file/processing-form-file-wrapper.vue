<template>
  <div class="processing-form-file-wrapper">
    <div class="processing-form-file-wrapper__attach">
      <wt-icon
        color="contrast"
        icon="attach"
        size="sm"
      ></wt-icon>
    </div>
    <h4 class="processing-form-file-wrapper__title">
      {{ label }}
      <wt-hint
        v-if="hint"
      >{{ hint }}
      </wt-hint>
    </h4>
    <form-file
      v-for="el of parseFiles"
      :key="el.id"
      v-bind="el"
    ></form-file>
    <input type="file" @input="handleFileInput">
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import FormFile from './processing-form-file.vue';

export default {
  name: 'processing-form-file-wrapper',
  components: {
    FormFile,
  },
  props: {
    initialValue: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
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
    async handleFileInput(event) {
      const files = Array.from(event.target.files);
      const client = await this.client.getCliInstance();
      const progress = (e) => { console.info(e); };
      const storedFiles = await client.storeFile(this.attemptId, files, progress);
      console.info(storedFiles, files);
    },
  },
};
</script>

<style lang="scss" scoped>

.processing-form-file-wrapper {
  position: relative;
  padding: var(--spacing-sm);
  border: 1px dashed var(--job-color);
  border-radius: var(--border-radius);

  .processing-form-file-wrapper__attach {
    position: absolute;
    top: 0;
    right: var(--spacing-xs);
    padding: var(--spacing-3xs);
    line-height: 0;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    background: var(--job-color);
  }

  .processing-form-file-wrapper__title {
    display: flex;
    align-items: center;
  }
}
</style>
