import axios from "axios";
import config from "@/config.js";

const apiClient = axios.create({
    baseURL:config.apiBaseUrl,
    headers:{
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API call failed:', error);
        return Promise.reject(error);
    }
);

export default {
    login(credentials){
        return apiClient.post(`/login`, credentials);
    },

    reminder(username){
        return apiClient.post(`/reminder`, username);
    },

    reset(userData){
        return apiClient.post(`/reset`, userData);
    }
};