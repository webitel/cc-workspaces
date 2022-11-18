<template>
  <article class="processing-form-file" @dragenter.prevent="handleDragEnter">
    <dropzone
      v-show="isDropzoneVisible"
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
        <!--        <wt-tooltip v-if="readonly">-->
        <!--          <template v-slot:activator>-->
        <!--            <wt-icon-btn-->
        <!--              icon="download"-->
        <!--              @click="downloadAll"-->
        <!--            ></wt-icon-btn>-->
        <!--          </template>-->
        <!--          {{ $t('reusable.downloadAll') }}-->
        <!--        </wt-tooltip>-->
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
        @delete="askDeleteFile(file)"
      ></form-file-line>
    </section>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import ConfirmationPopup from '../../../../../../../../../../app/components/utils/confirmation-popup.vue';
import dropzoneMixin from '../../../../../../../../../../app/mixins/dropzoneMixin';
import collapsibleProcessingFormComponentMixin from '../../../mixins/collapsibleProcessingFormComponentMixin';
import processingFormComponentMixin from '../../../mixins/processingFormComponentMixin';
import FormFileLine from './processing-form-file-line.vue';

const makeFileSnapshot = (file) => ({
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
  },
  methods: {
    // downloadAll() {
    //   document.querySelectorAll('.processing-form-file-line__name').forEach((el) => el.click());
    // },
    handleDrop(e) {
      Array.from(e.dataTransfer.files).forEach((file) => this.uploadFile(file));
      this.handleDragLeave();
    },
    async handleFileInput(event) {
      Array.from(event.target.files).forEach((file) => this.uploadFile(file));
      this.$refs['file-input'].value = ''; // reset input value
    },
    async uploadFile(uploadedFile) {
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
        console.info(err);
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

    handleDeleteConfirm(file) {
      const value = this.value.slice();
      value.splice(this.value.indexOf(file), 1);
      this.$emit('input', value);
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
</style>
