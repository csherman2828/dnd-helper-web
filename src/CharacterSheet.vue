<script lang="ts" setup>
  import { ref, computed, type Ref } from 'vue';
  import CharacterSheetPage from './CharacterSheetPage.vue';
  import CharacterSheetColumn from './CharacterSheetColumn.vue';
  import CharacterSheetSection from './CharacterSheetSection.vue';
  import { Character, type AbilityLabel, type SkillLabel } from './Character';

  const { character: characterProp } = defineProps({
    character: {
      type: Object as () => Character,
      required: true,
    },
  });

  // need to typecast because typescript forgets variables are private
  const character: Ref<Character> = ref(characterProp) as Ref<Character>;

  function displayWithSign(value: number) {
    return `${value > 0 ? '+' : ''}${value}`;
  }

  function capitalize(phrase: string) {
    return phrase
      .split(' ')
      .map(word =>
        word !== 'of' ? word[0].toUpperCase() + word.slice(1) : word,
      )
      .join(' ');
  }

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
    modifier: string;
    score: number;
  }

  const abilities: Ref<Ability[]> = ref(
    abilityList.map(ability => ({
      label: ability.slice(0, 3).toUpperCase(),
      modifier: displayWithSign(character.value.getAbilityModifier(ability)),
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

  const languages = computed(() => character.value.getLanguages().join(', '));

  const armorClass = computed(() => character.value.getArmorClass());
  const initiativeModifier = computed(() =>
    displayWithSign(character.value.getAbilityModifier('dexterity')),
  );
  const speed = computed(() => character.value.getSpeed());

  const maximumHitPoints = computed(() => character.value.getMaxHitPoints());
  const currentHitPoints = computed(() =>
    character.value.getCurrentHitPoints(),
  );
  const temporaryHitPoints = computed(() =>
    character.value.getTemporaryHitPoints(),
  );
  const maxHitDice = computed(() => character.value.getMaxHitDice());
  const ideals = computed(() => character.value.getIdeals());
  const bonds = computed(() => character.value.getBonds());
  const flaws = computed(() => character.value.getFlaws());
  const racialTraits = computed(() => character.value.getRacialTraits());
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
                    {{ ability.label }}
                  </div>
                  <div class="modifier">
                    {{ ability.modifier }}
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
            <CharacterSheetSection title="Other Proficiencies &amp; Languages">
              Languages: {{ languages }}
            </CharacterSheetSection>
          </CharacterSheetColumn>
          <CharacterSheetColumn class="center-column">
            <div class="character-sheet-row big-resources">
              <CharacterSheetSection
                title="Armor Class"
                class="big-resource armor-class"
              >
                {{ armorClass }}
              </CharacterSheetSection>
              <CharacterSheetSection
                title="Initiative"
                class="big-resource initiative-bonus"
              >
                {{ initiativeModifier }}
              </CharacterSheetSection>
              <CharacterSheetSection title="Speed" class="big-resource speed">
                {{ speed }}
              </CharacterSheetSection>
            </div>
            <CharacterSheetSection
              title="Current Hitpoints"
              class="big-resource hitpoints"
            >
              {{ currentHitPoints }} / {{ maximumHitPoints }}
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Temporary Hitpoints"
              class="big-resource temporary-hitpoint"
            >
              {{ temporaryHitPoints }}
            </CharacterSheetSection>
            <div
              class="character-sheet-row"
              style="grid-template-columns: repeat(2, 1fr)"
            >
              <CharacterSheetSection
                title="Hit Dice"
                style="
                  text-align: center;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-size: 1.5rem;
                "
              >
                {{ maxHitDice }}
              </CharacterSheetSection>
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
              class="ideals personality-trait"
            >
              <div v-for="ideal of ideals" :key="ideal">
                {{ ideal }}
              </div>
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Bonds"
              class="bonds personality-trait"
            >
              <div v-for="bond of bonds" :key="bond">
                {{ bond }}
              </div>
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Flaws"
              class="flaws personality-trait"
            >
              <div v-for="flaw of flaws" :key="flaw">
                {{ flaw }}
              </div>
            </CharacterSheetSection>
            <CharacterSheetSection
              title="Features &amp; Traits"
              style="display: flex; flex-flow: column nowrap; gap: 0.5rem"
            >
              <div v-for="racialTrait in racialTraits" :key="racialTrait.name">
                <div style="font-weight: bold">
                  {{ racialTrait.name }}
                </div>
                <div>{{ racialTrait.description }}</div>
              </div>
            </CharacterSheetSection>
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
            <div class="character-sheet-row">
              <CharacterSheetSection
                title="Spellcasting Ability"
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
    padding: 0.25rem;
    border: 1px solid white;
    border-radius: 10px;
    width: 6rem;
  }

  .ability .label {
    font-weight: bold;
  }

  .ability .score {
    font-size: 1rem;
  }

  .ability .modifier {
    font-size: 2rem;
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

  .character-sheet-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-content: stretch;
    gap: 0.5rem;
  }

  .big-resource {
    padding: 0.5rem;
    width: 100%;
    text-align: center;
    font-size: 2rem;
  }
</style>
