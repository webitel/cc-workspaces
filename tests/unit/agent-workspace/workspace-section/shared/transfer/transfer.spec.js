import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import callModule from '../../../../../../src/store/modules/call/call';
import Transfer
  from '../../../../../../src/components/agent-workspace/workspace-section/call/call-transfer/workspace-transfer-container.vue';
import Contact
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-contacts/workspace-contact.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../../../../src/api/instance');

describe('Transfer functionality', () => {
  let state;
  const { actions } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace: {
        blindTransfer: jest.fn(),
      },
    };
    store = new Vuex.Store({
      modules: {
        call: {
          namespaced: true,
          state,
          actions,
        },
      },
    });
  });

  it('Fills transfer list with users from API', async () => {
    const userList = [
      {
        id: '36',
        name: '180',
        username: '180',
        extension: '180',
      },
    ];
    const wrapper = shallowMount(Transfer, {
      store,
      localVue,
      data: () => ({ dataList: userList, isLoading: false }),
    });
    expect(wrapper.findAllComponents(Contact).length)
      .toEqual(1);
  });

  it('Selects user and transfers call', () => {
    const userList = [
      {
        id: '36',
        name: '180',
        username: '180',
        extension: '180',
      },
    ];
    const wrapper = shallowMount(Transfer, {
      store,
      localVue,
      data: () => ({ dataList: userList, isLoading: false }),
    });
    wrapper.findComponent(Contact).trigger('click');
    const transferBtn = wrapper.findComponent({ name: 'wt-button' });
    transferBtn.vm.$emit('click');
    const userExtension = userList[0].extension;
    expect(state.callOnWorkspace.blindTransfer)
      .toHaveBeenCalledWith(userExtension);
  });
});
