import Combinations from "../enums/Combinations.enum";

const state = {
  currentCallId: '',
  hotkeys: {
    [Combinations.SHIFTA]: false, // Answer
    [Combinations.SHIFTZ]: false, // Hangup
    [Combinations.ENTER]: false, // New call
    [Combinations.SHIFTM]: false // Mute
  }
};
const mutations = {
  SET_HOTKEY_STATE: (state, { hotkey, isActive }) => {
    state.hotkeys[hotkey] = isActive;
  },
  SET_CURRENT_CALL_ID: (state, callId) => {
    state.currentCallId = callId;
  }
};

const actions = {
  HANDLE_HOTKEY: async (context, event) => {
    const client = await context.rootState.client.getCliInstance();
    const callList = client.allCall();
    const callId =  callList[0].id; // we take the first callId in queue
  
    const answerCombination = event.shiftKey && event.key.toLowerCase() === 'a';
    const hangupCombination = event.shiftKey && event.key.toLowerCase() === 'z';
    const muteCombination = event.shiftKey && event.key.toLowerCase() === 'm';
    const newCallCombination = event.key.toLowerCase() === 'enter';
  
    if (answerCombination) context.dispatch('ANSWER', callId);
  
    if (hangupCombination) context.dispatch('HANGUP', callId);
  
    if (newCallCombination) context.dispatch('NEW_CALL');
  
    if (muteCombination) context.dispatch('MUTE');
  },

  ANSWER: (context, callId) => {
    // Answer to call
    context.commit('SET_CURRENT_CALL_ID', callId) // set current call id for proper hangup 
    context.commit('SET_HOTKEY_STATE', { hotkey: Combinations.SHIFTA, isActive: true });
    context.dispatch('features/call/ANSWER', callId, {root: true});
  },

  HANGUP: (context) => {
    // Hangup current call
    context.commit('SET_HOTKEY_STATE', { hotkey: Combinations.SHIFTZ, isActive: true });
    context.dispatch('features/call/HANGUP', context.state.currentCallId, {root: true}) ;
  },

  NEW_CALL: (context) => {
    // New call
    context.commit('SET_HOTKEY_STATE', { hotkey: Combinations.ENTER, isActive: true });

  },

  MUTE: (context) => {
    // Mute
    context.commit('SET_HOTKEY_STATE', { hotkey: Combinations.SHIFTM, isActive: true });
    context.dispatch('features/call/TOGGLE_MUTE', context.state.currentCallId, {root: true});
  }
};
const getters = {
   // Get current hotkey
   GET_HOTKEY_STATE: state => hotkey => state.hotkeys[hotkey]
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}