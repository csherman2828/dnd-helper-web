<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  // import { useAuthStore } from '@/stores/auth';

  // const store = useAuthStore();
  const router = useRouter();

  const displayName = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const formReady = ref(false);

  async function signUp() {
    // await store.login('dummy-id-token', 'dummy-refresh-token', 'dummy-user-id');
    router.push({ name: 'home' });
  }

  const ruleOptions = {
    required: (value: string) => !!value || 'Required.',
    email: (value: string) => /.+@.+\..+/.test(value) || 'Invalid email.',
  };

  const displayNameRules = [ruleOptions.required];
  const emailRules = [ruleOptions.required, ruleOptions.email];
  const passwordRules = [ruleOptions.required];
</script>

<template>
  <div class="signup">
    <header>
      <h1 class="site-name">TTRPGZ</h1>
      <div>Let's make playing and running tabletop role-playing games EZ!</div>
    </header>
    <v-form class="form" v-model="formReady" @submit.prevent>
      <h2 class="title">Sign Up</h2>
      <v-text-field
        class="display-name"
        label="Display Name"
        autocomplete="username"
        v-model="displayName"
        :rules="displayNameRules"
      />
      <v-text-field
        class="email"
        label="Email"
        autocomplete="email"
        v-model="email"
        :rules="emailRules"
      />
      <v-text-field
        class="password"
        label="Password"
        type="password"
        v-model="password"
        :rules="passwordRules"
      />
      <v-text-field
        class="confirm-password"
        label="Confirm Password"
        type="password"
        v-model="confirmPassword"
        :rules="passwordRules"
      />
      <v-btn @click="signUp" type="submit" :disabled="!formReady" block>
        Sign Up
      </v-btn>

      <div class="log-in-hint">
        If you already have an account, click
        <router-link to="/login">here</router-link>
        to log in
      </div>
    </v-form>
  </div>
</template>

<style scoped>
  .signup {
    display: flex;
    flex-flow: row nowrap;
    max-width: 800px;
    margin: 0 auto;
    height: 100vh;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .signup header {
    max-width: 50%;
  }

  .signup .form {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
    width: 24rem;
    border: 1px solid gray;
    padding: 16px;
    border-radius: 1rem;
  }

  .signup .form .title {
    margin-bottom: 1rem;
    text-align: center;
  }

  .log-in-hint {
    margin-top: 1rem;
  }
</style>
