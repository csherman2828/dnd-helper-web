<script lang="ts" setup>
  import { ref, computed, type Ref } from 'vue';

  type AbilityLabel =
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma';

  type SkillLabel =
    | 'acrobatics'
    | 'animal handling'
    | 'arcana'
    | 'athletics'
    | 'deception'
    | 'history'
    | 'insight'
    | 'intimidation'
    | 'investigation'
    | 'medicine'
    | 'nature'
    | 'perception'
    | 'performance'
    | 'persuasion'
    | 'religion'
    | 'sleight of hand'
    | 'stealth'
    | 'survival';

  interface BaseCharacter {
    name: string;
    playerName: string;
    classes: { name: string; level: number }[];
    race: { name: string; subrace: string };
    background: { name: string };
    alignment: string;
    baseAbilityScores: {
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
    };
    skillProficiencies: SkillLabel[];
    savingThrowProficiencies: AbilityLabel[];
  }

  const baseCharacter: BaseCharacter = {
    name: 'Varis Skyshadow',
    playerName: 'Chris Sherman',
    classes: [
      {
        name: 'Sorcerer',
        level: 4,
      },
      {
        name: 'Fighter',
        level: 1,
      },
    ],
    race: {
      name: 'Elf',
      subrace: 'High Elf',
    },
    background: { name: 'Disavowed Noble' },
    alignment: 'Neutral Good',
    baseAbilityScores: {
      strength: 6,
      dexterity: 16,
      constitution: 14,
      intelligence: 12,
      wisdom: 10,
      charisma: 18,
    },
    savingThrowProficiencies: ['dexterity', 'charisma'],
    skillProficiencies: [
      'acrobatics',
      'arcana',
      'deception',
      'insight',
      'perception',
      'persuasion',
    ],
  };

  class Character {
    private baseCharacter: BaseCharacter;
    private isInspired: boolean;
    constructor(baseCharacter: BaseCharacter) {
      this.baseCharacter = baseCharacter;
      this.isInspired = false;
    }
    getName() {
      return this.baseCharacter.name;
    }
    getClasses() {
      return this.baseCharacter.classes;
    }
    getBackground() {
      return this.baseCharacter.background.name;
    }
    getPlayerName() {
      return this.baseCharacter.playerName;
    }
    getRace() {
      return `${this.baseCharacter.race.name} (${this.baseCharacter.race.subrace})`;
    }
    getAlignment() {
      return this.baseCharacter.alignment;
    }
    getLevel() {
      return this.baseCharacter.classes.reduce(
        (acc, characterClass) => acc + characterClass.level,
        0,
      );
    }
    hasInspiration() {
      return this.isInspired;
    }
    inspire() {
      this.isInspired = true;
    }
    useInspiration() {
      this.isInspired = false;
    }
    getProficiencyBonus() {
      return Math.ceil(this.getLevel() / 4) + 1;
    }
    getAbilityScore(ability: AbilityLabel) {
      return this.baseCharacter.baseAbilityScores[ability];
    }
    getAbilityModifier(ability: AbilityLabel) {
      return Math.floor((this.getAbilityScore(ability) - 10) / 2);
    }
    getSavingThrow(abilityName: AbilityLabel) {
      const proficiencyBonus = this.getProficiencyBonus();
      const isProficient =
        this.baseCharacter.savingThrowProficiencies.includes(abilityName);
      return (
        this.getAbilityModifier(abilityName) +
        (isProficient ? proficiencyBonus : 0)
      );
    }
    getSkillAbility(skill: SkillLabel) {
      switch (skill) {
        case 'acrobatics':
        case 'sleight of hand':
        case 'stealth':
          return 'dexterity';
        case 'animal handling':
        case 'insight':
        case 'medicine':
        case 'perception':
        case 'survival':
          return 'wisdom';
        case 'arcana':
        case 'history':
        case 'investigation':
        case 'nature':
        case 'religion':
          return 'intelligence';
        case 'athletics':
          return 'strength';
        case 'deception':
        case 'intimidation':
        case 'performance':
        case 'persuasion':
          return 'charisma';
      }
    }
    getSkillModifier(skill: SkillLabel) {
      const ability = this.getSkillAbility(skill);
      const proficiencyBonus = this.getProficiencyBonus();
      const isProficient =
        this.baseCharacter.skillProficiencies.includes(skill);
      return (
        this.getAbilityModifier(ability) + (isProficient ? proficiencyBonus : 0)
      );
    }
    getSkillDisplay(skill: SkillLabel) {
      const modifier = this.getSkillModifier(skill);
      return `${modifier >= 0 ? '+' : ''}${modifier}`;
    }
  }

  const character = ref(new Character(baseCharacter));

  const characterName = computed(() => character.value.getName());
  const classAndLevel = computed(() =>
    character.value
      .getClasses()
      .map(c => `${c.name} ${c.level}`)
      .join(', '),
  );
  const background = computed(() => character.value.getBackground());
  const playerName = computed(() => character.value.getPlayerName());
  const race = computed(() => character.value.getRace());
  const alignment = computed(() => character.value.getAlignment());
  const level = computed(() => character.value.getLevel());
  const hasInspiration = computed(() => ({
    get() {
      return character.value.hasInspiration();
    },
    set(newValue: boolean) {
      console.log({ newValue });
      if (newValue) {
        character.value.inspire();
      } else {
        character.value.useInspiration();
      }
    },
  }));
  const proficiencyBonus = computed(() =>
    character.value.getProficiencyBonus(),
  );

  const abilityList: AbilityLabel[] = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
  ];

  interface Ability {
    label: string;
    modifier: number;
    score: number;
  }

  const abilities: Ref<Ability[]> = ref(
    abilityList.map(ability => ({
      label: ability[0].toUpperCase() + ability.slice(1),
      modifier: character.value.getAbilityModifier(ability),
      score: character.value.getAbilityScore(ability),
    })),
  );

  interface SavingThrow {
    label: AbilityLabel;
    modifier: number;
  }

  const savingThrows: Ref<SavingThrow[]> = ref(
    abilityList.map(ability => ({
      label: ability,
      modifier: character.value.getSavingThrow(ability),
    })),
  );

  interface Skill {
    label: SkillLabel;
    modifier: number;
  }

  const skillList: SkillLabel[] = [
    'acrobatics',
    'animal handling',
    'arcana',
    'athletics',
    'deception',
    'history',
    'insight',
    'intimidation',
    'investigation',
    'medicine',
    'nature',
    'perception',
    'performance',
    'persuasion',
    'religion',
    'sleight of hand',
    'stealth',
    'survival',
  ];

  const skills: Ref<Skill[]> = ref(
    skillList.map(skill => ({
      label: skill,
      modifier: character.value.getSkillModifier(skill),
    })),
  );

  const capitalize = (phrase: string) => {
    return phrase
      .split(' ')
      .map(word =>
        word !== 'of' ? word[0].toUpperCase() + word.slice(1) : word,
      )
      .join(' ');
  };
</script>

<template>
  <div class="page">
    <div class="character-sheet">
      <div class="header">
        <div class="name">{{ characterName }}</div>
        <div class="general-info">
          <div class="class-and-level">{{ classAndLevel }}</div>
          <div class="background">{{ background }}</div>
          <div class="player-name">{{ playerName }}</div>
          <div class="race">{{ race }}</div>
          <div class="alignment">{{ alignment }}</div>
          <div class="level">Level {{ level }} (Milestone)</div>
        </div>
      </div>
      <div class="content">
        <div class="stats">
          <div class="abilities">
            <div
              v-for="ability in abilities"
              :key="ability.label"
              :class="`ability ${ability.label}`"
            >
              <div class="label">
                {{ ability.label.slice(0, 3).toUpperCase() }}
              </div>
              <div class="modifier">
                {{ `${ability.modifier > 0 ? '+' : ''}${ability.modifier}` }}
              </div>
              <div class="score">
                {{ ability.score }}
              </div>
            </div>
          </div>
          <div class="derivatives">
            <div class="inspiration">
              <div>Inspiration</div>
              <v-checkbox
                :value="hasInspiration"
                @input="hasInspiration = !hasInspiration"
                hide-details
                hide-spin-buttons
                density="compact"
              ></v-checkbox>
            </div>
            <div class="proficiency-bonus">
              <div>Proficiency Bonus</div>
              <div>+{{ proficiencyBonus }}</div>
            </div>
            <div class="saving-throws">
              <div
                v-for="savingThrow in savingThrows"
                :key="savingThrow.label"
                :class="`saving-throw ${savingThrow.label}-saving-throw`"
              >
                <div class="label">{{ capitalize(savingThrow.label) }}</div>
                <div class="modifier">
                  {{
                    `${savingThrow.modifier > 0 ? '+' : ''}${savingThrow.modifier}`
                  }}
                </div>
              </div>
              <div class="small-label">Saving Throws</div>
            </div>
            <div class="skills">
              <div
                v-for="skill in skills"
                :key="skill.label"
                :class="`skill ${skill.label}`"
              >
                <div class="label">{{ capitalize(skill.label) }}</div>
                <div class="modifier">
                  {{ `${skill.modifier > 0 ? '+' : ''}${skill.modifier}` }}
                </div>
              </div>
              <div class="small-label">Skills</div>
            </div>
          </div>
        </div>
        <div class="resources">
          <div class="big-resources">
            <div class="big-resource armor-class">
              <div class="value">13</div>
              <div class="label">Armor Class</div>
            </div>
            <div class="big-resource initiative">
              <div class="value">13</div>
              <div class="label">Initiative</div>
            </div>
            <div class="big-resource speed">
              <div class="value">30 ft.</div>
              <div class="label">Speed</div>
            </div>
          </div>
        </div>
        <div class="details"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .page {
    padding: 1rem;
  }

  .character-sheet {
    padding: 1rem;
    border: 5px white solid;
    border-radius: 15px;
    max-width: 1000px;
    margin: auto;
  }

  .character-sheet .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 1rem;
    padding-bottom: calc(0.5rem - 1px);
    border-bottom: 2px solid white;
    margin-bottom: calc(0.5rem + 1px);
  }

  .character-sheet .header .name {
    flex: 2;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .character-sheet .header .general-info {
    flex: 5;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .character-sheet .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .character-sheet .content .stats {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: center;
    gap: 1rem;
  }

  .character-sheet .content .stats .abilities {
    display: flex;
    justify-content: center;
    flex-flow: column nowrap;
    gap: 1.5rem;
    height: 100%;
  }

  .character-sheet .content .stats .abilities .ability {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid white;
    border-radius: 10px;
    width: 5rem;
  }

  .character-sheet .content .stats .abilities .ability .label {
    font-weight: bold;
  }

  .character-sheet .content .stats .abilities .ability .score {
    font-size: 0.75rem;
  }

  .character-sheet .content .stats .abilities .ability .modifier {
    font-size: 1.5rem;
  }

  .character-sheet .content .stats .derivatives {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
  }

  .character-sheet .content .stats .derivatives .inspiration,
  .character-sheet .content .stats .derivatives .proficiency-bonus,
  .character-sheet .content .stats .derivatives .skills,
  .character-sheet .content .stats .derivatives .saving-throws {
    border: 1px solid white;
    border-radius: 5px;
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .character-sheet .content .stats .derivatives .inspiration,
  .character-sheet .content .stats .derivatives .proficiency-bonus,
  .character-sheet .content .stats .derivatives .skills .skill,
  .character-sheet .content .stats .derivatives .saving-throws .saving-throw {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .character-sheet .content .stats .derivatives .skills,
  .character-sheet .content .stats .derivatives .saving-throws {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.25rem;
  }

  .character-sheet .content .stats .derivatives .inspiration .v-checkbox {
    margin-right: -6px;
    margin-top: -6px;
    margin-bottom: -6px;
  }

  .big-resources {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .big-resource {
    display: grid;
    grid-template-rows: 1fr auto;
    padding: 0.5rem;
    border: 1px white solid;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }

  .big-resource .value,
  .big-resource .label {
    text-align: center;
  }

  .big-resource .value {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    padding: 0.8rem;
  }

  .big-resource .label {
    font-size: 0.8rem;
    color: #ccc;
  }

  .small-label {
    text-align: center;
    color: #ccc;
    font-size: 0.8rem;
  }
</style>
