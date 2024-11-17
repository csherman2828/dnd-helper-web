import { type CampaignListing } from './CampaignListing';

async function fetchCampaigns(userId: string): Promise<CampaignListing[]> {
  console.log(`Fetching character base for user id: ${userId}`);

  return [
    {
      id: '1',
      name: 'Blue Campaign',
    },
    {
      id: '2',
      name: 'Gold Campaign',
    },
    {
      id: '3',
      name: 'Joliet Campaign',
    },
    {
      id: '4',
      name: "Jordan's Campaign",
    },
  ];
}

export default fetchCampaigns;
