import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import callModule from '../../../../../../src/store/modules/call/call';
import ContactsContainer
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-contacts/workspace-contacts-container.vue';
import Contact
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-contacts/workspace-contact.vue';
import webSocketClientController
  from '../../../../../../src/api/agent-workspace/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

// Make new call on contact test
const mockCliCall = jest.fn();

jest.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(() => ({ call: mockCliCall }));

jest.mock('../../../../../../src/api/instance');

describe('Contacts functionality', () => {
  let state;
  const { actions } = callModule;
  let store;

  beforeEach(() => {
    state = {};
    store = new Vuex.Store({
      state: {
        client: webSocketClientController,
      },
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
      propsData: {
        item,
        callable: true,
      },
    });
    const callBtn = wrapper.findComponent({ name: 'wt-rounded-action' });
    callBtn.vm.$emit('click');

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
