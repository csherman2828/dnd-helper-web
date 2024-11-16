<script lang="ts" setup></script>

<template>
  <div class="character-sheet-page">
    <slot></slot>
  </div>
</template>

<style scoped>
  .character-sheet-page {
    padding: 1rem;
    border: 5px white solid;
    border-radius: 15px;
    max-width: 1000px;
    min-width: 1000px;
    margin: auto;
  }
</style>
