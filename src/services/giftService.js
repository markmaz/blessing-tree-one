import api from '@/services/api';

export default {
    getGifts() {
        return api.get('/gifts');
    },

    getCount(){
        return api.get(`/gifts/count`);
    },

    getUnsponsoredGifts(page, size){
        return api.get(`/gifts/unsponsored?page=${page}&size=${size}`);
    },

    getTopTen(gender, limit){
        return api.get(`/gifts/top-ten?gender=${gender}&limit=${limit}`);
    },
};