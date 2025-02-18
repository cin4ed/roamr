"use client";

// import { Map, Source, Layer } from "@vis.gl/react-maplibre";
// import type { CircleLayer } from "@vis.gl/react-maplibre";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { CircleLayerSpecification as CircleLayer } from "react-map-gl/maplibre";

// import type { CircleLayer } from "react-map-gl/maplibre";

import type { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const geojson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.4, 37.8] },
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
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen font-[family-name:var(--font-geist-sans)]"
    >
      <ResizablePanel defaultSize={25}>
        <div className="h-full p-6">
          <h1>This is roamr</h1>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="h-full">
          <Map
            initialViewState={{
              longitude: -100,
              latitude: 40,
              zoom: 3.5,
            }}
            // maxZoom={15.9}
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
