import api from '@/services/api';

export default {
    printGiftTags(numberOfTags) {
        return api.get(`/pdf/giftTags?tags=${numberOfTags}`, {
            responseType: 'blob',
        });
    },
}