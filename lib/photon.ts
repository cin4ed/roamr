import { FeatureCollection } from 'geojson';

export async function autocomplete(input: string): Promise<FeatureCollection> {
  try {
    const response = await fetch('https://photon.komoot.io/api/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: input }),
    });

    const data = await response.json();
    const features = data.features || [];
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
