"use client";

import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { LngLatLike, MapRef } from "react-map-gl/maplibre";
import type { CircleLayerSpecification as CircleLayer } from "react-map-gl/maplibre";
import type { FeatureCollection, Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef } from "react";
import AppSidebar from "@/components/app-sidebar";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { latestLocations } from "@/data/latest-locations";
import type { Location } from "@/data/latest-locations";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import SearchBar from "@/components/SearchBar";
import { Separator } from "@/components/ui/separator";

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
          <ResizablePanel defaultSize={50} className="min-w-[550px]">
            <ScrollArea className="h-screen p-6">
              <div className="space-y-5">
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
                <div>
                  <div>
                    <h2 className="text-xl font-bold">Latest Additions</h2>
                    <p className="text-sm text-zinc-400">
                      Explore the latest additions to our map.
                    </p>
                    <Separator className="mt-2" />
                  </div>
                  <div className="flex">
                    <ScrollArea type="always" className="w-1 flex-1">
                      <div className="flex gap-5 mt-4 mb-5">
                        {latestLocations.map((location) => (
                          <LocationCard location={location} />
                        ))}
                      </div>
                      <ScrollBar className="w-full" orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>
              {/* <h2 className="text-xl font-bold">Latest Additions</h2>
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
                </div> */}
              {/* <div className="space-y-5">
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
                </div> */}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
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

function LocationCard({ location }: { location: Location }) {
  return (
    <div
      className="border rounded-lg overflow-hidden w-52 flex flex-col relative hover:bg-zinc-900 cursor-pointer"
      key={location.id}
    >
      <Badge className="absolute top-1 left-1" variant={location.status == "verified" ? "success" : "destructive"}>
        {location.status == "verified" ? "Verified" : "In Review"}
      </Badge>
      <Badge className="absolute top-1 right-1 flex items-center gap-1" variant="secondary">
        {location.rating}
        <span className="inline-block">⭐️</span>
        {/* <Star className="h-3 w-3" /> */}
      </Badge>
      <img
        src={location.images[0]}
        alt={location.name}
        className="w-full h-32 object-cover"
      />
      <div className="px-2 py-3 flex-1 flex flex-col gap-3 justify-between">
        <div className="space-y-1.5">
          <div className="text-sm font-bold">{location.name}</div>
          <div className="text-xs text-zinc-400">{location.description}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <p className="text-xs text-zinc-400">Added by</p>
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={location.addedBy.profileImage}
                alt={location.addedBy.name}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex gap-1 items-center text-muted-foreground">
            <p className="text-xs">{location.country}</p>
            <MapPin className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
