import { shallowMount, mount } from '@vue/test-utils';
import MemberHeader
  from '../member-header.vue';

const member = {};

const computed = {
  ...MemberHeader.computed,
  member() {
    return member;
  },
};

describe('Member header', () => {
  it('Hides "Call" btn if no were communications selected', () => {
    const wrapper = shallowMount(MemberHeader, {
      computed: {
        ...computed,
        isCommSelected() { return false; },
      },
    });
    expect(wrapper.find('.call')
      .exists())
      .toBeFalsy();
  });

  it('Shows "Call" btn if communication was selected', () => {
    const wrapper = mount(MemberHeader, {
      computed: {
        ...computed,
        isCommSelected() { return true; },
      },
    });
    const callBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(1);
    expect(callBtn.classes()).not.toContain('hidden');
  });

  it('Calls to member', () => {
    const mock = vi.fn();
    vi.spyOn(MemberHeader.methods, 'makeCall')
      .mockImplementationOnce(mock);
    const wrapper = mount(MemberHeader, {
      computed: {
        ...computed,
        isCommSelected() { return true; },
      },
    });
    const callBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(1);
    callBtn.vm.$emit('click');
    expect(mock).toHaveBeenCalled();
  });
});
