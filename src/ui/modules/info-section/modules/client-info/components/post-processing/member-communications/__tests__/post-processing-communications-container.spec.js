import { shallowMount } from '@vue/test-utils';
import CommunicationsContainer
  from '../post-processing-communications-container.vue';
import Reporting
  from '../../../../../../../../../features/modules/reporting/store/Reporting';

const commList = [
  {
    id: '123',
    destination: '123',
  },
];

const taskOnWorkspace = {
  memberCommunication: {},
  isMember: true,
  getMember: jest.fn(() => ({ communications: commList })),
};

let taskPostProcessing;
let reporting;

describe('Existing member communication actions', () => {
  beforeEach(() => {
    taskOnWorkspace.getMember.mockClear();
    reporting = new Reporting(taskOnWorkspace);
    taskOnWorkspace.postProcessData = reporting;
    taskPostProcessing = reporting;
  });

  const computed = {
    taskPostProcessing() {
      return taskPostProcessing;
    },
  };

  it('renders a component', () => {
    const wrapper = shallowMount(CommunicationsContainer, { computed });
    expect(wrapper.exists()).toBe(true);
  });

  it('loads communications from getMember() task method and renders them', async () => {
    const wrapper = shallowMount(CommunicationsContainer, { computed });
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
      computed: {
        ...computed,
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
    const wrapper = shallowMount(CommunicationsContainer, { computed });
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
      computed: {
        ...computed,
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
    const wrapper = shallowMount(CommunicationsContainer, { computed });
    wrapper.getComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(startCommunicationAdding).toHaveBeenCalled();
  });
});
