// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        loggedIn: false,
        name: '',
        title: '',
    }),
    actions: {
        login(username, name, title) {
            this.username = username;
            this.name = name;
            this.loggedIn = true;
            this.title = title;
        },
        logout() {
            console.log("Removing store")
            this.username = '';
            this.loggedIn = false;
            this.name = '';
            this.title = '';
        }
    },
    getters: {
        isAuthenticated: (state) => state.loggedIn,
    }
});
