import instance from '../instance';
import store from '../../store/index';
import { objSnakeToCamel } from '../utils/caseConverters';

// gets user by token from localstorage
// stores response username in vuex
export default async () => {
    const defaultObject = {
        domainId: 0,
        username: '',
        userId: 0,
        scope: [],
        roles: [],
        license: [],
    };

    const tokenCheck = localStorage.getItem('access-token');
    if (typeof tokenCheck === 'string') { // if there is no token, localStorage returns object
        const url = '/userinfo';
        try {
            const response = await instance.get(url);
            localStorage.setItem('domain', response.dc);
            store.dispatch('userinfo/SET_SESSION', {
                ...defaultObject,
                ...objSnakeToCamel(response),
            });
        } catch (error) {
            throw error;
        }
    }
};
