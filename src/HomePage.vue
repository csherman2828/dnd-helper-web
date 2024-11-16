<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { type CharacterListing } from './CharacterListing';
  import { type CampaignListing } from './CampaignListing';
  import fetchCharacters from './fetchCharacters';
  import fetchCampaigns from './fetchCampaigns';

  const userId = '1';

  let characters = ref([] as CharacterListing[]);
  let campaigns = ref([] as CampaignListing[]);

  async function getCharacters() {
    characters.value = await fetchCharacters(userId);
  }

  async function getCampaigns() {
    campaigns.value = await fetchCampaigns(userId);
  }

  onMounted(async () => {
    await getCharacters();
    await getCampaigns();
  });
</script>

<template>
  <div class="home-page">
    <v-card class="characters home-section">
      <v-card-title>
        <h2>Characters</h2>
      </v-card-title>
      <v-card-text>
        <v-data-table :items="characters"></v-data-table>
      </v-card-text>
    </v-card>
    <v-card class="campaigns home-section">
      <v-card-title>
        <h2>Campaigns</h2>
      </v-card-title>
      <v-card-text>
        <v-data-table :items="campaigns"></v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
  .home-page {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
    max-width: 800px;
    margin: auto;
    margin-top: 1rem;
  }
</style>
