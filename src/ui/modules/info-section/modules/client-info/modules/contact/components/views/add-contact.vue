<template>
  <form
    class="add-contact"
    :class="[`add-contact--${props.size}`]"
  >
    <div>
      <wt-input
        :value="draft.name.commonName"
        :label="t('reusable.name')"
        :v="v$.draft.name.commonName"
        required
        prevent-trim
        @input="draft.name.commonName = $event"
      ></wt-input>
      <wt-select
        :value="draft.timezones[0]?.timezone"
        :label="t('date.timezone', 1)"
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
    </div>
    <div class="add-contact__actions">
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
      <wt-button
        :loading="isLoading"
        :disabled="v$.$invalid"
        @click="save"
      >
        {{ t('reusable.add') }}
      </wt-button>
    </div>
  </form>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
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

const v$ = useVuelidate(computed(() => ({
  draft: {
    name: {
      commonName: { required },
    },
  },
})), { draft }, { $autoDirty: true });

v$.value.$touch();

const userinfo = computed(() => store.state.ui.userinfo);
const isLoading = computed(() => getNamespacedState(store.state, props.namespace).isLoading);

function close() {
  emit('close');
}

async function save() {
  await store.dispatch(`${props.namespace}/ADD_CONTACT`, draft.value);
  close();
}

function setDefaultManager() {
  draft.value.managers[0] = {
    user: {
      id: userinfo.value.userId,
      name: userinfo.value.name,
    },
  };
}

onMounted(() => setDefaultManager());
</script>

<style lang="scss" scoped>
.add-contact {
  display: flex;
  gap: var(--spacing-xs);
  flex-direction: column;
  padding: var(--spacing-xs);

  &__actions {
    display: flex;
    gap: var(--spacing-xs);

    .wt-button {
      width: 100%;
    }
  }

  &--sm {
    .add-contact__actions {
      flex-direction: column;
    }
  }
}
</style>
