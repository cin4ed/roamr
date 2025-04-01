import { StyleSpecification } from 'react-map-gl/maplibre';

// export const mapStyleVector = 'https://tiles.openfreemap.org/styles/liberty';

export const mapStyleVector = {
  version: 8,
  name: 'Roamr Vintage',
  glyphs: 'https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=5NzjhnwCDgiMqPcWPsyj',
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://api.maptiler.com/tiles/v3-openmaptiles/tiles.json?key=5NzjhnwCDgiMqPcWPsyj',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#f1e7d3',
      },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: {
        'fill-color': '#cfd3ce',
      },
    },
    {
      id: 'boundaries',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['in', 'admin_level', 2, 3, 4],
      paint: {
        'line-color': '#3F4D34',
        'line-opacity': ['step', ['zoom'], 0, 5, 1],
      },
    },
    // {
    //   id: 'roads',
    //   type: 'line',
    //   source: 'openmaptiles',
    //   'source-layer': 'transportation',
    //   filter: ['==', 'class', 'bicycle'],
    //   paint: {
    //     'line-color': '#d0c3aa',
    //     'line-width': 1,
    //   },
    // },
    // {
    //   id: 'places',
    //   type: 'symbol',
    //   source: 'openmaptiles',
    //   'source-layer': 'place',
    //   layout: {
    //     'text-field': '{name:latin}',
    //     'text-font': ['Noto Serif Regular'],
    //     'text-size': 12,
    //   },
    //   paint: {
    //     'text-color': '#3f3b36',
    //     'text-halo-color': '#f1e7d3',
    //     'text-halo-width': 1,
    //   },
    // },
  ],
};

export const mapStyleRaster: StyleSpecification = {
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
  sky: {
    'sky-color': '#000000', // Black for a space-like effect
  },
};
