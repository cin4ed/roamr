'use client';

import { useMap } from 'react-map-gl/maplibre';
import { Source } from 'react-map-gl/maplibre';
import { Compass, User, PlusCircle } from 'lucide-react';
import { LocationMarker } from '@/components/location-marker';
// import ExploreDrawer from '@/components/ExploreDrawer';
import Link from 'next/link';
import LogoLinkButton from '@/components/LogoLinkButton';
import ExploreMap from '@/components/ExploreMap';

export default function Explore() {
  return (
    <div className="h-screen w-screen font-[family-name:var(--font-geist-sans)]">
      <LogoLinkButton
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] drop-shadow-lg"
        width={175}
      />
      <ExploreMap className="fixed inset-0" />
      {/* <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center h-24 px-4 z-[102]">
        <button className="flex flex-col items-center gap-1 text-primary">
          <Compass className="w-6 h-6" />
          <span className="text-xs">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground">
          <User className="w-6 h-6" />
          <span className="text-xs">You</span>
        </button>
        <Link href="/locations/create">
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs">Contribute</span>
          </button>
        </Link>
      </div> */}

      {/* {selectedLocation && <ExploreDrawer location={selectedLocation} />} */}
    </div>
  );
}

// function MapContent({
//   locations,
//   onLocationSelect,
// }: {
//   locations: Location[];
//   onLocationSelect: (location: Location) => void;
// }) {
//   const { current: map } = useMap();

//   const handleLocationClick = (location: Location) => {
//     if (!map) return;
//     onLocationSelect(location);
//     map.panTo([Number(location.longitude), Number(location.latitude)], {
//       duration: 1000,
//       essential: true,
//     });
//   };

//   const handleLocationDoubleClick = (location: Location) => {
//     if (!map) return;
//     map.flyTo({
//       center: [Number(location.longitude), Number(location.latitude)],
//       zoom: 14,
//       duration: 1500,
//       essential: true,
//     });
//   };

//   return (
//     <>
//       <Source
//         id="world-imagery"
//         type="raster"
//         tiles={[
//           'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//         ]}
//         tileSize={256}
//       />

//       {locations.map(location => (
//         <LocationMarker
//           key={location.id}
//           location={location}
//           onLocationClick={handleLocationClick}
//           onLocationDoubleClick={handleLocationDoubleClick}
//         />
//       ))}
//     </>
//   );
// }
