<script lang="ts" setup>
  import { onMounted, ref, type Ref } from 'vue';

  import { Character } from './Character';
  import CharacterSheet from './CharacterSheet.vue';
  import fetchCharacterBase from './fetchCharacterBase';

  let character: Ref<Character | null> = ref(null);
  onMounted(async () => {
    const characterBase = await fetchCharacterBase('2');
    character.value = new Character(characterBase);
  });
</script>

<template>
  <CharacterSheet v-if="character" :character="character" />
</template>

<style scoped></style>
