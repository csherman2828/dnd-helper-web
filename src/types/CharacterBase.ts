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

type SizeName = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
class Size {
  static TINY = new Size('Tiny');
  static SMALL = new Size('Small');
  static MEDIUM = new Size('Medium');
  static LARGE = new Size('Large');
  static HUGE = new Size('Huge');
  static GARGANTUAN = new Size('Gargantuan');

  private name: SizeName;
  private constructor(name: SizeName) {
    this.name = name;
  }

  enlarge() {
    switch (this.name) {
      case 'Tiny':
        return Size.SMALL;
      case 'Small':
        return Size.MEDIUM;
      case 'Medium':
        return Size.LARGE;
      case 'Large':
        return Size.HUGE;
      case 'Huge':
        return Size.GARGANTUAN;
      case 'Gargantuan':
        return Size.GARGANTUAN;
    }
  }

  reduce() {
    switch (this.name) {
      case 'Tiny':
        return Size.TINY;
      case 'Small':
        return Size.TINY;
      case 'Medium':
        return Size.SMALL;
      case 'Large':
        return Size.MEDIUM;
      case 'Huge':
        return Size.LARGE;
      case 'Gargantuan':
        return Size.HUGE;
    }
  }
}

interface RacialTrait {
  name: string;
  description: string;
}

interface Subrace {
  name: string;
  abilityScoreIncrease: Partial<Record<AbilityLabel, number>>;
  traits: RacialTrait[];
}

interface Race {
  name: string;
  subrace: Subrace;
  age: number;
  abilityScoreIncrease: Partial<Record<AbilityLabel, number>>;
  size: Size;
  speed: number;
  languages: string[];
  traits: RacialTrait[];
}
interface CharacterBase {
  name: string;
  playerName: string;
  classes: { name: string; level: number; hitDice: number }[];
  race: Race;
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

export {
  type CharacterBase,
  Size,
  type SizeName,
  type AbilityLabel,
  type SkillLabel,
  type RacialTrait,
};
