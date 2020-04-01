import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ClientInfo
  from '../../../../src/components/agent-workspace/info-section/client-info-tab.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Client Info MD', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace: {
        payload: {},
      },
    };
    store = new Vuex.Store({
      state,
      modules: {
        call: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Correctly renders empty payload', () => {
    const wrapper = shallowMount(ClientInfo, {
      store,
      localVue,
    });
    const md = wrapper.find('#md');
    expect(md.isEmpty()).toBe(true);
  });

  it('Correctly renders key-value in payload', () => {
    state.callOnWorkspace.payload = {
      key: 'value',
    };
    const wrapper = shallowMount(ClientInfo, {
      store,
      localVue,
    });
    const md = wrapper.find('#md');
    expect(md.find('h3').text()).toBe('key:');
    expect(md.find('p').text()).toBe('value');
  });

  it('Correctly renders key-value with MD in payload', () => {
    state.callOnWorkspace.payload = {
      md: '# h1 Heading',
    };
    const wrapper = shallowMount(ClientInfo, {
      store,
      localVue,
    });
    const md = wrapper.find('#md');
    expect(md.find('h3').text()).toBe('md:');
    expect(md.find('h1').text()).toBe('h1 Heading');
  });
})
;
