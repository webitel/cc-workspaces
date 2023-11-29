<template>
  <form
    class="add-contact"
    :class="[`add-contact--${props.size}`]"
  >
    <wt-input
      :value="draft.name.commonName"
      :label="t('reusable.name')"
      required
      prevent-trim
      @input="draft.name.commonName = $event"
    ></wt-input>
    <wt-select
      :value="draft.timezones[0]?.timezone"
      :label="t('infoSec.contacts.timezone')"
      :search-method="TimezonesAPI.getLookup"
      @input="draft.timezones[0] = { timezone: $event }"
    ></wt-select>
    <wt-select
      :value="draft.managers[0]?.user"
      :label="t('infoSec.contacts.manager')"
      :search-method="UsersAPI.getLookup"
      @input="draft.managers[0] = { user: $event }"
    ></wt-select>
    <wt-tags-input
      :value="draft.labels"
      :label="t('vocabulary.labels', 2)"
      :search-method="LabelsAPI.getList"
      option-label="label"
      track-by="label"
      taggable
      @input="draft.labels = $event"
    ></wt-tags-input>
    <wt-textarea
      :value="draft.about"
      :label="t('vocabulary.description')"
      @input="draft.about = $event"
    ></wt-textarea>

    <div class="add-contact-actions">
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
      <wt-button
        :loading="isSaving"
        @click="save"
      >
        {{ t('reusable.add') }}
      </wt-button>
    </div>
  </form>

</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import TimezonesAPI from '../../api/TimezonesAPI';
import UsersAPI from '../../api/UsersAPI';
import LabelsAPI from '../../api/LabelsAPI';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const emit = defineEmits([
  'close',
]);

const store = useStore();
const { t } = useI18n();
const isSaving = ref(false);

const draft = ref({
  name: {
    commonName: '',
  },
  timezones: [],
  managers: [],
  labels: [],
  about: '',
  createdBy: '',
});

function close() {
  emit('close');
}

async function save() {
  try {
    isSaving.value = false;
    store.dispatch(`${props.namespace}/ADD_CONTACT`, draft.value);
    close();
  } finally {
    isSaving.value = false;
  }
}
</script>

<style lang="scss" scoped>
.add-contact {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xs);
  gap: var(--spacing-xs);

  &-actions {
    display: flex;
    gap: var(--spacing-xs);

    .wt-button {
      width: 100%;
    }
  }

  &--sm {
    .add-contact-actions {
      flex-direction: column;

      .wt-button:last-child {
        order: 1; /////не працює
      }
    }
  }
}
</style>
