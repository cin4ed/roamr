"use client";

import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { LngLatLike, MapRef } from "react-map-gl/maplibre";
import type { CircleLayerSpecification as CircleLayer } from "react-map-gl/maplibre";
import type { FeatureCollection, Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef } from "react";

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
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen font-[family-name:var(--font-geist-sans)]"
    >
      <ResizablePanel defaultSize={30}>
        <div className="h-full p-6 space-y-5">
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
  );
}
