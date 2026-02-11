import { mount } from '@vue/test-utils';

import MemberCommunications from '../member-communications.vue';

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
		const wrapper = mount(MemberCommunications, {
			shallow: true,
			global: {
				stubs: {
					LookupItemContainer: false,
				},
			},
			computed,
		});
		expect(wrapper.findAll('.member-communications__item').length).toEqual(
			member.communications.length,
		);
	});

	it('Selects member communication', async () => {
		const mock = vi.fn();
		vi.spyOn(
			MemberCommunications.methods,
			'selectCommunication',
		).mockImplementationOnce(mock);
		const wrapper = mount(MemberCommunications, {
			shallow: true,
			global: {
				stubs: {
					LookupItemContainer: false,
				},
			},
			computed,
		});
		wrapper.find('.member-communications__item').trigger('click');
		expect(mock).toHaveBeenCalledWith(member.communications[0]);
	});

	it('Draws border around selected communication', async () => {
		const mock = vi.fn();
		vi.spyOn(
			MemberCommunications.methods,
			'selectCommunication',
		).mockImplementationOnce(mock);
		const wrapper = mount(MemberCommunications, {
			shallow: true,
			global: {
				stubs: {
					LookupItemContainer: false,
				},
			},
			computed,
		});
		const comm = wrapper.find('.member-communications__item');
		comm.trigger('click');
		expect(mock).toHaveBeenCalled();
	});
});
