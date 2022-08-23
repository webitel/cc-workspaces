import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import findRoundedActionByIcon from '../../../../../../../../tests/utils/findRoundedActionByIcon';
import callModule from '../../../../../../../features/modules/call/call';
import CallFooter
  from '../call-footer.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Footer buttons', () => {
  let getters;
  let store;
  let callOnWorkspace;

  beforeEach(() => {
    callOnWorkspace = {
        // id: 1,
        mute: jest.fn(),
        muted: false,

        toggleHold: jest.fn(),
        isHold: false,
        allowHold: true,
    };
    getters = {
      CALL_ON_WORKSPACE: () => callOnWorkspace,
      // callList: [callOnWorkspace],
    };
    store = new Vuex.Store({
      modules: {
        features: {
          namespaced: true,
          modules: {
            call: {
              ...callModule,
              getters,
            },
          },
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
    expect(callOnWorkspace.mute)
      .toHaveBeenCalledWith(!callOnWorkspace.muted);
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
    expect(callOnWorkspace.toggleHold)
      .toHaveBeenCalled();
  });
});
