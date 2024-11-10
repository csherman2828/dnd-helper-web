<script lang="ts" setup>
  import { ref, computed, type Ref } from 'vue';
  import CharacterSheetPage from './CharacterSheetPage.vue';
  import CharacterSheetColumn from './CharacterSheetColumn.vue';
  import CharacterSheetSection from './CharacterSheetSection.vue';

  function roundDown(value: number) {
    return Math.floor(value);
  }

  function getDiceAverage(sides: number) {
    let sum = 0;
    for (let i = 1; i <= sides; i++) {
      sum += i;
    }
    return sum / sides;
  }

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
    classes: { name: string; level: number; hitDice: number }[];
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
    ideals: string[];
    bonds: string[];
    flaws: string[];
  }

  const baseCharacter: BaseCharacter = {
    name: 'Varis Skyshadow',
    playerName: 'Chris Sherman',
    classes: [
      {
        name: 'Sorcerer',
        level: 4,
        hitDice: 6,
      },
      {
        name: 'Fighter',
        level: 1,
        hitDice: 10,
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
    ideals: [
      'I must prove that I am worthy of my family name.',
      'I will do whatever it takes to protect my friends.',
    ],
    bonds: [
      'I will not rest until my family is avenged.',
      'I will do whatever it takes to protect my friends.',
    ],
    flaws: [
      'I am quick to anger and slow to forgive.',
      "I am haunted by the memory of my family's death.",
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
    getMaxHitPoints() {
      if (this.getLevel() === 1) {
        return roundDown(
          this.baseCharacter.classes[0].hitDice +
            this.getAbilityModifier('constitution'),
        );
      }
      return roundDown(
        this.baseCharacter.classes.reduce((acc, characterClass) => {
          return (
            acc +
            characterClass.level *
              (getDiceAverage(characterClass.hitDice) +
                this.getAbilityModifier('constitution'))
          );
        }, 0),
      );
    }
    getIdeals() {
      return this.baseCharacter.ideals;
    }
    getBonds() {
      return this.baseCharacter.bonds;
    }
    getFlaws() {
      return this.baseCharacter.flaws;
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

  const maximumHitPoints = computed(() => character.value.getMaxHitPoints());
  const ideals = computed(() => character.value.getIdeals());
  const bonds = computed(() => character.value.getBonds());
  const flaws = computed(() => character.value.getFlaws());
</script>

<template>
  <div class="page">
    <div class="character-sheet">
      <CharacterSheetPage class="main">
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
          <CharacterSheetColumn class="left-column">
            <div class="scores-and-modifiers">
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
                    {{
                      `${ability.modifier > 0 ? '+' : ''}${ability.modifier}`
                    }}
                  </div>
                  <div class="score">
                    {{ ability.score }}
                  </div>
                </div>
              </div>
              <CharacterSheetColumn class="derivatives">
                <CharacterSheetSection class="inspiration">
                  <div>Inspiration</div>
                  <v-checkbox
                    :value="hasInspiration"
                    @input="hasInspiration = !hasInspiration"
                    hide-details
                    hide-spin-buttons
                    density="compact"
                  ></v-checkbox>
                </CharacterSheetSection>
                <CharacterSheetSection class="proficiency-bonus">
                  <div>Proficiency Bonus</div>
                  <div>+{{ proficiencyBonus }}</div>
                </CharacterSheetSection>
                <CharacterSheetSection
                  title="Saving Throws"
                  class="saving-throws"
                >
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
                </CharacterSheetSection>
                <CharacterSheetSection title="Skills" class="skills">
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
                </CharacterSheetSection>
              </CharacterSheetColumn>
            </div>
            <CharacterSheetSection class="proficiency-bonus">
              <div>Passive Wisdom (Perception)</div>
              <div>+{{ proficiencyBonus }}</div>
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Other Proficiencies &amp; Languages"
            ></CharacterSheetSection>
          </CharacterSheetColumn>
          <CharacterSheetColumn class="center-column">
            <div class="big-resources">
              <CharacterSheetSection
                title="Armor Class"
                class="big-resource armor-class"
              >
                13
              </CharacterSheetSection>
              <CharacterSheetSection
                title="Initiative"
                class="big-resource initiative"
              >
                +4
              </CharacterSheetSection>
              <CharacterSheetSection title="Speed" class="big-resource speed">
                30 ft.
              </CharacterSheetSection>
            </div>
            <CharacterSheetSection title="Current Hitpoints">
              {{ maximumHitPoints }}
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Temporary Hitpoints"
            ></CharacterSheetSection>
            <div>
              <CharacterSheetSection title="Hit Dice"></CharacterSheetSection>
              <CharacterSheetSection
                title="Death Saves"
              ></CharacterSheetSection>
            </div>
            <CharacterSheetSection
              title="Attacks &amp; Spellcasting"
            ></CharacterSheetSection>
            <CharacterSheetSection title="Equipment"></CharacterSheetSection>
          </CharacterSheetColumn>
          <CharacterSheetColumn class="right-column">
            <CharacterSheetSection
              title="Ideals"
              class="personality-trait ideals"
            >
              <div v-for="ideal of ideals" :key="ideal">
                {{ ideal }}
              </div>
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Ideals"
              class="personality-trait ideals"
            >
              <div v-for="bond of bonds" :key="bond">
                {{ bond }}
              </div>
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Ideals"
              class="personality-trait ideals"
            >
              <div v-for="flaw of flaws" :key="flaw">
                {{ flaw }}
              </div>
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Features &amp; Traits"
              class="personality-trait ideals"
            ></CharacterSheetSection>
          </CharacterSheetColumn>
        </div>
      </CharacterSheetPage>
      <CharacterSheetPage class="backstory">
        <div class="header">
          <div class="name">{{ characterName }}</div>
          <div class="appearance">
            <div class="age">135</div>
            <div class="height">6ft. 5in.</div>
            <div class="weight">200 lbs.</div>
            <div class="eyes">Blue</div>
            <div class="skin">White/Pale</div>
            <div class="hair">White</div>
          </div>
        </div>
        <div class="content">
          <CharacterSheetColumn class="left-column">
            <CharacterSheetSection
              title="Character Appearance"
            ></CharacterSheetSection>
            <CharacterSheetSection
              title="Character Backstory"
            ></CharacterSheetSection>
          </CharacterSheetColumn>
          <CharacterSheetColumn class="right-column">
            <CharacterSheetSection
              title="Allies &amp; Organizations"
            ></CharacterSheetSection>
            <CharacterSheetSection
              title="Additional Features &amp; Traits"
            ></CharacterSheetSection>
            <CharacterSheetSection title="Treasure"></CharacterSheetSection>
          </CharacterSheetColumn>
        </div>
      </CharacterSheetPage>
      <CharacterSheetPage class="spellcasting">
        <div class="header">
          <div class="spellcasting-class">Sorcerer</div>
          <div class="general-info">
            <div class="big-resources">
              <CharacterSheetSection
                title="Armor Class"
                class="big-resource armor-class"
              >
                13
              </CharacterSheetSection>
              <CharacterSheetSection
                title="Initiative"
                class="big-resource initiative"
              >
                +4
              </CharacterSheetSection>
              <CharacterSheetSection title="Speed" class="big-resource speed">
                30 ft.
              </CharacterSheetSection>
            </div>
          </div>
        </div>
        <div class="content"></div>
      </CharacterSheetPage>
    </div>
  </div>
</template>

<style scoped>
  .page {
    padding: 1rem;
  }

  .character-sheet {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 1rem;
    padding-bottom: calc(0.5rem - 1px);
    border-bottom: 2px solid white;
    margin-bottom: calc(0.5rem + 1px);
  }

  .header .name {
    flex: 2;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .general-info,
  .appearance {
    flex: 5;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .main .content,
  .spellcasting .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .backstory .content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
  }

  .scores-and-modifiers {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: center;
    gap: 1rem;
  }

  .abilities {
    display: flex;
    justify-content: center;
    flex-flow: column nowrap;
    gap: 1.5rem;
    height: 100%;
  }

  .ability {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid white;
    border-radius: 10px;
    width: 5rem;
  }

  .ability .label {
    font-weight: bold;
  }

  .ability .score {
    font-size: 0.75rem;
  }

  .ability .modifier {
    font-size: 1.5rem;
  }

  .inspiration,
  .proficiency-bonus,
  .skill,
  .saving-throw {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .skills,
  .saving-throws {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.25rem;
  }

  .inspiration .v-checkbox {
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
</style>
