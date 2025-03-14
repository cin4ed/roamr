import axios from 'axios';
import { FeatureCollection } from 'geojson';

export async function autocomplete(input: string): Promise<FeatureCollection> {
  try {
    const response = await axios.get('https://photon.komoot.io/api/', {
      params: { q: input },
    });

    const features = response.data.features || [];
    return {
      type: 'FeatureCollection',
      features,
    };
  } catch (error) {
    console.log('Error fetching autocomplete data:', error);

    return {
      type: 'FeatureCollection',
      features: [],
    };
  }
}
