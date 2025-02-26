"use client";

import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { LngLatLike, MapRef } from "react-map-gl/maplibre";
import type { CircleLayerSpecification as CircleLayer } from "react-map-gl/maplibre";
import type { FeatureCollection, Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
// import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { latestLocations } from "@/data/latest-locations";
import type { Location } from "@/data/latest-locations";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import AuthButton from "@/components/auth-button";
import { useSession } from "next-auth/react";

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
      {/* <AppSidebar className="w-16" />
      <div className="flex-1">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full font-[family-name:var(--font-geist-sans)]"
        >
          <ResizablePanel defaultSize={50} className="min-w-[550px]">
            <ScrollArea className="h-screen p-6">
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
              <div className="space-y-10 mt-5">
                {!session && <CreateAccountSection />}
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
                          <LocationCard location={location} key={location.id} />
                        ))}
                      </div>
                      <ScrollBar className="w-full" orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>
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
      </div> */}
    </div>
  );
}

function LocationCard({ location }: { location: Location }) {
  return (
    <div
      className="border rounded-lg overflow-hidden w-52 flex flex-col relative hover:bg-zinc-900 cursor-pointer"
      key={location.id}
    >
      <Badge
        className="absolute top-1 left-1"
        variant={location.status == "verified" ? "success" : "destructive"}
      >
        {location.status == "verified" ? "Verified" : "In Review"}
      </Badge>
      <Badge
        className="absolute top-1 right-1 flex items-center gap-1"
        variant="secondary"
      >
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

function CreateAccountSection() {
  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">
          Create an Account to Explore & Contribute!
        </h2>
        <p className="text-sm text-zinc-400">
          Join the Roamr urbex community and unlock exclusive features.{" "}
        </p>
        <Separator className="mt-2" />
      </div>
      <div className="mt-2 space-y-4">
        <p>With an account, you can:</p>
        <ul className="list-disc list-inside">
          <li>📍 Contribute to the map by adding new locations.</li>
          <li>⭐️ Rate, review, and leave comments on urbex spots.</li>
          <li>👥 Connect with fellow explorers and plan trips together</li>
          <li>
            💬 Join our exclusive Discord to share experiences, get tips, and
            stay updated on new features!
          </li>
        </ul>
        <AuthButton />
      </div>
    </div>
  );
}
