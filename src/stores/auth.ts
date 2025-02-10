import { defineStore } from 'pinia';
import { ref, computed, watch, nextTick } from 'vue';
import { jwtDecode } from 'jwt-decode';

const apiUri = 'http://localhost:3001';

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
  // TODO: implement secure, httpOnly, strict same-site cookies
  // - this is typically BAD SECURITY PRACTICE
  // - storing tokens, especially refresh tokens, in localStorage leaves us
  //   vulnerable to XSS and XSRF attacks
  // - we should be setting secure, httpOnly, strict same-site cookies from the
  //   backend
  // - however, for the sake of simplicity, we're storing tokens in localStorage
  const accessToken = useSessionStorage('accessToken', '');
  const idToken = useSessionStorage('idToken', '');
  const expiresAt = useSessionStorage('expiresAt', Date.now());

  const decodedIdToken = computed(
    () => jwtDecode(idToken.value) as { email: string; sub: string },
  );

  const userId = computed(() => decodedIdToken.value.sub);
  const email = computed(() => decodedIdToken.value.email);

  const isAuthenticated = computed(() => !!idToken.value);

  async function login(input: LoginInput) {
    accessToken.value = input.accessToken;
    idToken.value = input.idToken;
    expiresAt.value = input.expiresAt;
  }

  function logout() {
    accessToken.value = '';
    idToken.value = '';
  }

  async function refreshSession() {
    const preAuthTime = Date.now();
    if (accessToken.value && idToken.value && expiresAt.value > preAuthTime) {
      console.log('Session refreshed from session storage');
      return;
    }

    let response;
    let responseJson;
    try {
      response = await fetch(`${apiUri}/tokens`, { credentials: 'include' });
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
      responseJson.AccessToken &&
      responseJson.IdToken &&
      responseJson.ExpiresIn
    ) {
      login({
        accessToken: responseJson.AccessToken,
        idToken: responseJson.IdToken,
        expiresAt: preAuthTime + responseJson.ExpiresIn * 1000,
      });
    }

    console.log('Session refreshed from API');

    return;
  }

  async function getAccessToken() {
    if (Date.now() >= expiresAt.value) {
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
