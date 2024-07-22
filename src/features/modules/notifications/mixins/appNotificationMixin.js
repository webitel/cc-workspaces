import { mapActions, mapGetters } from 'vuex';

// ATTENTION! Mixin must be imported into the-agent-workspace to correctly notify new call ringing!
// This mixin is needed for watcher to watch ringing; it is not possible to watch inside store

export default {
  watch: {
    isAnyRinging(value) {
      console.log('CALL_ON_WORKSPACE', this.call, 'state:', this.state);
      if (value) this.playRinging();
      //якщо коллстейт = хендгап, то НЕ робити стоп плеїнг
      //додати тут умову і перевірку на екшен(якось) бо якщо не дзвонить АЛЕ це дзвінок і трубку поклали, то не потрібно стоп плеінг блять.
      else this.stopPlaying();
    },
  },

  computed: {
    ...mapGetters('features/call', {
      isAnyRinging: 'IS_ANY_RINGING',
    }),
    ...mapGetters('workspace', {
      call: 'TASK_ON_WORKSPACE',
      state: 'WORKSRACE_STATE',
    }),
  },

  methods: {
    ...mapActions('features/notifications', {
      playRinging: 'HANDLE_ANY_CALL_RINGING',
      stopPlaying: 'STOP_SOUND',
    }),
  },
};
