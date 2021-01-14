import router from '../../../router';
import APIRepository from '../../../api/APIRepository';

const authAPI = APIRepository.auth;

const defaultState = () => ({
    domainId: 0,
    name: '',
    username: '',
    account: '',
    userId: 0,
    scope: [],
    roles: [],
    license: [],
    language: localStorage.getItem('lang'),
});

const state = {
    ...defaultState(),
};

const getters = {};

const actions = {
    RESTORE_SESSION: async (context) => {
        try {
            const userinfo = await authAPI.getSession();
            await context.dispatch('SET_SESSION', userinfo);
        } catch (err) {
            await router.replace('/auth');
            throw err;
        }
    },

    SET_SESSION: (context, session) => {
        context.dispatch('RESET_STATE');
        context.commit('SET_SESSION', session);
    },

    SET_DOMAIN_ID: (context, domainId) => {
        context.commit('SET_DOMAIN_ID', domainId);
    },

    RESET_STATE: (context) => {
        context.commit('RESET_STATE');
    },
};

const mutations = {
    SET_SESSION: (state, session) => {
        state.domainId = session.dc;
        state.account = session.preferredUsername;
        state.roles = session.roles;
        state.scope = session.scope;
        state.userId = session.userId;
        state.license = session.license;
        state.username = session.username;
        state.name = session.name;
    },

    SET_DOMAIN_ID: (state, domainId) => {
        state.domainId = domainId;
    },

    RESET_STATE: (state) => {
        Object.assign(state, defaultState());
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
