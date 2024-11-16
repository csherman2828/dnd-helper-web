<script lang="ts" setup>
  import { onMounted, ref, type Ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { Character } from '../Character';
  import CharacterSheet from './CharacterSheet.vue';
  import fetchCharacterBase from '../fetchCharacterBase';

  const route = useRoute();

  const characterId = route.params.id as string;

  let character: Ref<Character | null> = ref(null);
  onMounted(async () => {
    const characterBase = await fetchCharacterBase(characterId);
    character.value = new Character(characterBase);
  });
</script>

<template>
  <CharacterSheet v-if="character" :character="character" />
</template>

<style scoped></style>
