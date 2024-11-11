import fetchCharacterBase from './fetchCharacterBase';
import {
  type CharacterBase,
  Size,
  type SizeName,
  type AbilityLabel,
  type SkillLabel,
  type RacialTrait,
} from './CharacterBase';

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

class Character {
  private characterBase: CharacterBase;
  private isInspired: boolean;
  private currentHitPoints: number;
  private temporaryHitPoints: number;
  constructor(characterBase: CharacterBase) {
    this.characterBase = characterBase;
    this.isInspired = false;
    this.currentHitPoints = this.getMaxHitPoints();
    this.temporaryHitPoints = 0;
  }
  getName() {
    return this.characterBase.name;
  }
  getClasses() {
    return this.characterBase.classes;
  }
  getBackground() {
    return this.characterBase.background.name;
  }
  getPlayerName() {
    return this.characterBase.playerName;
  }
  getRace() {
    return this.characterBase.race.name;
  }
  getSubrace() {
    return this.characterBase.race.subrace.name;
  }
  getAlignment() {
    return this.characterBase.alignment;
  }
  getLevel() {
    return this.characterBase.classes.reduce(
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
    return this.characterBase.baseAbilityScores[ability];
  }
  getAbilityModifier(ability: AbilityLabel) {
    return Math.floor((this.getAbilityScore(ability) - 10) / 2);
  }
  getSavingThrow(abilityName: AbilityLabel) {
    const proficiencyBonus = this.getProficiencyBonus();
    const isProficient =
      this.characterBase.savingThrowProficiencies.includes(abilityName);
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
    const isProficient = this.characterBase.skillProficiencies.includes(skill);
    return (
      this.getAbilityModifier(ability) + (isProficient ? proficiencyBonus : 0)
    );
  }
  getSkillDisplay(skill: SkillLabel) {
    const modifier = this.getSkillModifier(skill);
    return `${modifier >= 0 ? '+' : ''}${modifier}`;
  }
  getLanguages() {
    return this.characterBase.race.languages;
  }
  getArmorClass() {
    return 10 + this.getAbilityModifier('dexterity');
  }
  getSpeed() {
    return this.characterBase.race.speed;
  }
  getCurrentHitPoints() {
    return this.currentHitPoints;
  }
  getMaxHitPoints() {
    if (this.getLevel() === 1) {
      return roundDown(
        this.characterBase.classes[0].hitDice +
          this.getAbilityModifier('constitution'),
      );
    }
    return roundDown(
      this.characterBase.classes.reduce((acc, characterClass) => {
        return (
          acc +
          characterClass.level *
            (getDiceAverage(characterClass.hitDice) +
              this.getAbilityModifier('constitution'))
        );
      }, 0),
    );
  }
  getTemporaryHitPoints() {
    return this.temporaryHitPoints;
  }
  getMaxHitDice() {
    const hitDice = {} as Record<string, number>;
    this.characterBase.classes.forEach(characterClass => {
      if (!hitDice[characterClass.hitDice]) {
        hitDice[`${characterClass.hitDice}`] = 0;
      }
      hitDice[`${characterClass.hitDice}`] += characterClass.level;
    });
    return Object.keys(hitDice)
      .map(dice => `${hitDice[dice]}d${dice}`)
      .sort()
      .join(' + ');
  }
  getIdeals() {
    return this.characterBase.ideals;
  }
  getBonds() {
    return this.characterBase.bonds;
  }
  getFlaws() {
    return this.characterBase.flaws;
  }
  getRacialTraits() {
    return this.characterBase.race.traits.concat(
      this.characterBase.race.subrace.traits,
    );
  }
  static async fetch(characterId: string) {
    return fetchCharacterBase(`/api/characters/${characterId}`);
  }
}

export {
  Character,
  Size,
  type SizeName,
  type AbilityLabel,
  type SkillLabel,
  type RacialTrait,
};
