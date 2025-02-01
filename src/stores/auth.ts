import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const idToken = ref<string | null>(null);
  const userId = ref<string | null>(null);
  const email = ref<string | null>(null);

  const isAuthenticated = computed(() => !!idToken.value);

  function registerIdToken(newIdToken: string) {
    const { email: newEmail, sub: newUserId } = jwtDecode(newIdToken) as {
      email: string;
      sub: string;
    };

    idToken.value = newIdToken;
    userId.value = newUserId;
    email.value = newEmail;
  }

  function unregisterIdToken() {
    idToken.value = null;
    userId.value = null;
    email.value = null;
  }

  return {
    userId,
    email,
    idToken,
    registerIdToken,
    unregisterIdToken,
    isAuthenticated,
  };
});
