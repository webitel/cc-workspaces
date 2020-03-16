import instance from '../instance';
import router from '../../router/index';
import getSession from './userinfo';

export const handleToken = async (token) => {
    localStorage.setItem('access-token', token);
    instance.defaults.headers['X-Webitel-Access'] = localStorage.getItem('access-token');
    await getSession();
    return router.replace('/workspace');
};

export const logout = async () => {
    const url = '/logout';

    try {
        await instance.post(url, {});
        // remove tokens
        localStorage.removeItem('access-token');
        localStorage.removeItem('domain');
        instance.defaults.headers['X-Webitel-Access'] = '';
        // and throw user to auth page
        return router.replace('/auth');
    } catch (error) {
        throw error;
    }
};
