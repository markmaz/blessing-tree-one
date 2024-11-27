import api from '@/services/api';

export default {
    printGiftTags(numberOfTags) {
        return api.get(`/pdf/giftTags?tags=${numberOfTags}`, {
            responseType: 'blob',
        });
    },

    printGiftTagsForSponsor(id) {
        return api.get(`/pdf/giftTags/sponsors/${id}`, {
            responseType: 'blob',
        });
    },

    printGiftTagsForFamily(id) {
        return api.get(`/pdf/giftTags/parents/${id}`, {
            responseType: 'blob',
        });
    },

    printGiftTagsForAllFamilies() {
        return api.get(`/pdf/giftTags/parents`, {
            responseType: 'blob',
        });
    },
}