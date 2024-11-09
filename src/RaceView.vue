<script lang="ts" setup>
  // const name = prop<string>({ required: true });
  // const source = prop<string>({ required: true });
  // const description = prop<string>({ required: true });
  // const abilityScoreIncrease = prop<string>({ required: true });
  // const age = prop<string>({ required: true });
  // const size = prop<string>({ required: true });
  // const speed = prop<string>({ required: true });
  // const languages = prop<string>({ required: true });

  defineProps({
    name: String,
    source: String,
    description: String,
    abilityScoreIncrease: String,
    age: String,
    alignment: String,
    size: String,
    speed: String,
    languages: String,
  });
</script>

<template>
  <div>
    <div>{{ name }}</div>
    <div>{{ source }}</div>
    <div>
      {{ description }}
    </div>
    <div>
      <div>Ability Score Increase</div>
      <div>{{ abilityScoreIncrease }}</div>
    </div>
    <div>
      <div>Age</div>
      <div>
        {{ age }}
      </div>
    </div>
    <div>
      <div>Alignment</div>
      <div>
        {{ alignment }}
      </div>
    </div>
    <div>
      <div>Size</div>
      <div>
        {{ size }}
      </div>
    </div>
    <div>
      <div>Speed</div>
      <div>{{ speed }}</div>
    </div>
    <div>
      <div>Languages</div>
      <div>
        {{ languages }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
