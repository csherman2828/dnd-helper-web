<script setup lang="ts">
  import { ref } from 'vue';

  import { useAuthStore } from '@/stores/auth';
  import { sendRequest } from '@/utils/sendRequest';

  const { registerIdToken } = useAuthStore();

  const emailInput = ref('');
  const passwordInput = ref('');
  const formReady = ref(false);

  async function login() {
    console.log('Logging in');
    const url = 'https://cognito-idp.us-east-1.amazonaws.com';
    try {
      const response = await sendRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        },
        body: JSON.stringify({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: '61fpd4uj8r0aksrf4j712m6lke',
          AuthParameters: {
            USERNAME: emailInput.value,
            PASSWORD: passwordInput.value,
          },
        }),
      });

      const { AuthenticationResult } = await response.json();
      const idToken = AuthenticationResult.IdToken;

      registerIdToken(idToken);
      console.log(`Logged in as ${emailInput.value}`);
    } catch (err) {
      console.error('Failed to log in', err);
    }
  }

  const rules = [(value: string) => !!value || 'Required.'];
</script>

<template>
  <div class="auth">
    <v-form v-model="formReady" @submit.prevent>
      <h1 style="text-align: center">Shermaniac VTT</h1>
      <v-text-field
        v-model="emailInput"
        label="Email"
        :rules="rules"
        name="email"
        autocomplete="email"
      />
      <v-text-field v-model="passwordInput" label="Password" type="password" />
      <v-btn @click="login" type="submit" :disabled="!formReady" block>
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
