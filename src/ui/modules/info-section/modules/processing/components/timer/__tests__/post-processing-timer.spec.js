import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import nowModule from '@webitel/cc-ui-sdk/src/store/modules/now/reactive-now';
import ProcessingTimer from '../processing-timer.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
  modules: { now: nowModule },
});

describe('Post Processing Timer', () => {
  const mountOptions = {
    localVue,
    store,
    props: {},
    computed: {},
  };
  let now;
  beforeEach(() => {
    now = nowModule.state.now;
    mountOptions.props = {
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
    const wrapper = shallowMount(ProcessingTimer, mountOptions);
    expect(wrapper.exists()).toBe(true);
  });
  it('correctly computes processingSecLeft', () => {
    const wrapper = shallowMount(ProcessingTimer, mountOptions);
    expect(wrapper.vm.processingSecLeft).toBe(10);
  });
  it('correctly computes processingEndSec', () => {
    const wrapper = shallowMount(ProcessingTimer, mountOptions);
    expect(wrapper.vm.processingEndSec).toBe(30);
  });
  it('correctly computes processingProgressSec', () => {
    const wrapper = shallowMount(ProcessingTimer, mountOptions);
    expect(wrapper.vm.processingProgressSec).toBe(20);
  });
  it('correctly computes showRenewalButton with truthy value', () => {
    const wrapper = shallowMount(ProcessingTimer, mountOptions);
    expect(wrapper.vm.showRenewalButton).toBe(true);
  });
  it('correctly computes showRenewalButton with truthy value', () => {
    const wrapper = shallowMount(ProcessingTimer, mountOptions);
    expect(wrapper.vm.showRenewalButton).toBe(true);
  });
  it('at plus click emits "click" event', () => {
    const wrapper = mount(ProcessingTimer, mountOptions);
    wrapper.findComponent({ name: 'wt-icon-btn' }).vm.$emit('click');
    expect(wrapper.emitted().click.length).toBe(1);
  });
});
