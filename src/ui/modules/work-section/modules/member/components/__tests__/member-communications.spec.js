import { shallowMount } from '@vue/test-utils';
import MemberCommunications
  from '../member-communications.vue';

describe('Member communications', () => {

  const member = {
    name: 'jest',
    communications: [
      {
        type: 'jest',
        destination: 'jest',
        id: 1,
      },
    ],
  };

  const computed = {
    ...MemberCommunications.computed,
    communications() {
      return member.communications;
    },
    selectedCommId() {
      return member.communications[0].id;
    },
  };

  it('Draws member communications from member communications list', async () => {
    const wrapper = shallowMount(MemberCommunications, {
      computed,
    });
    expect(wrapper.findAll('.workspace-member-communication')
      .length)
      .toEqual(member.communications.length);
  });

  it('Selects member communication', async () => {
    const mock = jest.fn();
    jest.spyOn(MemberCommunications.methods, 'selectCommunication').mockImplementationOnce(mock);
    const wrapper = shallowMount(MemberCommunications, {
      computed,
    });
    wrapper.find('.workspace-member-communication').trigger('click');
    expect(mock).toHaveBeenCalledWith(member.communications[0]);
  });

  it('Draws border around selected communication', async () => {
    const mock = jest.fn();
    jest.spyOn(MemberCommunications.methods, 'selectCommunication').mockImplementationOnce(mock);
    const wrapper = shallowMount(MemberCommunications, {
      computed,
    });
    const comm = wrapper.find('.workspace-member-communication');
    comm.trigger('click');
    expect(mock).toHaveBeenCalled();
  });
});
