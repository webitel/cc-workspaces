import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import OfflinePreview
  from '../../../../../src/components/agent-workspace/queue-section/call-queue/offline-queue/offline-queue-preview.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Other UIs', () => {
  let state;
  let store;
  let member;
  const name = 'jest';

  beforeEach(() => {
    member = {
      name,
    };
    state = {
      membersList: [member],
    };
    store = new Vuex.Store({
      modules: {
        member: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Correctly displays member name', () => {
    const wrapper = shallowMount(OfflinePreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        member,
      },
    });
    expect(wrapper.find('.queue-preview-header__name').text()).toEqual(name);
  });
});
