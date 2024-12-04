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

    printRosterReport(data){
        return api.post(`/pdf/reports/roster`, data, {
            responseType: 'blob',
        });
    },

    printRosterExcelReport(data){
        return api.post(`/excel/reports/roster`, data, {
            responseType: 'blob',
        });
    },

}