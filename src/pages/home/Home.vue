<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  import { type CharacterListing } from './CharacterListing';
  import { type CampaignListing } from './CampaignListing';
  import fetchCharacters from './fetchCharacters';
  import fetchCampaigns from './fetchCampaigns';

  const router = useRouter();

  const userId = '1';

  let characters = ref([] as CharacterListing[]);
  let campaigns = ref([] as CampaignListing[]);

  const characterHeaders = ref([{ title: 'Name', value: 'name' }]);
  const campaignHeaders = ref([{ title: 'Name', value: 'name' }]);

  function handleCharacterRowClick(character: CharacterListing) {
    console.log(character);
    router.push({ name: 'character', params: { id: character.id } });
  }

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
      <v-card-title class="title">
        <h2>Characters</h2>
        <v-btn variant="elevated" color="primary">
          <v-icon start>mdi-plus</v-icon>
          New
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="characterHeaders" :items="characters">
          <template v-slot:item="{ item }">
            <tr @click="handleCharacterRowClick(item)">
              <td>
                {{ item.name }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-card class="campaigns home-section">
      <v-card-title class="title">
        <h2>Campaigns</h2>
        <v-btn variant="elevated" color="primary">
          <v-icon start>mdi-plus</v-icon>
          New
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="campaignHeaders"
          :items="campaigns"
        ></v-data-table>
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

  .home-section .title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }
</style>
