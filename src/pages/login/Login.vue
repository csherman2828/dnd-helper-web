<script setup lang="ts">
  import { computed, ref } from 'vue';

  import { useAuthStore } from '@/stores/auth';

  import { initiateAuth } from '@/utils/cognito';

  const { login } = useAuthStore();

  const emailInput = ref('');
  const passwordInput = ref('');
  const loginError = ref('');
  const formReady = ref(false);
  const isAttemptingLogin = ref(false);

  const shouldShowError = computed(() => !!loginError.value);

  async function attemptAuthentication() {
    try {
      isAttemptingLogin.value = true;

      const preAuthTime = Date.now();

      const response = await initiateAuth(
        emailInput.value,
        passwordInput.value,
      );

      const responseJson = await response.json();

      if (!response.ok) {
        const { status, statusText } = response;
        const { __type: type, message } = responseJson;

        console.error('Failed to log in', {
          status,
          statusText,
          type,
          message,
        });

        if (type === 'NotAuthorizedException') {
          loginError.value = 'Incorrect username or password';
        } else {
          loginError.value = 'An unknown error occurred';
        }

        return;
      }

      loginError.value = '';

      const { AuthenticationResult } = responseJson;
      const {
        AccessToken: accessToken,
        IdToken: idToken,
        RefreshToken: refreshToken,
        ExpiresIn: expiresIn,
      } = AuthenticationResult as {
        AccessToken: string;
        IdToken: string;
        RefreshToken: string;
        ExpiresIn: number;
      };

      const expiresAt = preAuthTime + expiresIn * 1000;

      try {
        const apiTokensResponse = await fetch('http://localhost:3001/tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
          },
          body: JSON.stringify({
            refreshToken,
          }),
          credentials: 'include',
        });

        const apiTokensResponseJson = await apiTokensResponse.json();

        if (!apiTokensResponse.ok) {
          const { status, statusText } = apiTokensResponse;
          const { __type: type, message } = await apiTokensResponseJson;

          console.error('Failed to set refresh token', {
            status,
            statusText,
            type,
            message,
          });

          throw new Error('Failed to set refresh token');
        }

        await login({ accessToken, idToken, expiresAt });
      } catch (err) {
        console.error('Failed to set refresh token', err);
      }
    } catch (err) {
      console.error('Failed to log in', err);
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
