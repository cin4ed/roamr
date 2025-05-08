'use client';

import { useRef, useState } from 'react';
import Map, { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Dialog, VisuallyHidden } from 'radix-ui';
import Image from 'next/image';

// TODO: import this from an external file.
const roamrMapStyle = 'https://tiles.openfreemap.org/styles/liberty';

type ChooseLocationMapProps = {
  onLocationSelect?: (lat: number, lng: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  initialZoom?: number;
};

export default function LocationPicker({
  onLocationSelect,
  initialLatitude = 40,
  initialLongitude = -100,
  initialZoom = 3.5,
}: ChooseLocationMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [open, setOpen] = useState(false);

  const onSave = () => {
    if (!mapRef.current || !onLocationSelect) return;
    const center = mapRef.current.getCenter();
    onLocationSelect(center.lat, center.lng);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="border-secondary group relative h-[122px] w-full overflow-hidden rounded-md border hover:cursor-pointer focus:outline-none">
          {/* Map image as background */}
          <Image
            src="/images/map-picker-preview.webp"
            alt="Map preview"
            fill
            style={{ objectFit: 'cover' }}
            className="z-0"
            priority
          />
          {/* White overlay */}
          <div className="absolute inset-0 z-10 bg-white/60 group-hover:bg-white/50" />
          {/* Button content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <i className="fa-solid fa-map-location-dot text-primary text-xl"></i>
          </div>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed inset-0 z-30 m-4 overflow-hidden rounded-lg">
          <VisuallyHidden.Root>
            <Dialog.Title>Pick a location</Dialog.Title>
          </VisuallyHidden.Root>
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: initialLongitude,
              latitude: initialLatitude,
              zoom: initialZoom,
            }}
            attributionControl={{ compact: true }}
            maxZoom={15.9}
            style={{ width: '100%', height: '100%' }}
            mapStyle={roamrMapStyle}
          />
          <button
            onClick={onSave}
            className="bg-primary absolute bottom-20 left-1/2 w-[188px] -translate-x-1/2 rounded-lg py-4 text-white shadow-md hover:cursor-pointer"
          >
            Save
          </button>
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full transform">
            <i className="fa-solid fa-location-dot text-primary text-4xl drop-shadow-md"></i>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
