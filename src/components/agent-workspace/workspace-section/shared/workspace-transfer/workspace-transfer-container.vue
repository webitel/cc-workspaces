<template>
  <div class="ws-worksection">
    <search
      v-model="search"
      @search="loadDataList"
    />
    <p class="ws-worksection__list-instruction">Please select an agent</p>
    <div class="ws-worksection__list" ref="scroll-wrap">
      <!-- div class="ws-contacts-letter-wrap">-->
      <!--        <div class="ws-contact-letter">A</div>-->
      <contact
        v-for="(item, key) of dataList"
        :class="{'selected': item === selected}"
        :id="`scroll-item-${key}`"
        :key="key"
        :item="item"
        @click.native="select(item)"
      ></contact>
      <!--      </div>-->
      <observer
        :options="obsOptions"
        @intersect="handleIntersect"/>
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
  import { getUsersList } from '../../../../../api/agent-workspace/users';
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import Btn from '../../../../utils/btn.vue';
  import Contact from '../workspace-contacts/workspace-contact.vue';

  export default {
    name: 'workspace-transfer-container',
    mixins: [infiniteScrollMixin],
    components: {
      Btn,
      Contact,
    },

    data: () => ({
      dataList: [],
      selected: null,
    }),

    methods: {
      select(item) {
        this.selected = item;
      },

      async loadDataList() {
        const response = await getUsersList(this.page, this.size, this.search);
        this.dataList = [...this.dataList, ...response];
      },

      ...mapActions('call', {
        transfer: 'TRANSFER',
      }),
    },
  };
</script>

<style lang="scss" scoped>

  .ws-contact-item {
    border: calcVH(1px) solid transparent;
    border-radius: $border-radius;
    transition: $transition;
    cursor: pointer;

    &.selected, &:hover {
      border-color: $accent-color;
    }
  }

  .cc-btn {
    display: block;
    margin: calcVH(17px) auto auto;
  }
</style>
