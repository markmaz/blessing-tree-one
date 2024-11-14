import api from '@/services/api';

export default {
    getSeniors() {
        return api.get('/seniors');
    },

    getCount(){
        return api.get(`/seniors/count`);
    },
};