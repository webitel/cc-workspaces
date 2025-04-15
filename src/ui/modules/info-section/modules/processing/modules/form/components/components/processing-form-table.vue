<template>
  <div class="form-select-service">
    <wt-expansion-panel
      :size="props.size"
      collapsed
    >
      <template #title>

      </template>
      <template #default>
        {{ flowData.table.displayColumns }}
        <wt-table
          :data="dataList"
          :headers="flowData.table.displayColumns"
          :selectable="false"
          :grid-actions="false"
        >
          <template v-if="" #[actionSlotName]>
            <wt-button>

            </wt-button>
          </template>
        </wt-table>
      </template>
    </wt-expansion-panel>
  </div>
</template>

<script setup lang="ts">

import { ComponentSize } from '@webitel/ui-sdk/src/enums/index.js';
import { computed } from 'vue';
// import { defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: ComponentSize.MD,
  },
});

// const emit = defineEmits([
//   'input',
// ]);

console.log('props:', props);

// const { t } = useI18n();

const flowData = {
  table: {
    source: [
      [
        {
          id: "805",
          name: "=>",
          piu: "buuuueeeeeeeeeeee -(",
          piu2: '<3',
        },
        {
          id: "804",
          name: "Anna Tvorydlo",
          piu: "pink",
          piu2: 'static',
        },
        {
          id: "803",
          name: "Anna Tvorydlo",
          piu: "xcc",
          piu2: '123456789909876543211234567890098765432112345678900987654321',
        },
        {
          id: "802",
          name: "тест_802",
          piu: "Blocker",
          piu2: '-_-',
        },
      ]

    ], // тупо масив для заповнення таблиці
    isSystemSource: false,
    // systemSource: {
    //   path: string, // посилання, по якому тягнути данні для таблиці
    //   name: 'case', // чого і нахуя?
    // },
    displayColumns: [
      {
        // name: 'Name',
        value: 'name',
        field: 'name',
        width: '45',
        text: 'Name',
        show: true,
      },
      {
        // name: 'Piu',
        value: 'piu',
        field: 'piu',
        width: '100px',
        text: 'Piu',
        show: true,
      },
      {
        value: 'piu2',
        // name: 'Piu2',
        field: 'piu2',
        text: 'Piu2',
        show: true,
      },
    ],
  },
  actions: [
    {
      field: 'piu',
      action: 'action', // тут має буть айдішка екшена, яку я передаватиму в вб метод?
      buttonName: 'ACTION',
      color: 'success',
    },
  ],
}

const dataList = computed(() => {
  if(flowData.table.isSystemSource) return [] /// робити запит на бек по посиланню
  return flowData.table.source
});

</script>
