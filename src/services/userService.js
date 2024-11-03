import api from '@/services/api';

export default {
    // Example GET method to fetch data from an endpoint
    getUsers() {
        return api.get('/users'); // "/users" is the API endpoint
    },

    // Example POST method to send data
    createUser(userData) {
        return api.post('/users', userData); // "/users" is the API endpoint
    },

    // Example PUT method to update data
    updateUser(userId, userData) {
        return api.patch(`/users/${userId}`, userData);
    },

    // Example DELETE method to delete data
    deleteUser(userId) {
        return api.delete(`/users/${userId}`);
    },

    getUser(userId) {
        return api.get(`/users/${userId}`);
    },
};
