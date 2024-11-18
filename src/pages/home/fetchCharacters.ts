import { type CharacterListing } from '../../types/CharacterListing';
async function fetchCharacters(userId: string): Promise<CharacterListing[]> {
  console.log(`Fetching character base for user id: ${userId}`);

  return [
    {
      id: '1',
      name: 'Varis Skyshadow',
    },
    {
      id: '2',
      name: 'Grimm Blackstone',
    },
    {
      id: '3',
      name: 'Arianna Silverwind',
    },
    {
      id: '4',
      name: 'Kaelin Swiftfoot',
    },
  ];
}

export default fetchCharacters;
