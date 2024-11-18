<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  import { useStore } from '@/stores/auth';

  const router = useRouter();
  const store = useStore();

  const username = ref('');
  const password = ref('');
  const formReady = ref(false);

  async function login() {
    await store.login('dummy-id-token', 'dummy-refresh-token', 'dummy-user-id');
    router.push({ name: 'home' });
  }

  const rules = [(value: string) => !!value || 'Required.'];
</script>

<template>
  <div class="auth">
    <v-form v-model="formReady" @submit.prevent>
      <h1 style="text-align: center">Shermaniac VTT</h1>
      <v-text-field
        v-model="username"
        label="Username"
        :rules="rules"
        name="username"
        autocomplete="username"
      />
      <v-text-field v-model="password" label="Password" type="password" />
      <v-btn @click="login" type="submit" :disabled="!formReady" block>
        Login
      </v-btn>

      <div>
        If you do not have an account yet, please
        <router-link :to="{ name: 'signup' }">sign up</router-link>
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
