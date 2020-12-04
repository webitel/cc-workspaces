import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import callModule from '../../../../../src/store/modules/call/call';
import CallFooter
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-footer.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Footer buttons', () => {
  let state;
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
          ...callModule,
          state,
        },
      },
    });
  });

  it('opens numpad', () => {
    const wrapper = shallowMount(CallFooter, {
      store,
      localVue,
    });
    const numpad = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(0);
    numpad.vm.$emit('click');
    expect(wrapper.emitted().openTab[0]).toEqual(['numpad']);
  });

  it('Mutes call', () => {
    const wrapper = shallowMount(CallFooter, {
      store,
      localVue,
    });
    const mute = wrapper.find('.call-action__mic');
    expect(mute.classes())
      .not
      .toContain('hidden');
    mute.vm.$emit('click');
    expect(state.callOnWorkspace.mute)
      .toHaveBeenCalledWith(!state.callOnWorkspace.muted);
  });

  it('Holds call', () => {
    const wrapper = shallowMount(CallFooter, {
      store,
      localVue,
    });
    const hold = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(2);
    expect(hold.classes())
      .not
      .toContain('hidden');
    hold.vm.$emit('click');
    expect(state.callOnWorkspace.toggleHold)
      .toHaveBeenCalled();
  });
});
