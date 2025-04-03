import { StyleSpecification } from 'react-map-gl/maplibre';

export const mapStyleVector =
  'https://api.maptiler.com/maps/outdoor-v2/style.json?key=5NzjhnwCDgiMqPcWPsyj';

export const mapStyleRaster =
  'https://api.maptiler.com/maps/satellite/style.json?key=5NzjhnwCDgiMqPcWPsyj';
// export const mapStyleRaster: StyleSpecification = {
//   version: 8,
//   sources: {
//     'raster-tiles': {
//       type: 'raster',
//       tiles: [
//         'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//       ],
//       tileSize: 256,
//     },
//   },
//   layers: [
//     {
//       id: 'simple-tiles',
//       type: 'raster',
//       source: 'raster-tiles',
//       minzoom: 0,
//       maxzoom: 20,
//     },
//   ],
//   sky: {
//     'sky-color': '#000000', // Black for a space-like effect
//   },
// };
