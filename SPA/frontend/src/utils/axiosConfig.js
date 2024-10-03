import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return instance(originalRequest);
                } catch (err) {
                    console.error('Refresh token error:', err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
