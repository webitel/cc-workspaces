import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CommunicationsContainer
  from '../../../../../../src/components/agent-workspace/info-section/post-processing/member-communications/post-processing-communications-container.vue';
import Communication
  from '../../../../../../src/components/agent-workspace/info-section/post-processing/member-communications/post-processing-communication.vue';
import postProcessingModule
  from '../../../../../../src/store/modules/post-processing/post-processing';

const localVue = createLocalVue();
localVue.use(Vuex);

const callOnWorkspace = {
  memberCommunication: {},
};

describe('Existing member communication actions', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace,
    };
    store = new Vuex.Store({
      state,
      modules: {
        reporting: postProcessingModule,
        call: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Initially draws existing communication', () => {
    const wrapper = shallowMount(CommunicationsContainer, {
      store,
      localVue,
      propsData: { v: { newCommunications: { $each: [] } } },
      mocks: {
        $t: () => {
        },
      },
      stubs: { Icon: true },
    });
    expect(wrapper.find(Communication)).toBeTruthy();
  });

  it('Updates communication on change event', async () => {
    const wrapper = shallowMount(CommunicationsContainer, {
      store,
      localVue,
      propsData: { v: { newCommunications: { $each: [] } } },
      mocks: {
        $t: () => {
        },
      },
      stubs: { Icon: true },
    });
    const updComm = {
      destination: '11',
    };
    expect(wrapper.vm.changedCommunication).toBeNull();
    wrapper.find(Communication).vm.$emit('change', updComm);
    expect(wrapper.vm.changedCommunication).toEqual(updComm);
  });
});

describe('New member communications actions', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace,
    };
    store = new Vuex.Store({
      state,
      modules: {
        reporting: postProcessingModule,
        call: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Adds new form for communication on Plus click', async () => {
    const wrapper = shallowMount(CommunicationsContainer, {
      store,
      localVue,
      propsData: { v: { newCommunications: { $each: [] } } },
      mocks: {
        $t: () => {
        },
      },
      stubs: { Icon: true },
    });
    const commLength = wrapper.findAll(Communication).length;
    wrapper.find('.processing-communications-container__add-new').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(Communication).length).toEqual(commLength + 1);
  });

  it('Updates new communication on change event', () => {
    const newComm = {};
    store.state.reporting.newCommunications.push(newComm);
    const wrapper = shallowMount(CommunicationsContainer, {
      store,
      localVue,
      propsData: { v: { newCommunications: { $each: [] } } },
      mocks: {
        $t: () => {
        },
      },
      stubs: { Icon: true },
    });
    const updComm = {
      destination: '11',
    };
    wrapper.findAll(Communication).wrappers.pop()
      .vm.$emit('change', updComm);
    expect(wrapper.vm.newCommunications.pop()).toEqual(updComm);
  });

  it('Deletes new communication on delete event', () => {
    const newComm = {};
    store.state.reporting.newCommunications.push(newComm);
    const wrapper = shallowMount(CommunicationsContainer, {
      store,
      localVue,
      propsData: { v: { newCommunications: { $each: [] } } },
      mocks: {
        $t: () => {
        },
      },
      stubs: { Icon: true },
    });
    const newCommLength = wrapper.vm.newCommunications.length;
    wrapper.findAll(Communication).wrappers.pop()
      .vm.$emit('delete', newCommLength - 1);
    expect(wrapper.vm.newCommunications.length).toEqual(newCommLength - 1);
  });
});
