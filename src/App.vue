<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  import { useStore } from '@/stores/auth';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const shouldHideToolbar = computed(() => route.meta.shouldHideToolbar);

  async function logout() {
    await store.logout();
    router.push({ name: 'login' });
  }

  function handleSiteNameClicked() {
    router.push({ name: 'home' });
  }
</script>

<template>
  <v-layout class="authenticated-view">
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
