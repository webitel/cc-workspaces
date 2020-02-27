<template>
  <div class="ws-contacts-container">
    <form class="search-wrap">
      <input class="search" type="text">
    </form>
    <div class="ws-contacts-wrap">
      <contact
        v-for="(item, key) of dataList"
        :class="{'selected': item === selected}"
        :key="key"
        :item="item"
        @click.native="select(item)"
      ></contact>
      <button @click="transfer(selected)">Transfer!</button>
      <!--      <div class="ws-contacts-letter-wrap">-->
      <!--        <div class="ws-contact-letter">A</div>-->
      <!--        <contact-->
      <!--          :class="{'selected': true}"-->
      <!--          @click.native="select"-->
      <!--        ></contact>-->
      <!--        <contact></contact>-->
      <!--      </div>-->
      <!--      <div class="ws-contacts-letter-wrap">-->
      <!--        <div class="ws-contact-letter">A</div>-->
      <!--        <contact></contact>-->
      <!--        <contact></contact>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { getUsersList } from '../../../../api/operator-workspace/users';
  import Contact from '../workspace-contacts/workspace-contact.vue';

  export default {
    name: 'workspace-transfer-container',
    components: {
      Contact,
    },

    data: () => ({
      dataList: [],
      selected: null,
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
  .selected {
    border: 1px solid #ef6119;
  }
</style>
