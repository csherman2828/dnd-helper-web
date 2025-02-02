<script setup lang="ts">
  import { computed, ref } from 'vue';

  import { useAuthStore } from '@/stores/auth';

  const { login } = useAuthStore();

  const emailInput = ref('');
  const passwordInput = ref('');
  const loginError = ref('');
  const formReady = ref(false);
  const isAttemptingLogin = ref(false);

  const shouldShowError = computed(() => !!loginError.value);

  interface InitiateAuthInput {
    username: string;
    password: string;
  }

  async function initiateAuth(input: InitiateAuthInput) {
    const { username, password } = input;

    const url = 'https://cognito-idp.us-east-1.amazonaws.com';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      },
      body: JSON.stringify({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: '61fpd4uj8r0aksrf4j712m6lke',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }),
    };

    return fetch(url, options);
  }

  async function attemptAuthentication() {
    try {
      isAttemptingLogin.value = true;

      const response = await initiateAuth({
        username: emailInput.value,
        password: passwordInput.value,
      });

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
      } = AuthenticationResult;

      login({ accessToken, idToken, refreshToken });
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
