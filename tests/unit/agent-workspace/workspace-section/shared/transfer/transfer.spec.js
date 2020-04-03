import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import axiosInstance from '../../../../../../src/api/instance';
import callModule from '../../../../../../src/store/modules/call/call';
import Transfer
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-transfer/workspace-transfer-container.vue';
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
    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ items: userList }));
    const wrapper = shallowMount(Transfer, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick();
    // expect(axiosInstance.get).toHaveBeenCalled();
    await wrapper.vm.$nextTick();
    // expect(wrapper.vm.dataList).toHaveLength(1);
    expect(wrapper.findAll(Contact).length)
      .toEqual(1);
  });

  it('Selects user and transfers call', async () => {
    const userList = [
      {
        id: '36',
        name: '180',
        username: '180',
        extension: '180',
      },
    ];
    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ items: userList }));
    const wrapper = shallowMount(Transfer, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    wrapper.find(Contact)
      .trigger('click');
    wrapper.find('.transfer')
      .trigger('click');
    const userExtension = userList[0].extension;
    expect(state.callOnWorkspace.blindTransfer)
      .toHaveBeenCalledWith(userExtension);
  });
});
