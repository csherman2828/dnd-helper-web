import { type CharacterListing } from './CharacterListing';
async function fetchCharacters(userId: string): Promise<CharacterListing[]> {
  console.log(`Fetching character base for user id: ${userId}`);

  return [
    {
      name: 'Varis Skyshadow',
    },
  ];
}

export default fetchCharacters;
