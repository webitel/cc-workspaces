import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PostProcessingTimer from '../../../../../../../src/components/agent-workspace/info-section/client-info/post-processing/_internals/post-processing-timer.vue';
import nowModule from '../../../../../../../src/store/modules/reactive-now/reactive-now';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
  modules: { now: nowModule },
});

describe('Post Processing Timer', () => {
  const mountOptions = {
    localVue,
    store,
    propsData: {},
    computed: {},
  };
  let now;
  beforeEach(() => {
    now = nowModule.state.now;
    mountOptions.propsData = {
      startProcessingAt: now,
      processingTimeoutAt: now + 30 * 1000,
      renewalSec: 15,
      processingSec: 30,
    };

    const localNow = now + 20 * 1000;
      mountOptions.computed = {
      now() { return localNow; },
    };
  });
  it('renders a component', () => {
    const wrapper = shallowMount(PostProcessingTimer, mountOptions);
    expect(wrapper.exists()).toBe(true);
  });
  it('correctly computes processingSecLeft', () => {
    const wrapper = shallowMount(PostProcessingTimer, mountOptions);
    expect(wrapper.vm.processingSecLeft).toBe(10);
  });
  it('correctly computes processingEndSec', () => {
    const wrapper = shallowMount(PostProcessingTimer, mountOptions);
    expect(wrapper.vm.processingEndSec).toBe(30);
  });
  it('correctly computes processingProgressSec', () => {
    const wrapper = shallowMount(PostProcessingTimer, mountOptions);
    expect(wrapper.vm.processingProgressSec).toBe(20);
  });
  it('correctly computes showRenewalButton with truthy value', () => {
    const wrapper = shallowMount(PostProcessingTimer, mountOptions);
    expect(wrapper.vm.showRenewalButton).toBe(true);
  });
  it('correctly computes showRenewalButton with truthy value', () => {
    const wrapper = shallowMount(PostProcessingTimer, mountOptions);
    expect(wrapper.vm.showRenewalButton).toBe(true);
  });
  it('at plus click emits "click" event', () => {
    const wrapper = shallowMount(PostProcessingTimer, mountOptions);
    wrapper.findComponent({ name: 'wt-icon-btn' }).vm.$emit('click');
    expect(wrapper.emitted().click.length).toBe(1);
  });
});
