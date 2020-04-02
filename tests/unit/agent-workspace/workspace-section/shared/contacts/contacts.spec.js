import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import axiosInstance from '../../../../../../src/api/instance';
import callModule from '../../../../../../src/store/modules/call/call';
import ContactsContainer
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-contacts/workspace-contacts-container.vue';
import Contact
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-contacts/workspace-contact.vue';

const localVue = createLocalVue();
localVue.use(Vuex);


// Make new call on contact test
const mockCliCall = jest.fn();
jest.mock('../../../../../../src/api/agent-workspace/call-ws-connection',
  () => () => ({ call: mockCliCall }));

jest.mock('../../../../../../src/api/instance');

describe('Contacts functionality', () => {
  let state;
  const { actions } = callModule;
  let store;

  beforeEach(() => {
    state = {};
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

  it('Fills contacts list with users from API', async () => {
    const userList = [
      {
        id: '36',
        name: '180',
        username: '180',
        extension: '180',
      },
    ];
    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ items: userList }));
    const wrapper = shallowMount(ContactsContainer, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick();
    // expect(axiosInstance.get).toHaveBeenCalled();
    await wrapper.vm.$nextTick();
    // expect(wrapper.vm.dataList).toHaveLength(1);
    expect(wrapper.findAll(Contact).length)
      .toEqual(userList.length);
  });

  it('Properly fills contacts with items from list', async () => {
    const userList = [
      {
        id: '36',
        name: '180',
        username: '180',
        extension: '180',
      },
    ];
    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ items: userList }));
    const wrapper = shallowMount(ContactsContainer, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const contact = wrapper.find(Contact);
    expect(contact.vm.item.id)
      .toEqual(userList[0].id);
    // const userExtension = userList[0].extension;
    // expect(state.callOnWorkspace.blindTransfer)
    //   .toHaveBeenCalledWith(userExtension);
  });

  it('Selects user and makes a new call', async () => {
    const item = {
      id: '36',
      name: '180',
      username: '180',
      extension: '180',
      presence: {},
    };
    const wrapper = shallowMount(Contact, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        item,
        callable: true,
      },
    });
    const btn = wrapper.find('.call');
    btn.trigger('click');

    // then mock a getCliInstance fn
    // and check if cli.call() fn is triggered with proper destination
    await wrapper.vm.$nextTick();
    expect(mockCliCall)
      .toHaveBeenCalled();
    // FIRST CALL FIRST PARAM
    expect(mockCliCall.mock.calls[0][0].destination)
      .toEqual(item.extension);
  });
});
