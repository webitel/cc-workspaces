import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import findRoundedActionByIcon from '../../../../utils/findRoundedActionByIcon';
import callModule from '../../../../../src/store/modules/call/call';
import CallFooter
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-footer.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Footer buttons', () => {
  let state;
  let store;

  beforeEach(() => {
    const callOnWorkspace = {
        // id: 1,
        mute: jest.fn(),
        muted: false,

        toggleHold: jest.fn(),
        isHold: false,
        allowHold: true,
    };
    state = {
      callOnWorkspace,
      // callList: [callOnWorkspace],
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
    const numpad = findRoundedActionByIcon('numpad')(wrapper);
    numpad.vm.$emit('click');
    expect(wrapper.emitted().openTab[0]).toEqual(['numpad']);
  });

  it('Mutes call', () => {
    const wrapper = shallowMount(CallFooter, {
      store,
      localVue,
    });
    const mute = findRoundedActionByIcon('mic')(wrapper);
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
    const hold = findRoundedActionByIcon('hold')(wrapper);
    expect(hold.classes())
      .not
      .toContain('hidden');
    hold.vm.$emit('click');
    expect(state.callOnWorkspace.toggleHold)
      .toHaveBeenCalled();
  });
});
