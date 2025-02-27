<template>
<!-- show form-file only if its write mode, or if it has value to show -->
  <article
    v-if="isFormFile"
    class="processing-form-file"
    @dragenter.prevent="handleDragEnter"
  >
    <dropzone
      v-show="!readonly && isDropzoneVisible"
      @drop="handleDrop"
      @dragenter.prevent
      @dragleave.prevent="handleDragLeave"
    ></dropzone>

    <confirmation-popup
      v-show="deletedFile"
      @close="deletedFile = null"
      @confirm="handleDeleteConfirm"
    >
      <template v-slot:text>
        {{ $t('infoSec.processing.form.formFile.deleteConfirmation') }}
      </template>
    </confirmation-popup>

    <header class="processing-form-file__title">
      {{ label }}
      <wt-hint
        v-if="hint"
      >{{ hint }}
      </wt-hint>

      <aside class="processing-form-file__icon">
        <wt-icon
          color="contrast"
          icon="docs"
          size="sm"
        ></wt-icon>
      </aside>
      <div class="processing-form-file__actions-wrapper">
        <wt-tooltip v-if="readonly">
          <template v-slot:activator>
            <wt-icon-btn
              icon="download"
              @click="downloadAll"
            ></wt-icon-btn>
          </template>
          {{ $t('reusable.downloadAll') }}
        </wt-tooltip>
        <wt-tooltip
          v-if="!readonly"
          class="processing-form-file-attach"
        >
          <template v-slot:activator>
            <wt-icon-btn
              icon="attach"
              @click="$refs['file-input'].click()"
            ></wt-icon-btn>
            <input
              ref="file-input"
              class="processing-form-file-attach__input"
              multiple
              type="file"
              @input="handleFileInput"
            >
          </template>
          {{ $t('reusable.import') }}
        </wt-tooltip>
        <wt-icon-btn
          v-show="collapsible || !collapsed"
          :icon="collapsed ? 'arrow-right' : 'arrow-down'"
          @click="handleCollapse"
        ></wt-icon-btn>
      </div>
    </header>

    <section
      v-show="!collapsible || !collapsed"
      class="processing-form-file__content-wrapper"
    >
      <!--   :key by id or name+index cause uploading files doesnt have an id   -->
      <form-file-line
        v-for="(file, index) of value.concat(uploadingSnapshots)"
        :key="file.id || file.name + index"
        :file="file"
        :readonly="readonly"
        :size="size"
        @delete="askDeleteFile(file)"
      ></form-file-line>
      <p
        class="processing-form-file__empty-wrapper"
        v-show="!value.concat(uploadingSnapshots).length"
      >{{ $t('infoSec.processing.form.formFile.empty') }}</p>
    </section>
  </article>
</template>

<script>
import { reactive } from 'vue';
import { mapState } from 'vuex';
import JSZip from 'jszip';
import jszipUtils from 'jszip-utils';
import saveAs from 'file-saver';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import ConfirmationPopup from '../../../../../../../../../app/components/utils/confirmation-popup.vue';
import dropzoneMixin from '../../../../../../../../../app/mixins/dropzoneMixin.js';
import sizeMixin from '../../../../../../../../../app/mixins/sizeMixin.js';
import collapsibleProcessingFormComponentMixin from '../../mixins/collapsibleProcessingFormComponentMixin.js';
import processingFormComponentMixin from '../../mixins/processingFormComponentMixin.js';
import FormFileLine from './processing-form-file-line.vue';

const makeFileSnapshot = (file) => reactive({
  name: file.name,
  mime: file.type,
  size: file.size,
  metadata: {
    progress: {
      total: 0,
      loaded: 0,
    },
    done: false,
    close: false,
    error: false,
  },
});

export default {
  name: 'processing-form-file',
  components: { FormFileLine, ConfirmationPopup },
  mixins: [
    processingFormComponentMixin,
    collapsibleProcessingFormComponentMixin,
    dropzoneMixin,
    sizeMixin,
  ],
  props: {
    value: {
      type: Array,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    attemptId: {
      type: Number,
    },
  },
  data: () => ({
    uploadingSnapshots: [],
    deletedFile: null,
  }),
  computed: {
    ...mapState({
                  client: (state) => state.client,
                }),
    isFormFile() {
      return !this.readonly || !isEmpty(this.value);
    },
  },
  methods: {
    async downloadAll() {
      const zip = new JSZip();
      const cli = await this.client.getCliInstance();
      // eslint-disable-next-line no-restricted-syntax
      for (const { name, id } of this.value) {
        const url = cli.fileUrlDownload(id);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve, reject) => {
          jszipUtils.getBinaryContent(url, (err, file) => {
            if (err) reject(err);
            console.info(file);
            zip.file(name, file);
            resolve();
          });
        });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, this.label);
    },
    handleDrop(e) {
      Array.from(e.dataTransfer.files).forEach((file) => this.uploadFile(file));
      this.handleDragLeave();
    },
    async handleFileInput(event) {
      Array.from(event.target.files).forEach((file) => this.uploadFile(file));
      this.$refs['file-input'].value = ''; // reset input value
    },
    async uploadFile(uploadedFile) {
      this.collapsed = false; // open, if collapsed
      const snapshot = makeFileSnapshot(uploadedFile);
      this.uploadingSnapshots.push(snapshot);

      try {
        const fileUploadProgress = ({ loaded, total }) => {
          snapshot.metadata.progress = { loaded, total };
        };
        const client = await this.client.getCliInstance();
        const storedFile = await client.storeFile(this.attemptId, [uploadedFile], fileUploadProgress);

        this.handleFileSuccessUpload({ snapshot, file: storedFile });
      } catch (err) {
        this.handleFileErrorUpload({ snapshot, err });
      }
    },

    handleFileSuccessUpload({ snapshot, file }) {
      // eslint-disable-next-line no-param-reassign
      snapshot.metadata.done = true;

      setTimeout(() => {
        this.uploadingSnapshots.splice(this.uploadingSnapshots.indexOf(snapshot), 1);
        this.addStoredFile(file);
      }, 1600);
    },

    handleFileErrorUpload({ snapshot }) {
      // eslint-disable-next-line no-param-reassign
      snapshot.metadata.error = true;

      setTimeout(() => {
        // eslint-disable-next-line no-param-reassign
        snapshot.metadata.close = () => (
          this.uploadingSnapshots.splice(this.uploadingSnapshots.indexOf(snapshot), 1)
        );
      }, 1600);
    },

    addStoredFile(file) {
      this.$emit('input', this.value.concat(file));
    },

    handleDeleteConfirm() {
      const array = this.value.filter(({ id }) => id !== this.deletedFile.id);
      this.$emit('input', array);
    },

    askDeleteFile(file) {
      this.deletedFile = file;
    },
  },
};
</script>

<style lang="scss" scoped>
.processing-form-file {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) var(--spacing-sm);
  border: 1px dashed var(--job-color);
  border-radius: var(--border-radius);
  gap: var(--spacing-sm);

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

.processing-form-file-attach {
  &__input {
    display: none;
  }
}

.processing-form-file__empty-wrapper {
  text-align: center;
  padding: var(--spacing-sm);
}
</style>
