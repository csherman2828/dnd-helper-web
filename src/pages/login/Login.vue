<script setup lang="ts">
  import { computed, ref } from 'vue';

  import { useAuthStore } from '@/stores/auth';

  const API_URL = import.meta.env.VITE_DND_HELPER_API_URL;

  enum FormType {
    LOGIN = 'login',
    NEW_PASSWORD = 'new password',
  }

  const { login } = useAuthStore();

  const emailInput = ref('csherman2828@gmail.com');
  const passwordInput = ref('Testp1!');
  const loginError = ref('');
  const formReady = ref(false);
  const isAttemptingLogin = ref(false);
  const formShown = ref<FormType>(FormType.LOGIN);

  const updatePasswordSession = ref('');
  const isUpdatePasswordFormReady = ref(false);
  const isUpdatingPassword = ref(false);
  const newPasswordInput = ref('Testp1!');
  const confirmNewPasswordInput = ref('Testp1!');
  const updatePasswordError = ref('');

  const shouldShowError = computed(() => !!loginError.value);
  const shouldShowUpdatePasswordError = computed(
    () => !!updatePasswordError.value,
  );

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

      if (
        responseJson.challengeName === 'NEW_PASSWORD_REQUIRED' &&
        responseJson.session
      ) {
        updatePasswordSession.value = responseJson.session;
        formShown.value = FormType.NEW_PASSWORD;
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

  async function updatePassword() {
    try {
      isUpdatingPassword.value = true;

      const preAuthTime = Date.now();

      const response = await fetch(`${API_URL}/auth/challenge/new-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput.value,
          newPassword: newPasswordInput.value,
          session: updatePasswordSession.value,
        }),
        credentials: 'include',
      });
      const responseJson = await response.json();

      console.log('Update password response', { response, responseJson });

      if (!response.ok) {
        const { status, statusText } = response;
        console.error('Failed to update password', {
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

      updatePasswordError.value = '';
    } catch (err) {
      console.error('Unexpected error when updating password', err);
      updatePasswordError.value = 'Unexpected error when updating password';
    } finally {
      isUpdatingPassword.value = false;
    }
  }

  const rules = [(value: string) => !!value || 'Required.'];
</script>

<template>
  <div class="auth">
    <h1 style="text-align: center; margin-bottom: 2rem">D&D Helper</h1>
    <v-form
      v-if="formShown === FormType.LOGIN"
      v-model="formReady"
      @submit.prevent
    >
      <h2>Login</h2>
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
    </v-form>
    <v-form
      v-else-if="formShown === FormType.NEW_PASSWORD"
      v-model="isUpdatePasswordFormReady"
      @submit.prevent
    >
      <h2>Update Password</h2>
      <v-alert
        color="error"
        icon="mdi-alert"
        closable
        @click:close="updatePasswordError = ''"
        v-model="shouldShowUpdatePasswordError"
      >
        {{ updatePasswordError }}
      </v-alert>
      <v-text-field
        v-model="newPasswordInput"
        label="New Password"
        type="password"
        :disabled="isUpdatingPassword"
        :loading="isUpdatingPassword"
      />
      <v-text-field
        v-model="confirmNewPasswordInput"
        label="Confirm Password"
        type="password"
        :disabled="isUpdatingPassword"
        :loading="isUpdatingPassword"
      />
      <v-btn
        @click="updatePassword"
        type="submit"
        :disabled="!isUpdatePasswordFormReady || isUpdatingPassword"
        block
        :loading="isUpdatingPassword"
      >
        Update Password
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
  .auth {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
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
