import { defineStore } from 'pinia';

type Token = string | null;

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    idToken: null as Token,
    accessToken: null as Token,
    refreshToken: null as Token,
  }),
  getters: {
    isAuthenticated: state => !!state.idToken,
  },
  actions: {
    login(idToken: string, accessToken: string, refreshToken: string) {
      this.idToken = idToken;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    },
    logout() {
      this.idToken = null;
      this.accessToken = null;
      this.refreshToken = null;
    },
  },
});
