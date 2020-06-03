<template>
  <div class="ws-worksection">
    <search
      v-model="search"
      @search="loadInitialList"
    />
    <p class="ws-worksection__list-instruction">{{$t('transfer.selectAgent')}}</p>
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
    >{{$t('transfer.transfer')}}
    </btn>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import Btn from '../../../../utils/btn.vue';
  import Contact from '../workspace-contacts/workspace-contact.vue';
  import APIRepository from '../../../../../api/APIRepository';

  const usersAPI = APIRepository.users;

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
      fields: ['name', 'id', 'extension', 'presence'],
    }),

    methods: {
      select(item) {
        this.selected = item;
      },

      fetch(params) {
        return usersAPI.getUsers(params);
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
