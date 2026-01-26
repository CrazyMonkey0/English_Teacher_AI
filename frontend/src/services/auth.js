import api from './api';

export async function loginUser(email, password) {
    await api.post(
        '/auth/login',
        new URLSearchParams({ username: email, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return await getCurrentUser();
}

export async function logoutUser() {
    const response = await api.post('/auth/logout');
    return response.data;
}

export async function forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', {
        email: email,
    }, { headers: { 'Content-Type': 'application/json' } });
    return response.data;
}

export async function resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', {
        token: token,
        password: newPassword,
    }, { headers: { 'Content-Type': 'application/json' } });
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
}

export async function registerUser(data) {
    const res = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
    }, { headers: { 'Content-Type': 'application/json' } });

    return res.data;
}
