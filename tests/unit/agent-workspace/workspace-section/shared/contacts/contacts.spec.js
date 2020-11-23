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
  () => ({ getCliInstance: () => ({ call: mockCliCall }), destroyCliInstance: jest.fn() }));

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
    const wrapper = shallowMount(ContactsContainer, {
      store,
      localVue,
      stubs: { Icon: true },
      data: () => ({ dataList: userList, isLoading: false }),
    });
    expect(wrapper.findAllComponents(Contact).length)
      .toEqual(userList.length);
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
