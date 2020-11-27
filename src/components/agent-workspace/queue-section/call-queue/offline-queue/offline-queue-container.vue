<template>
  <section class="queue-task-container" ref="scroll-wrap">
    <offline-preview
      v-for="(member, key) of dataList"
      :member="member"
      :key="member.id"
      @click.native.prevent="openMember(key)"
    ></offline-preview>
    <observer/>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import OfflinePreview from './offline-queue-preview.vue';
import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';

export default {
  name: 'offline-queue-container',
  mixins: [infiniteScrollMixin],
  components: {
    OfflinePreview,
  },

  computed: {
    ...mapState('member', {
      dataList: (state) => state.membersList,
    }),
  },

  methods: {
    loadDataList() {
      this.loadList({ search: this.search, page: this.page, size: this.size });
    },

    ...mapActions('member', {
      loadList: 'LOAD_DATA_LIST',
      openMember: 'OPEN_MEMBER_ON_WORKSPACE',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../../css/agent-workspace/queue-section/queue-task-container';
</style>
