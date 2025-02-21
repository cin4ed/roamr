"use client";

import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { LngLatLike, MapRef } from "react-map-gl/maplibre";
import type { CircleLayerSpecification as CircleLayer } from "react-map-gl/maplibre";
import type { FeatureCollection, Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef } from "react";
import AppSidebar from "@/components/app-sidebar";
import Image from "next/image";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import SearchBar from "@/components/SearchBar";

const geojson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.4, 37.8] },
      properties: null,
    },
  ],
};

const layerStyle: CircleLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
  source: "",
};

export default function Home() {
  const mapRef = useRef<MapRef>(null);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex">
      <AppSidebar className="w-16" />
      <div className="flex-1">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full font-[family-name:var(--font-geist-sans)]"
        >
          <ResizablePanel defaultSize={30} className="min-w-[350px]">
            <div className="p-6 space-y-5">
              <div>
                <SearchBar
                  onResultSelect={(f) => {
                    mapRef.current?.flyTo({
                      center: (f.geometry as Point).coordinates as LngLatLike,
                      zoom: 13,
                    });
                  }}
                />
              </div>
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Latest Additions</h2>
                <div className="flex gap-5 overflow-x-auto">
                  <div className="border rounded-lg overflow-hidden w-56">
                    <img
                      src="https://www.diarioelindependiente.mx/uploads/2023/11/16998640951cc2a.jpg"
                      alt="Hotel Los Arcos"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <div className="text-lg font-bold">Hotel Los Arcos</div>
                      <div className="text-sm text-zinc-400">
                        Abandoned hotel in the middle of La Paz Malecon with a
                        beautiful view of the sea.
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden w-56 bg-zinc-900"></div>
                </div>
              </div>
              <div className="space-y-5">
                <h2 className="text-xl font-bold">
                  Connect with Other Explorers
                </h2>
                <div className="flex flex-col gap-5 overflow-x-auto">
                  <div className="border h-16 flex gap-3 rounded-lg overflow-hidden w-full max-w-[450px]">
                    <Image
                      src="https://xsgames.co/randomusers/avatar.php?g=male"
                      alt="Avatar"
                      className="h-full object-cover"
                      width={64}
                      height={64}
                    />
                    <div className="p-2">
                      <div className="text-lg font-bold">John Doe</div>
                      <div className="text-sm text-zinc-400">
                        I'm an explorer looking for new places to discover.
                      </div>
                    </div>
                  </div>
                  <div className="border h-16 flex gap-3 rounded-lg overflow-hidden w-full bg-zinc-900 max-w-[450px]"></div>
                  <div className="border h-16 flex gap-3 rounded-lg overflow-hidden w-full bg-zinc-900 max-w-[450px]"></div>
                  <div className="border h-16 flex gap-3 rounded-lg overflow-hidden w-full bg-zinc-900 max-w-[450px]"></div>
                  <div className="border h-16 flex gap-3 rounded-lg overflow-hidden w-full bg-zinc-900 max-w-[450px]"></div>
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <div className="h-full">
              <Map
                ref={mapRef}
                initialViewState={{
                  longitude: -100,
                  latitude: 40,
                  zoom: 3.5,
                }}
                maxZoom={15.9}
                style={{ width: "100%", height: "100%" }}
                // mapStyle="https://tiles.openfreemap.org/styles/bright"
                // mapStyle="https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json"
                mapStyle="https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json"
              >
                <Source id="my-data" type="geojson" data={geojson}>
                  <Layer {...layerStyle} />
                </Source>
              </Map>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
