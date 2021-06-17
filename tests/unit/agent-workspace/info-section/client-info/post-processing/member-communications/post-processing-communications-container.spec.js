import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CommunicationsContainer
  from '../../../../../../../src/components/agent-workspace/info-section/client-info/post-processing/member-communications/post-processing-communications-container.vue';
import reportingModule
  from '../../../../../../../src/store/modules/post-processing/post-processing';
import Reporting from '../../../../../../../src/store/modules/post-processing/Reporting';

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
  let reporting;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        reporting: reportingModule,
        workspace: {
          namespaced: true,
          getters: {
            TASK_ON_WORKSPACE: () => taskOnWorkspace,
          },
        },
      },
    });

    taskOnWorkspace.getMember.mockClear();

    reporting = new Reporting(taskOnWorkspace);
    taskOnWorkspace.postProcessData = reporting;
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

  it('at communication click, calls selectNextCommunication() method with clicked comm object', () => {
    const selectCommunicationMock = jest.fn();
    jest.spyOn(reporting, 'selectNextCommunication')
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

  it('at communication edit event, calls startCommunicationEditing() method with this comm object', () => {
    const startCommunicationEditingMock = jest.fn();
    jest.spyOn(reporting, 'startCommunicationEditing')
      .mockImplementation(startCommunicationEditingMock);
    const wrapper = shallowMount(CommunicationsContainer, { store, localVue });
    const editedComm = commList[0];
    wrapper.findAllComponents({ name: 'post-processing-communication' })
      .at(0)
      .vm.$emit('edit', editedComm);
    expect(startCommunicationEditingMock).toHaveBeenCalledWith(editedComm);
  });

  it('at communication delete event, calls deleteCommunication() method with this comm object', () => {
    const deleteCommunicationMock = jest.fn();
    jest.spyOn(reporting, 'deleteCommunication')
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

  it('at button "add" click event, calls startCommunicationAdding() method', () => {
    const startCommunicationAdding = jest.fn();
    jest.spyOn(reporting, 'startCommunicationAdding')
      .mockImplementation(startCommunicationAdding);
    const wrapper = shallowMount(CommunicationsContainer, { store, localVue });
    wrapper.getComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(startCommunicationAdding).toHaveBeenCalled();
  });
});
