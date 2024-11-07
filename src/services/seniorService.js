import api from '@/services/api';

export default {
    getSeniors() {
        return api.get('/seniors');
    },
};