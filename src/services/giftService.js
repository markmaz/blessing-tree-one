import api from '@/services/api';

export default {
    getGifts() {
        return api.get('/gifts');
    },

    getCount(){
        return api.get(`/gifts/count`);
    },

    getUnsponsoredGifts(){
        return api.get(`/gifts/unsponsored`);
    },

    getTopTen(gender, limit){
        return api.get(`/gifts/top-ten?gender=${gender}&limit=${limit}`);
    },

    sponsorGift(giftID, sponsorID){
        return api.post(`/gifts/${giftID}/sponsors/${sponsorID}`);
    },

    unSponsorGift(giftID, sponsorID){
        return api.delete(`/gifts/${giftID}/sponsors/${sponsorID}`);
    },

    outstandingCount(){
        return api.get(`/gifts/outstanding/count`);
    }
};