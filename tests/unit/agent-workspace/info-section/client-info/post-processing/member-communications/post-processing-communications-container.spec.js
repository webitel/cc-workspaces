import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CommunicationsContainer
  from '../../../../../../../src/components/agent-workspace/info-section/client-info/post-processing/member-communications/post-processing-communications-container.vue';
import reporting
  from '../../../../../../../src/store/modules/post-processing/post-processing';

const localVue = createLocalVue();
localVue.use(Vuex);

const commList = [{
  id: '123',
  destination: '123',
}];

const taskOnWorkspace = {
  memberCommunication: {},
  isMember: true,
  getMember: jest.fn(() => ({ communications: commList })),
};

describe('Existing member communication actions', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        reporting,
        workspace: {
          namespaced: true,
          getters: {
            TASK_ON_WORKSPACE: () => taskOnWorkspace,
          },
        },
      },
    });

    taskOnWorkspace.getMember.mockClear();
  });

  it('renders a component', () => {
    const wrapper = shallowMount(CommunicationsContainer, { store, localVue });
    expect(wrapper.exists()).toBe(true);
  });

  it('loads communications from getMember() task method and renders them', async () => {
    const wrapper = shallowMount(CommunicationsContainer, { store, localVue });
    await wrapper.vm.$nextTick(); // async gentMember() call
    expect(taskOnWorkspace.getMember).toHaveBeenCalled();
    const commComponents = wrapper.findAllComponents({ name: 'post-processing-communication' });
    expect(commComponents.length).toBe(commList.length);
  });

  it('at communication click, calls selectCommunication() method with clicked comm object', () => {
    const selectCommunicationMock = jest.fn();
    jest.spyOn(CommunicationsContainer.methods, 'selectCommunication')
      .mockImplementation(selectCommunicationMock);
    const wrapper = shallowMount(CommunicationsContainer, {
      store,
      localVue,
      computed: {
        communicationsList() {
          return commList;
        },
      },
    });
    wrapper.findAllComponents({ name: 'post-processing-communication' })
      .at(0)
      .trigger('click.native');
    expect(selectCommunicationMock).toHaveBeenCalledWith(commList[0]);
  });

  it('at communication edit event, calls editCommunication() method with this comm object', () => {
    const editCommunicationMock = jest.fn();
    jest.spyOn(CommunicationsContainer.methods, 'editCommunication')
      .mockImplementation(editCommunicationMock);
    const wrapper = shallowMount(CommunicationsContainer, {
      store,
      localVue,
      computed: {
        communicationsList() {
          return commList;
        },
      },
    });
    wrapper.findAllComponents({ name: 'post-processing-communication' })
      .at(0)
      .vm.$emit('edit');
    expect(editCommunicationMock).toHaveBeenCalledWith(commList[0]);
  });

  it('at communication delete event, calls deleteCommunication() method with this comm object', () => {
    const deleteCommunicationMock = jest.fn();
    jest.spyOn(CommunicationsContainer.methods, 'deleteCommunication')
      .mockImplementation(deleteCommunicationMock);
    const wrapper = shallowMount(CommunicationsContainer, {
      store,
      localVue,
      computed: {
        communicationsList() {
          return commList;
        },
      },
    });
    wrapper.findAllComponents({ name: 'post-processing-communication' })
      .at(0)
      .vm.$emit('delete');
    expect(deleteCommunicationMock).toHaveBeenCalledWith(commList[0]);
  });

  it('at button "add" click event, calls addCommunication() method', () => {
    const addCommunicationMock = jest.fn();
    jest.spyOn(CommunicationsContainer.methods, 'addCommunication')
      .mockImplementation(addCommunicationMock);
    const wrapper = shallowMount(CommunicationsContainer, { store, localVue });
    wrapper.getComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(addCommunicationMock).toHaveBeenCalled();
  });
});
