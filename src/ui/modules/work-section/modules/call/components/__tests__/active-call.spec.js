import { shallowMount, mount } from '@vue/test-utils';
import { CallActions, CallDirection } from 'webitel-sdk';
import TheCall
  from '../../the-call.vue';
import CallPreview
  from '../call-preview.vue';
import CallHeader
  from '../call-header.vue';
import Numpad
  from '../call-numpad/numpad.vue';
import Transfer
  from '../call-transfer/call-transfer-container.vue';
import Bridge
  from '../call-merge/call-bridge-container.vue';

describe('call on call component', () => {
  it('Draws Active component when ringing event fires', async () => {
    const call = {
      direction: CallDirection.Inbound,
      state: CallActions.Ringing,
    };
    const wrapper = mount(TheCall, {
      shallow: true,
      global: {
        stubs: {
          CallPreview: false,
        },
      },
      computed: {
        ...TheCall.computed,
        call: () => call,
      },
    });
    expect(wrapper.findComponent(CallPreview)
                  .exists())
      .toBeTruthy();
  });

  it('Draws Preview component when Outbound Call '
       + 'from preview dialer is set', async () => {
    const call = {
      direction: CallDirection.Outbound,
      queue: { queue_type: 'preview' },
      state: CallActions.Ringing,
    };
    const wrapper = mount(TheCall, {
      shallow: true,
      global: {
        stubs: {
          CallPreview: false,
        },
      },
      computed: {
        ...TheCall.computed,
        call: () => call,
      },
    });
    expect(wrapper.findComponent(CallPreview)
                  .exists())
      .toBeTruthy();
  });

  it('Draws Preview component when Inbound Call ringing call is set', async () => {
    const call = {
      direction: CallDirection.Inbound,
      state: CallActions.Ringing,
    };
    const wrapper = mount(TheCall, {
      shallow: true,
      global: {
        stubs: {
          CallPreview: false,
        },
      },
      computed: {
        ...TheCall.computed,
        call: () => call,
      },
    });
    expect(wrapper.findComponent(CallPreview)
                  .exists())
      .toBeTruthy();
  });
});

describe('Make new call functionality', () => {
  it('Draws a numpad on open', async () => {
    const call = {
      _isNew: true,
    };
    const wrapper = mount(TheCall, {
      shallow: true,
      global: {
        stubs: {
          TaskContainer: false,
          Numpad: false,
        },
      },
      computed: {
        ...TheCall.computed,
        call: () => call,
      },
    });
    const numpad = wrapper.findComponent(Numpad);
    expect(numpad.isVisible())
      .toBeTruthy();
  });
});

describe('Transfer functionality', () => {
  it('Opens transfer tab on event emit', async () => {
    const call = { state: CallActions.Active };
    const wrapper = mount(TheCall, {
      shallow: true,
      global: {
        stubs: {
          TaskContainer: false,
          CallHeader: false,
          Transfer: false,
        },
      },
      computed: {
        ...TheCall.computed,
        call: () => call,
      },
    });
    const callHeader = wrapper.findComponent(CallHeader);
    callHeader.vm.$emit('openTab', 'transfer');
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(Transfer)
                  .exists())
      .toBeTruthy();
  });

  it('Opens transfer tab on transfer event from preview', async () => {
    const call = {
      state: CallActions.Ringing,
      direction: CallDirection.Inbound,
    };
    const wrapper = mount(TheCall, {
      shallow: true,
      global: {
        stubs: {
          TaskContainer: false,
          CallPreview: false,
          Transfer: false,
        },
      },
      computed: {
        ...TheCall.computed,
        call: () => call,
      },
    });
    wrapper.findComponent(CallPreview).vm.$emit('transfer');
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(Transfer)
                  .exists())
      .toBeTruthy();
  });
});

describe('Bridge functionality', () => {
  it('Opens bridge tab on event emit', async () => {
    const call = {
      state: CallActions.Active,
    };
    const wrapper = mount(TheCall, {
      shallow: true,
      global: {
        stubs: {
          TaskContainer: false,
          CallHeader: false,
          Bridge: false,
        },
      },
      computed: {
        ...TheCall.computed,
        call: () => call,
      },
    });

    const callHeader = wrapper.findComponent(CallHeader);
    callHeader.vm.$emit('openTab', 'bridge');
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(Bridge)
                  .exists())
      .toBeTruthy();
  });
});
