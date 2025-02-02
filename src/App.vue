<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';

  import Login from '@/pages/login/Login.vue';
  import { useAuthStore } from '@/stores/auth';

  const authStore = useAuthStore();
  const { logout } = authStore;
  const { isAuthenticated } = storeToRefs(authStore);

  const route = useRoute();
  const router = useRouter();

  const shouldShowLogin = computed(() => !isAuthenticated.value);
  const shouldHideToolbar = computed(() => route.meta.shouldHideToolbar);

  function handleSiteNameClicked() {
    router.push({ name: 'home' });
  }
</script>

<template>
  <Login v-if="shouldShowLogin" />
  <v-layout v-else class="authenticated-view">
    <v-app-bar v-if="!shouldHideToolbar">
      <v-toolbar-title class="site-name" @click="handleSiteNameClicked">
        Shermaniac VTT
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
