import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CommunicationPopup
  from '../../../../../../../src/ui/modules/info-section/modules/client-info/components/post-processing/member-communications/post-processing-communication-popup.vue';
import reporting
  from '../../../../../../../src/features/post-processing/store/post-processing';
import Reporting from '../../../../../../../src/features/post-processing/store/Reporting';

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
  draft: {},
};

const taskOnWorkspace = {};
taskOnWorkspace.postProcessData = new Reporting(taskOnWorkspace);

describe('Post Processing Communication Popup', () => {
  let store;

  beforeEach(() => {
    reporting.getters.TASK_POST_PROCESSING = () => taskOnWorkspace.postProcessData;
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
    expect(wrapper.emitted()['submit:add']).toBeTruthy();
  });

  it('at edited communication save button calls editCommunication with this communication', () => {
    const wrapper = shallowMount(CommunicationPopup, {
      localVue,
      store,
      mocks: { $v: vMock },
      propsData: { communication },
      computed: {
        isNewCommunication() {
          return false;
        },
      },
    });
    wrapper.findAllComponents({ name: 'wt-button' }).at(0).vm.$emit('click');
    expect(wrapper.emitted()['submit:edit'][0]).toEqual([communication]);
  });
});
