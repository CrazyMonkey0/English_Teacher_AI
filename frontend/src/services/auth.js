import api from './api'; // lub axios

export async function loginUser(email, password) {
    const response = await api.post('/auth/login',
        new URLSearchParams({ username: email, password }),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true
        }
    );

    // Po zalogowaniu pobierz dane użytkownika
    const userData = await getCurrentUser();
    return userData;
}

export async function logoutUser() {
    const response = await api.post('/auth/logout', {}, {
        withCredentials: true
    });
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get('/users/me', {
        withCredentials: true
    });
    return response.data;
}

