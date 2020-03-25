<template>
  <div class="ws-worksection">
    <p class="ws-worksection__list-instruction">Active calls</p>
    <div id="scroll-wrap" class="ws-worksection__list" ref="scroll-wrap">
      <!-- div class="ws-contacts-letter-wrap">-->
      <!--        <div class="ws-contact-letter">A</div>-->
      <active-call/>
      <active-call
        :class="{'selected': call === selected}"
        v-for="(call, key) of callList"
        :call="call"
        :key="key"
        @click.native="select(call)"
      ></active-call>
      <!--      </div>-->
    </div>
    <btn
      class="transfer"
      :disabled="!selected"
      @click.native="transfer(selected)"
    >Bridge
    </btn>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import Btn from '../../../utils/btn.vue';
  import ActiveCall from './active-call-item.vue';

  export default {
    name: 'workspace-transfer-container',
    components: {
      Btn,
      ActiveCall,
    },

    data: () => ({
      selected: null,
    }),

    computed: {
      ...mapState('workspace', {
        callList: (state) => state.callList,
      }),
    },

    methods: {
      select(item) {
        this.selected = item;
      },

      ...mapActions('workspace', {
        // transfer: 'TRANSFER',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .ws-worksection .ws-worksection__list {
    flex-grow: 0;
    overflow: auto;
  }

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
