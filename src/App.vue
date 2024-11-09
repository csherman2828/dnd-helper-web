<script setup lang="ts">
  import { ref } from 'vue';

  const ignoreAuth = ref(true);

  const authenticated = ref(false);
  const username = ref('');
  const password = ref('');
  const formReady = ref(false);

  function login() {
    console.log({
      formReady: formReady.value,
      username: username.value,
      password: password.value,
    });
    authenticated.value = true;
  }

  function logout() {
    authenticated.value = false;
  }

  const rules = [(value: string) => !!value || 'Required.'];
</script>

<template>
  <div
    class="unauthenticated-view"
    style="
      width: 100%;
      height: 100vh;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
    "
    v-if="!authenticated && !ignoreAuth"
  >
    <v-form
      v-model="formReady"
      @submit.prevent
      style="
        width: 24rem;
        border: 1px solid gray;
        padding: 16px;
        border-radius: 1rem;
      "
    >
      <h1 style="padding-bottom: 16px; width: 100%; text-align: center">
        Shermaniac VTT
      </h1>
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
    </v-form>
  </div>
  <v-layout class="authenticated-view" v-else>
    <v-app-bar>
      <v-toolbar-title>Shermaniac VTT</v-toolbar-title>
      <v-btn @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>

<style scoped></style>
