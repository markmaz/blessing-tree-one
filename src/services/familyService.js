import api from '@/services/api';

export default {
    getFamilies() {
        return api.get('/parents'); // "/users" is the API endpoint
    },

    createFamily(parentData) {
        return api.post('/parents', parentData); // "/users" is the API endpoint
    },

    updateFamily(parentID, parentData) {
        return api.put(`/parents/${parentID}`, parentData);
    },

    deleteFamily(parentID) {
        return api.delete(`/parents/${parentID}`);
    },

    getFamily(parentID) {
        return api.get(`/parents/${parentID}`);
    },

    addChild(parentID, childData){
        return api.post(`/parents/${parentID}/children`, childData);
    },

    updateChild(childID, parentID, childData){
        return api.put(`/parents/${parentID}/children/${childID}`, childData);
    },

    deleteChild(childID, parentID){
        return api.delete(`/parents/${parentID}/children/${childID}`);
    },

    addGift(parentID, childID, giftData){
        return api.post(`/parents/${parentID}/children/${childID}/gifts`, giftData);
    },

    updateGift(giftID, giftData){
        return api.put(`/gifts/${giftID}`, giftData);
    },

    deleteGift(giftID){
        return api.delete(`/gifts/${giftID}`);
    },

    familyCount(){
        return api.get(`/parents/count`);
    },

    childCount(){
        return api.get(`/children/count`);
    },

    addNote(parent_id, note){
        return api.post(`/parents/${parent_id}/notes`, note);
    },

    deleteNote(parent_id, note_id){
        return api.delete(`/parents/${parent_id}/notes/${note_id}`);
    },

    getUnsponsoredChildren(){
        return api.get(`parents/unsponsored_children`);
    },

};