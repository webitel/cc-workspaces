import { mapActions, mapState } from 'vuex';
import LookupItem from '../lookup-item.vue';

export default {
  components: { LookupItem },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('workspace', {
      activeItemCallHistory: (state) => state.activeItemCallHistory,
    }),
  },
  methods: {
    ...mapActions('workspace', {
      setActiveItemCallHistory: 'SET_ACTIVE_ITEM_CALL_HISTORY',
    }),
    handleInput() {
      this.setActiveItemCallHistory(this.item.id === this.activeItemCallHistory ? '' : this.item.id);
      this.$emit('input', this.item);
    },
  },
};
