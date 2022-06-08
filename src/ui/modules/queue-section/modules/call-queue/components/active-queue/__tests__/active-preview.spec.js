import { shallowMount } from '@vue/test-utils';
import { CallActions, CallDirection } from 'webitel-sdk';
import ActivePreview
  from '../active-queue-preview.vue';

describe('Other UIs', () => {
  let call;
  const display = 'jest';

  beforeEach(() => {
    call = {
      displayName: display,
      displayNumber: display,
      isHold: true,
    };
  });

  it('Correctly displays call displayName', () => {
    const wrapper = shallowMount(ActivePreview, {
      propsData: { call },
    });
    expect(wrapper.find('.queue-preview-header__name').text()).toEqual(display);
  });

  it('Correctly displays call displayNumber', () => {
    const wrapper = shallowMount(ActivePreview, {
      propsData: { call },
    });
    expect(wrapper.find('.active-preview__number').text()).toEqual(display);
  });

  it('Correctly displays call displayQueueName', () => {
    call.task = {
      queue: { name: display },
    };
    const wrapper = shallowMount(ActivePreview, {
      propsData: { call },
    });
    expect(wrapper.findComponent({ name: 'wt-chip' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'wt-chip' }).text()).toBe(display);
  });

  it('if call has no queue, queue chip is absent', () => {
    call.task = {};
    const wrapper = shallowMount(ActivePreview, {
      propsData: { call },
    });
    expect(wrapper.find('.queue-preview-chips').exists()).toBe(false);
  });
});

describe('Preview Actions', () => {
  let call;

  beforeEach(() => {
    call = {
      state: CallActions.Ringing,
      direction: CallDirection.Inbound,
    };
  });

  it('Shows preview actions on Inbound Ringing', () => {
    const wrapper = shallowMount(ActivePreview, {
      propsData: { call },
    });
    expect(wrapper.find('.queue-preview-actions')
                  .exists())
      .toBeTruthy();
  });

  it('Shows preview actions on Preview Dialer', () => {
    call = {
      state: CallActions.Ringing,
      direction: CallDirection.Outbound,
      queue: { queue_type: 'preview' },
    };
    const wrapper = shallowMount(ActivePreview, {
      propsData: { call },
    });
    expect(wrapper.find('.queue-preview-actions')
                  .exists())
      .toBeTruthy();
  });

  it('Hides preview actions on Outbound calls', () => {
    call = {
      direction: CallDirection.Outbound,
    };
    const wrapper = shallowMount(ActivePreview, {
      propsData: { call },
    });
    expect(wrapper.find('.preview-actions')
                  .exists())
      .toBeFalsy();
  });
});
