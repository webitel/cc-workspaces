import { mount } from '@vue/test-utils';
import { CallActions } from 'webitel-sdk';
import Bridge
  from '../call-bridge-container.vue';

describe('Bridge functionality', () => {
  const call1 = {
    id: 1,
    bridgeTo: vi.fn(),
    state: CallActions.Active,
  };
  const call2 = {
    id: 2,
    state: CallActions.Active,
  };

  const callOnWorkspace = call1;
  const callList = [call1, call2];

  const computed = {
    ...Bridge.computed,
    callOnWorkspace() {
      return callOnWorkspace;
    },
    callList() {
      return callList;
    },
  };

  it('Fills bridge list active calls', () => {
    const wrapper = mount(Bridge, {
      shallow: true,
      global: {
        stubs: {
          LookupItemContainer: false,
          MergeLookupItem: false,
        },
      },
      computed,
    });
    expect(wrapper.findAllComponents({ name: 'merge-lookup-item' }).length)
      .toEqual(callList.length - 1); // all except callOnWorkspace
  });

  it('Selects call and bridges them', () => {
    const mock = vi.fn();
    vi.spyOn(Bridge.methods, 'bridge')
      .mockImplementationOnce(mock);
    const wrapper = mount(Bridge, {
      shallow: true,
      global: {
        stubs: {
          LookupItemContainer: false,
          MergeLookupItem: false,
        },
      },
      computed,
    });
    wrapper.findComponent({ name: 'merge-lookup-item' })
           .vm
           .$emit('input', call2);
    expect(mock)
      .toHaveBeenCalledWith(call2);
  });
});
