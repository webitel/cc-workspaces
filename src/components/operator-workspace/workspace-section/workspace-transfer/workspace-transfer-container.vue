<template>
  <div class="ws-worksection">
    <search v-model="search"></search>
    <div class="ws-worksection__list">
      <!-- div class="ws-contacts-letter-wrap">-->
      <!--        <div class="ws-contact-letter">A</div>-->
      <contact
        v-for="(item, key) of dataList"
        :class="{'selected': item === selected}"
        :key="key"
        :item="item"
        @click.native="select(item)"
      ></contact>
      <!--      </div>-->
    </div>
    <btn
      class="transfer"
      :disabled="!selected"
      @click.native="transfer(selected)"
    >Transfer
    </btn>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { getUsersList } from '../../../../api/operator-workspace/users';
  import Btn from '../../../utils/btn.vue';
  import Search from '../../../utils/search-input.vue';
  import Contact from '../workspace-contacts/workspace-contact.vue';

  export default {
    name: 'workspace-transfer-container',
    components: {
      Btn,
      Search,
      Contact,
    },

    data: () => ({
      dataList: [],
      selected: null,
      search: '',
    }),

    mounted() {
      this.loadDataList();
    },

    methods: {
      select(item) {
        this.selected = item;
      },

      async loadDataList(value) {
        this.dataList = await getUsersList(value);
      },

      ...mapActions('operator', {
        transfer: 'TRANSFER',
      }),
    },
  };
</script>

<style lang="scss" scoped>

  .ws-contact-item {
    border: calcRem(1px) solid transparent;
    border-radius: $border-radius;
    transition: $transition;
    cursor: pointer;

    &.selected {
      border-color: $accent-color;
    }
  }

  .cc-btn {
    display: block;
    margin: auto;
  }
</style>
