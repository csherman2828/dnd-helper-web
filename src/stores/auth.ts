import { defineStore } from 'pinia';
import { ref, computed, watch, nextTick } from 'vue';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_DND_HELPER_API_URL;

function useSessionStorage<T>(key: string, defaultValue: T) {
  const storedValue = sessionStorage.getItem(key);
  const data = ref<T>(
    storedValue ? (JSON.parse(storedValue) as T) : defaultValue,
  );

  watch(
    data,
    newValue => {
      if (newValue === null || newValue === undefined || newValue === '') {
        sessionStorage.removeItem(key);
        return;
      }
      sessionStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true },
  );

  return data;
}

interface LoginInput {
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useSessionStorage<string | null>('accessToken', null);
  const idToken = useSessionStorage<string | null>('idToken', null);
  const expiresAt = useSessionStorage<number | null>('expiresAt', null);

  const decodedIdToken = computed(() =>
    idToken.value
      ? (jwtDecode(idToken.value) as { email: string; sub: string })
      : null,
  );

  const userId = computed(() => decodedIdToken.value?.sub);
  const email = computed(() => decodedIdToken.value?.email);

  const isAuthenticated = computed(() => !!idToken.value);

  async function login(input: LoginInput) {
    accessToken.value = input.accessToken;
    idToken.value = input.idToken;
    expiresAt.value = input.expiresAt;
  }

  async function logout() {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const responseJson = await response.json();
      console.log('Logout response', {
        response,
        responseJson,
      });
    } catch (error) {
      console.warn('Encountered api error when logging out', error);
    }
    accessToken.value = '';
    idToken.value = '';
    expiresAt.value = null;
  }

  async function refreshSession() {
    const preAuthTime = Date.now();
    if (
      accessToken.value &&
      idToken.value &&
      (expiresAt.value ?? 0) > preAuthTime
    ) {
      console.log('Session refreshed from session storage');
      return;
    }

    let response;
    let responseJson;
    try {
      response = await fetch(`${API_URL}/auth/refresh`, {
        credentials: 'include',
      });
      responseJson = await response.json();
    } catch (error) {
      console.error('Failed fetch call when refreshing session', error);
      console.log('Unable to refresh session from API');
      return;
    }

    if (!response.ok) {
      console.log('Failed to refresh session from API', {
        response,
        responseJson,
      });
      console.log('Unable to refresh session from API');
      return;
    }

    if (
      responseJson.accessToken &&
      responseJson.idToken &&
      responseJson.expiresIn
    ) {
      login({
        accessToken: responseJson.accessToken,
        idToken: responseJson.idToken,
        expiresAt: preAuthTime + responseJson.expiresIn * 1000,
      });
    }

    console.log('Session refreshed from API');

    return;
  }

  async function getAccessToken() {
    if (Date.now() >= (expiresAt.value ?? 0)) {
      await refreshSession();
    }
    await nextTick();
    return accessToken.value;
  }

  return {
    userId,
    email,
    idToken,
    login,
    logout,
    refreshSession,
    getAccessToken,
    isAuthenticated,
  };
});
