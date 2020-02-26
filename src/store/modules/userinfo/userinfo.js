const defaultState = () => ({
    domainId: 0,
    username: '',
    userId: 0,
    scope: [],
    roles: [],
    license: [],
    language: localStorage.getItem('language'),
});

const state = {
    ...defaultState(),
};

const getters = {

};

const actions = {
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
        state.username = session.preferredUsername;
        state.roles = session.roles;
        state.scope = session.scope;
        state.userId = session.userId;
        state.license = session.license;
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
