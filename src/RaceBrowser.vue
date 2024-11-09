<script lang="ts" setup>
  import { ref, type Ref } from 'vue';
  import RaceView from './RaceView.vue';

  interface RacialFeat {
    name: string;
    description: string;
    options?: {
      name: string;
      damageType: string;
      breathWeapon: string;
    }[];
  }

  interface Race {
    name: string;
    source: string;
    description: string;
    abilityScoreIncrease: string;
    age: string;
    alignment: string;
    size: string;
    speed: string;
    languages: string;
    skills?: string;
    racialFeats: RacialFeat[];
  }

  const dragonborn: Race = {
    name: 'Dragonborn',
    source: 'PHB',
    description:
      'Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension. Shaped by draconic gods or the dragons themselves, dragonborn originally hatched from dragon eggs as a unique race, combining the best attributes of dragons and humanoids. Some dragonborn are faithful servants to true dragons, others form the ranks of soldiers in great wars, and still others find themselves adrift, with no clear calling in life.',
    abilityScoreIncrease:
      'Your Strength score increases by 2, and your Charisma score increases by 1.',
    age: 'Young dragonborn grow quickly. They walk hours after hatching, attain the size and development of a 10-year-old human child by the age of 3, and reach adulthood by 15. They live to be around 80.',
    alignment:
      'Dragonborn tend towards extremes, making a conscious choice for one side or the other between Good and Evil (represented by Bahamut and Tiamat, respectively). More side with Bahamut than Tiamat (whose non-dragon followers are mostly kobolds), but villainous dragonborn can be quite terrible indeed. Some rare few choose to devote themselves to lesser dragon deities, such as Chronepsis (Neutral), and fewer still choose to worship Io, the Ninefold Dragon, who is all alignments at once.',
    size: 'Dragonborn are taller and heavier than humans, standing well over 6 feet tall and averaging almost 250 pounds. Your size is Medium.',
    speed: 'Your base walking speed is 30 feet.',
    languages: 'You can read, speak, and write Common and Draconic.',
    racialFeats: [
      {
        name: 'Draconic Ancestry',
        description:
          'You are distantly related to a particular kind of dragon. Choose a type of dragon from the below list; this determines the damage and area of your breath weapon, and the type of resistance you gain.',
        options: [
          {
            name: 'Black',
            damageType: 'Acid',
            breathWeapon: '5 by 30 ft. line (Dex. save)',
          },
          {
            name: 'Blue',
            damageType: 'Lightning',
            breathWeapon: '5 by 30 ft. line (Dex. save)',
          },
          {
            name: 'Brass',
            damageType: 'Fire',
            breathWeapon: '5 by 30 ft. line (Dex. save)',
          },
          {
            name: 'Bronze',
            damageType: 'Lightning',
            breathWeapon: '5 by 30 ft. line (Dex. save)',
          },
          {
            name: 'Copper',
            damageType: 'Acid',
            breathWeapon: '5 by 30 ft. line (Dex. save)',
          },
          {
            name: 'Gold',
            damageType: 'Fire',
            breathWeapon: '15 ft. cone (Dex. save)',
          },
          {
            name: 'Green',
            damageType: 'Poison',
            breathWeapon: '15 ft. cone (Con. save)',
          },
          {
            name: 'Red',
            damageType: 'Fire',
            breathWeapon: '15 ft. cone (Dex. save)',
          },
          {
            name: 'Silver',
            damageType: 'Cold',
            breathWeapon: '15 ft. cone (Con. save)',
          },
          {
            name: 'White',
            damageType: 'Cold',
            breathWeapon: '15 ft. cone (Con. save)',
          },
        ],
      },
    ],
  };

  const baseHuman: Race = {
    name: 'Human',
    source: 'PHB',
    description: [
      'In the reckonings of most worlds, humans are the youngest of the common',
      'races, late to arrive on the world scene and short-lived in comparison to',
      'dwarves, elves, and dragons. Perhaps it is because of their shorter lives',
      'that they strive to achieve as much as they can in the years they are given.',
      'Or maybe they feel they have something to prove to the elder races, and',
      "that's why they build their mighty empires on the foundation of conquest and",
      'trade. Whatever drives them, humans are the innovators, the achievers, and',
      'the pioneers of the worlds.',
    ].join(' '),
    abilityScoreIncrease: 'Your ability scores each increase by 1.',
    age: 'Humans reach adulthood in their late teens and live less than a century.',
    alignment:
      'Humans tend toward no particular alignment. The best and the worst are found among them.',
    size: 'Humans reach adulthood in their late teens and live less than a century.',
    speed: 'Your base walking speed is 30 feet.',
    languages: [
      'You can speak, read, and write Common and one extra language of your',
      'choice. Humans typically learn the languages of other peoples they deal',
      'with, including obscure dialects. They are fond of sprinkling their',
      'speech with words borrowed from other tongues: Orc curses, Elvish musical',
      'expressions, Dwarvish military phrases, and so on.',
    ].join(' '),
    racialFeats: [],
  };

  const human: Race = {
    ...baseHuman,
  };

  const humanVariant: Race = {
    ...baseHuman,
    name: 'Human (Variant)',
    description:
      "If your campaign uses the optional feat rules from chapter 5 of the Player's Handbook, your Dungeon Master might allow these variant traits, all of which replace the human's Ability Score Increase trait.",
    abilityScoreIncrease:
      'Two different ability scores of your choice increase by 1',
    skills: 'You gain proficiency in one skill of your choice',
    racialFeats: [
      {
        name: 'Human Feat',
        description:
          'You gain one feat of your choice. This feat must be chosen from the list of feats available to your character, and you must meet any prerequisites.',
      },
    ],
  };
  const races: Ref<Race[]> = ref([human, humanVariant, dragonborn]);
</script>

<template>
  <RaceView
    class="race-view"
    v-for="race in races"
    v-bind="race"
    :key="race.name"
  />
</template>

<style scoped>
  .race-view {
    margin-bottom: 1rem;
  }
</style>
