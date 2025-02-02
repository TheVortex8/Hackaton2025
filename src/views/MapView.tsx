import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type MapViewProps = {
  table: Array<any>;
};

const severityMap: { [key: string]: number } = {
  low: 1,
  medium: 3,
  high: 5,
};

const MapView = ({ table }: MapViewProps) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX; // Replace with your token

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/momolt/cm6mzqawt00nh01ry4yeb2fst/draft", // Change to other styles if needed
      center: [-71.2082, 53.8139], // Longitude, Latitude for Quebec City
      zoom: 4,
    });

    map.on("load", () => {
      // Add a source for the locations
      map.addSource("locations", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: table.map((row) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [row.location[1], row.location[0]],
            },
            properties: {
              severity: severityMap[row.severity.toLowerCase()] || 1, // Map severity to number
            },
          })),
        },
      });

      // Add a layer to use circles to represent the locations
      map.addLayer({
        id: "locations",
        type: "circle",
        source: "locations",
        paint: {
          "circle-radius": 17,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "severity"],
            1,
            "rgba(255,0,0,0.1)",
            2,
            "rgba(255,0,0,0.3)",
            3,
            "rgba(255,0,0,0.5)",
            4,
            "rgba(255,0,0,0.7)",
            5,
            "rgba(255,0,0,1)",
          ],
          "circle-stroke-color": "#B42222",
          "circle-stroke-width": 2,
        },
      });
    });

    return () => map.remove();
  }, [table]);

  return (
    <div className="w-[91vw] border rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="h-[calc(100vh-50px)]" />
    </div>
  );
};

export default MapView;
