import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import callModule from '../../../../../src/store/modules/call/call';
import CallFooter
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-footer.vue';
import RoundedAction from '../../../../../src/components/utils/rounded-action.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Footer buttons', () => {
  let state;
  const { actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace: {
        mute: jest.fn(),
        muted: false,

        toggleHold: jest.fn(),
        isHold: false,
        allowHold: true,
      },
    };
    store = new Vuex.Store({
      modules: {
        call: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });
  });

  it('opens numpad', () => {
    const wrapper = shallowMount(CallFooter, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const numpad = wrapper.findAll(RoundedAction).wrappers[0];
    numpad.trigger('click');
    expect(wrapper.emitted().openTab[0]).toEqual(['numpad']);
  });

  it('Mutes call', () => {
    const wrapper = shallowMount(CallFooter, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const mute = wrapper.find('.call-action__mic');
    expect(mute.classes())
      .not
      .toContain('hidden');
    mute.trigger('click');
    expect(state.callOnWorkspace.mute)
      .toHaveBeenCalledWith(!state.callOnWorkspace.muted);
  });

  it('Holds call', () => {
    const wrapper = shallowMount(CallFooter, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const hold = wrapper.findAll(RoundedAction).wrappers[2];
    expect(hold.classes())
      .not
      .toContain('hidden');
    hold.trigger('click');
    expect(state.callOnWorkspace.toggleHold)
      .toHaveBeenCalled();
  });
});
