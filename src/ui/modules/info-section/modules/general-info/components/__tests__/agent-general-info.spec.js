import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import GeneralInfoTab from '../general-info-tab.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const agent = {};
const LOAD_AGENT_INFO_MOCK = jest.fn();

const store = new Vuex.Store({
                               modules: {
                                 features: {
                                   namespaced: true,
                                   modules: {
                                     status: {
                                       namespaced: true,
                                       state: { agent },
                                     },
                                   },
                                 },
                                 agentInfo: {
                                   namespaced: true,
                                   state: {
                                     status: {},
                                     queues: [],
                                     pauseCauses: [],
                                   },
                                   actions: {
                                     LOAD_AGENT_INFO: LOAD_AGENT_INFO_MOCK,
                                   },
                                 },
                               },
                             });

const mountOptions = {
  localVue,
  store,
};

describe('General Info Tab', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(GeneralInfoTab, mountOptions);
    expect(wrapper.exists()).toBe(true);
  });
  it('calls LOAD_AGENT_INFO after agent change', async () => {
    const wrapper = shallowMount(GeneralInfoTab, mountOptions);
    store.state.features.status.agent = {}; // update agent and trigger watcher
    await wrapper.vm.$nextTick();
    expect(LOAD_AGENT_INFO_MOCK).toHaveBeenCalled();
  });
});
