import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { jwtDecode } from 'jwt-decode';

function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key);
  const data = ref<T>(
    storedValue ? (JSON.parse(storedValue) as T) : defaultValue,
  );

  watch(
    data,
    newValue => {
      if (newValue === null || newValue === undefined || newValue === '') {
        localStorage.removeItem(key);
        return;
      }
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true },
  );

  return data;
}

interface LoginInput {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export const useAuthStore = defineStore('auth', () => {
  // TODO: implement secure, httpOnly, strict same-site cookies
  // - this is typically BAD SECURITY PRACTICE
  // - storing tokens, especially refresh tokens, in localStorage leaves us
  //   vulnerable to XSS and XSRF attacks
  // - we should be setting secure, httpOnly, strict same-site cookies from the
  //   backend
  // - however, for the sake of simplicity, we're storing tokens in localStorage
  const accessToken = useLocalStorage('accessToken', '');
  const idToken = useLocalStorage('idToken', '');
  const refreshToken = useLocalStorage('refreshToken', '');

  const decodedIdToken = computed(
    () => jwtDecode(idToken.value) as { email: string; sub: string },
  );

  const userId = computed(() => decodedIdToken.value.sub);
  const email = computed(() => decodedIdToken.value.email);

  const isAuthenticated = computed(() => !!idToken.value);

  function login(input: LoginInput) {
    accessToken.value = input.accessToken;
    idToken.value = input.idToken;
    refreshToken.value = input.refreshToken;
  }

  function logout() {
    accessToken.value = '';
    idToken.value = '';
    refreshToken.value = '';
  }

  return {
    userId,
    email,
    idToken,
    login,
    logout,
    isAuthenticated,
  };
});
