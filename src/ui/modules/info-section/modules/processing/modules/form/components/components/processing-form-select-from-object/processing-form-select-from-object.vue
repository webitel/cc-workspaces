<template>
  Select from object
  $attrs {{ $attrs }}
  <br />
  object {{ object }}
  <wt-select
    :label="object.source?.name"
    :search-method="loadObjectList({
      path: object.source?.path,
      display,
    })"
    track-by="name"
    clearable
    @input="selectElement"
  />

  <!--  <wt-select-->
  <!--    v-if="false"-->
  <!--    v-bind="$attrs"-->
  <!--    :label="label"-->
  <!--    :value="value"-->
  <!--    :v="validation"-->
  <!--    :search-method="loadObjectList(lookup)"-->
  <!--    track-by="name"-->
  <!--    clearable-->
  <!--    :required="isRequired"-->
  <!--    v-on="$listeners"-->
  <!--    @input="selectElement"-->
  <!--  />-->
  <!--  <wt-select-->
  <!--    v-else-->
  <!--    v-bind="$attrs"-->
  <!--    :label="label"-->
  <!--    :value="value"-->
  <!--    :v="validation"-->
  <!--    :search-method="loadObjectList(lookup)"-->
  <!--    track-by="name"-->
  <!--    clearable-->
  <!--    multiple-->
  <!--    :required="isRequired"-->
  <!--    v-on="$listeners"-->
  <!--    @input="selectElements"-->
  <!--  />-->
</template>

<script setup>
import { computed, defineProps, onMounted, useAttrs } from 'vue';

import ObjectApi from './api/objects.js';

const props = defineProps({
  object: {
    type: Object,
    required: true,
  },
});

const attrs = useAttrs();

const display = computed(() => {
  return 'name';
});

const loadObjectList = ({ path, display, primary }) => {
  return () => {
    return ObjectApi.getLookup({ path, display, primary });
  };
};

const selectElement = (value) => {
  console.log('selectElement', value);
};

onMounted(() => {
  console.log('object', props.object);

  console.log('attrs', attrs);
});
</script>

<style lang="scss" scoped>

</style>
