<script lang="ts" setup></script>

<template>
  <div class="character-sheet-column">
    <slot></slot>
  </div>
</template>

<style scoped>
  .character-sheet-column {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
  }
</style>
