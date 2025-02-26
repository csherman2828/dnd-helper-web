<script setup lang="ts">
  import { computed, ref } from 'vue';

  import { useAuthStore } from '@/stores/auth';

  const API_URL = import.meta.env.VITE_DND_HELPER_API_URL;

  const { login } = useAuthStore();

  const emailInput = ref('csherman2828@gmail.com');
  const passwordInput = ref('TestPassword2!');
  const loginError = ref('');
  const formReady = ref(false);
  const isAttemptingLogin = ref(false);

  const shouldShowError = computed(() => !!loginError.value);

  async function attemptAuthentication() {
    try {
      isAttemptingLogin.value = true;

      const preAuthTime = Date.now();

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
        credentials: 'include',
      });
      const responseJson = await response.json();

      if (!response.ok) {
        const { status, statusText } = response;
        console.error('Failed to log in', {
          status,
          statusText,
          responseJson,
        });

        return;
      }

      if (
        responseJson.accessToken &&
        responseJson.idToken &&
        responseJson.expiresIn
      ) {
        const { accessToken, idToken, expiresIn } = responseJson;
        const expiresAt = preAuthTime + expiresIn * 1000;

        loginError.value = '';

        await login({ accessToken, idToken, expiresAt });
        return;
      }

      console.error('Unhandled login response', { response, responseJson });
      loginError.value = 'Unexpected response from server';
      return;
    } catch (err) {
      console.error('Unexpected error when logging in', err);
      loginError.value = 'Unexpected error when logging in';
    } finally {
      isAttemptingLogin.value = false;
    }
  }

  const rules = [(value: string) => !!value || 'Required.'];
</script>

<template>
  <div class="auth">
    <v-form v-model="formReady" @submit.prevent>
      <h1 style="text-align: center">Shermaniac VTT</h1>
      <v-alert
        color="error"
        icon="mdi-alert"
        closable
        @click:close="loginError = ''"
        v-model="shouldShowError"
      >
        {{ loginError }}
      </v-alert>
      <v-text-field
        v-model="emailInput"
        label="Email"
        :rules="rules"
        name="email"
        autocomplete="email"
        :disabled="isAttemptingLogin"
        :loading="isAttemptingLogin"
      />
      <v-text-field
        v-model="passwordInput"
        label="Password"
        type="password"
        :disabled="isAttemptingLogin"
        :loading="isAttemptingLogin"
      />
      <v-btn
        @click="attemptAuthentication"
        type="submit"
        :disabled="!formReady || isAttemptingLogin"
        block
        :loading="isAttemptingLogin"
      >
        Login
      </v-btn>
      <div>
        If you do not have an account yet, please
        <span style="color: rgb(var(--v-theme-primary))">sign up</span>
      </div>
    </v-form>
  </div>
</template>

<style scoped>
  .auth {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }

  .auth .v-form {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
    width: 24rem;
    border: 1px solid gray;
    padding: 16px;
    border-radius: 1rem;
  }
</style>
