import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import JSDOM from 'jsdom';
import API from '../../../src/api/auth/authAPIRepository';
import Auth from '../../../src/components/shared/auth/the-auth.vue';
import userinfo from '../../../src/store/modules/userinfo/userinfo';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

API.setToken = jest.fn();
API.getSession = jest.fn(() => ({}));

describe('Auth', () => {
  let store;
  let wrapper;
  global.window = new JSDOM.JSDOM().window;
  const router = new VueRouter();
  router.replace = jest.fn();

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { userinfo },
    });

    wrapper = shallowMount(Auth, {
      localVue,
      store,
      router,
    });
  });

  it('renders a component', () => {
    expect(wrapper.classes('auth-wrap')).toBe(true);
  });

  it('sets token, gets session and opens app after auth token message emit', async (done) => {
    const accessToken = 'hello there';
    window.postMessage({ accessToken }, '*');
    await setTimeout(() => {
      expect(API.setToken).toHaveBeenCalledWith(accessToken);
      expect(API.getSession).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalled();
      done();
    }, 100);
  });
});
