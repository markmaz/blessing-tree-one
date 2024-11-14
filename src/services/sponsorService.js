import api from '@/services/api';

export default {
    getSponsors() {
        return api.get(`/sponsors`);
    },

    getSponsor(sponsorID){
        return api.get(`/sponsors/${sponsorID}`);
    },

    createSponsor(sponsorData){
        return api.post(`/sponsors`, sponsorData);
    },

    updateSponsor(id, sponsorData){
        return api.put(`/sponsors/${id}`, sponsorData);
    },

    getCount(){
        return api.get(`/sponsors/count`);
    },
};