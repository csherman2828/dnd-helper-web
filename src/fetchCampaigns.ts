import { type CampaignListing } from './CampaignListing';

async function fetchCampaigns(userId: string): Promise<CampaignListing[]> {
  console.log(`Fetching character base for user id: ${userId}`);

  return [
    {
      name: 'Blue Campaign',
    },
    {
      name: 'Gold Campaign',
    },
    {
      name: 'Joliet Campaign',
    },
    {
      name: "Jordan's Campaign",
    },
  ];
}

export default fetchCampaigns;
