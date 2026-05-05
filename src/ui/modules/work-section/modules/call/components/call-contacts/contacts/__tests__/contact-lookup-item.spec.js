import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import ContactLookupItem from '../contact-lookup-item.vue';

const buildStore = () =>
	createStore({
		modules: {
			ui: {
				namespaced: true,
				modules: {
					infoSec: {
						namespaced: true,
						modules: {
							client: {
								namespaced: true,
								modules: {
									contact: {
										namespaced: true,
										getters: {
											READ_ONLY_CONTACT_LINK: () => () => 'link',
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});

describe('ContactLookupItem', () => {
	it('renders a component', () => {
		const item = {
			name: {},
			phones: [],
			id: 'vi',
		};
		const wrapper = shallowMount(ContactLookupItem, {
			props: {
				item,
			},
			global: {
				plugins: [
					buildStore(),
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('correctly emits call event with phone number when there is only one phone', () => {
		const phone = {
			number: 'vi ',
		};
		const item = {
			name: {},
			phones: [
				phone,
			],
			id: 'vi',
		};

		const wrapper = mount(ContactLookupItem, {
			shallow: true,
			props: {
				item,
			},
			global: {
				stubs: {
					LookupItem: false,
					LookupItemWrapper: false,
					WtRoundedAction: false,
				},
				plugins: [
					buildStore(),
				],
			},
		});

		wrapper
			.findComponent({
				name: 'WtRoundedAction',
			})
			.vm.$emit('click');

		expect(wrapper.emitted().call[0][0]).toEqual({
			number: phone.number,
			contactId: item.id,
		});
	});

	it('emits call event with selected phone from communication item', async () => {
		const phone = {
			number: 'vi ',
		};
		const item = {
			name: {},
			phones: [
				phone,
				phone,
			],
			id: 'vi',
		};

		const wrapper = mount(ContactLookupItem, {
			shallow: true,
			props: {
				item,
			},
			global: {
				stubs: {
					LookupItem: false,
					LookupItemWrapper: false,
					WtRoundedAction: false,
					ContactCommunicationItem: false,
					WtExpandTransition: false,
					TransitionExpand: false,
				},
				plugins: [
					buildStore(),
				],
			},
		});

		wrapper
			.findComponent({
				name: 'WtRoundedAction',
			})
			.vm.$emit('click');
		await wrapper.vm.$nextTick(); // render communication items
		wrapper
			.findComponent({
				name: 'ContactCommunicationItem',
			})
			.vm.$emit('call', phone);
		expect(wrapper.emitted().call[0][0]).toEqual({
			number: phone.number,
			contactId: item.id,
		});
	});

	it('falls back to primary phone when call() gets no explicit number', async () => {
		const item = {
			name: {},
			phones: [
				{
					number: '111',
					primary: true,
				},
				{
					number: '222',
					primary: false,
				},
			],
			id: 'contact-1',
		};
		const wrapper = mount(ContactLookupItem, {
			shallow: true,
			props: {
				item,
			},
			global: {
				stubs: {
					LookupItem: false,
					LookupItemWrapper: false,
					WtRoundedAction: false,
				},
				plugins: [
					buildStore(),
				],
			},
		});
		wrapper.vm.call();
		await wrapper.vm.$nextTick();
		expect(wrapper.emitted().call[0][0]).toEqual({
			number: '111',
			contactId: 'contact-1',
		});
	});
});
