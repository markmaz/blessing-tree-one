import axios from 'axios';
import router from '@/router';
import config from "@/config.js"; // Assuming you have your router set up in this file

const getToken = () => {
    return localStorage.getItem('authToken');
};

// Create an Axios instance
const api = axios.create({
    baseURL:config.apiBaseUrl, // Use your environment variable or static URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to handle 403 errors
api.interceptors.response.use(
    (response) => {
        console.log("In api response interceptor");
        return response;
    },
    (error) => {
        // Check if it's a 403 error (Unauthorized or Forbidden)
        if (error.response && error.response.status === 403) {
            console.log("In api response interceptor with error: " + error.response.status);
            // Optionally clear any authentication-related information
            //store.dispatch('logout'); // Call your logout action to clear the state (if using Vuex or Pinia)
            localStorage.removeItem('authToken');

            // Redirect to the login page
            router.push({ name: 'landing' });
        }
        return Promise.reject(error);
    }
);

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use(
    (config) => {
        console.log("In userService response interceptor");
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Set the token in the header
        }
        return config;
    },
    (error) => {
        console.log("In userService response interceptor with error: " + error);
        return Promise.reject(error);
    }
);

export default api;
