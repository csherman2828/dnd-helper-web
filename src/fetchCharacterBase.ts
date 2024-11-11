import { type CharacterBase, Size } from './CharacterBase';

async function fetchCharacterBase(characterId: string) {
  console.log(`Fetching character base for character ID: ${characterId}`);
  const characterBase: CharacterBase = {
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
      age: 750,
      abilityScoreIncrease: {
        dexterity: 2,
      },
      size: Size.MEDIUM,
      speed: 30,
      languages: ['Common', 'Elvish'],
      traits: [
        {
          name: 'Darkvision',
          description:
            'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.',
        },
        {
          name: 'Fey Ancestry',
          description:
            'You have advantage on saving throws against being charmed, and magic can’t put you to sleep.',
        },
        {
          name: 'Trance',
          description:
            'Elves do not sleep. Instead they meditate deeply, remaining semi-conscious, for 4 hours a day. The Common word for this meditation is "trance." While meditating, you dream after a fashion; such dreams are actually mental exercises that have become reflexive after years of practice. After resting in this way, you gain the same benefit a human would from 8 hours of sleep.',
        },
        {
          name: 'Keen Senses',
          description: 'You have proficiency in the Perception skill.',
        },
      ],
      subrace: {
        name: 'High Elf',
        abilityScoreIncrease: {
          intelligence: 1,
        },
        traits: [
          {
            name: 'Elf Weapon Training',
            description:
              'You have proficiency with the longsword, shortsword, shortbow, and longbow.',
          },
          {
            name: 'Cantrip',
            description:
              'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.',
          },
          {
            name: 'Extra Language',
            description: 'You can speak, read, and write one extra language.',
          },
        ],
      },
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
  return characterBase;
}

export default fetchCharacterBase;
