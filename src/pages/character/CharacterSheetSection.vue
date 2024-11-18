<script lang="ts" setup>
  defineProps({
    title: String,
  });
</script>

<template>
  <div class="character-sheet-section">
    <slot></slot>
    <div v-if="!!title" class="title">{{ title }}</div>
  </div>
</template>

<style scoped>
  .character-sheet-section {
    border: 1px solid white;
    border-radius: 5px;
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .title {
    text-align: center;
    color: #ccc;
    font-size: 0.8rem;
  }
</style>
