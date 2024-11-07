import api from '@/services/api';

export default {
    getGifts() {
        return api.get('/gifts');
    },
};