<script setup lang="ts">
  import { computed, onBeforeMount } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';

  import Login from '@/pages/login/Login.vue';
  import { useAuthStore } from '@/stores/auth';

  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  const route = useRoute();
  const router = useRouter();

  const shouldShowLogin = computed(() => !isAuthenticated.value);
  const shouldHideToolbar = computed(() => route.meta.shouldHideToolbar);

  function handleSiteNameClicked() {
    router.push({ name: 'home' });
  }

  async function logout() {
    try {
      await authStore.logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  onBeforeMount(async () => {
    await authStore.refreshSession();
  });
</script>

<template>
  <Login v-if="shouldShowLogin" />
  <v-layout v-else class="authenticated-view">
    <v-app-bar v-if="!shouldHideToolbar">
      <v-toolbar-title class="site-name" @click="handleSiteNameClicked">
        D&D Helper
      </v-toolbar-title>
      <v-btn @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>

<style scoped>
  .site-name {
    cursor: pointer;
  }
</style>
