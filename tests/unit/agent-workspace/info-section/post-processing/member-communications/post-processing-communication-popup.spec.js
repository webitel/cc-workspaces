import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CommunicationPopup
  from '../../../../../../src/components/agent-workspace/info-section/post-processing/member-communications/post-processing-communication-popup.vue';
import reporting
  from '../../../../../../src/store/modules/post-processing/post-processing';

const localVue = createLocalVue();
localVue.use(Vuex);

const communication = {
  destination: 'destination',
  type: { name: 'type' },
  priority: 1,
};

const tMock = jest.fn();

const vMock = {
  $touch: jest.fn(),
  $error: false,
  communication: {},
};

describe('Post Processing Communication Popup', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { reporting },
    });
    tMock.mockClear();
  });

  it('renders a component', () => {
    const wrapper = shallowMount(CommunicationPopup, {
      localVue, store, mocks: { $v: vMock },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('gets new communication title with "create" word', () => {
    shallowMount(CommunicationPopup, {
      localVue,
      store,
      mocks: { $v: vMock, $t: tMock },
      computed: {
        isNewCommunication() {
          return true;
        },
      },
    });
    expect(tMock.mock.calls[0][0].includes('createCommunicationTitle')).toBe(true);
  });

  it('gets edited communication title with "edit" word', () => {
    shallowMount(CommunicationPopup, {
      localVue,
      store,
      mocks: { $v: vMock, $t: tMock },
      computed: {
        isNewCommunication() {
          return false;
        },
      },
    });
    expect(tMock.mock.calls[0][0].includes('editCommunicationTitle')).toBe(true);
  });

  it('at new communication save button calls addCommunication with this communication', () => {
    const addCommunicationMock = jest.fn();
    jest.spyOn(CommunicationPopup.methods, 'addCommunication')
      .mockImplementation(addCommunicationMock);
    const wrapper = shallowMount(CommunicationPopup, {
      localVue,
      store,
      mocks: { $v: vMock },
      computed: {
        isNewCommunication() {
          return true;
        },
      },
    });
    wrapper.findAllComponents({ name: 'wt-button' }).at(0).vm.$emit('click');
    expect(addCommunicationMock).toHaveBeenCalledWith(wrapper.vm.communication);
  });

  it('at edited communication save button calls editCommunication with this communication', () => {
    const editCommunicationMock = jest.fn();
    jest.spyOn(CommunicationPopup.methods, 'editCommunication')
      .mockImplementation(editCommunicationMock);
    const wrapper = shallowMount(CommunicationPopup, {
      localVue,
      store,
      mocks: { $v: vMock },
      computed: {
        isNewCommunication() {
          return false;
        },
      },
    });
    wrapper.findAllComponents({ name: 'wt-button' }).at(0).vm.$emit('click');
    expect(editCommunicationMock).toHaveBeenCalledWith(wrapper.vm.communication);
  });
});
