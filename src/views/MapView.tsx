import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MappedItem } from "./TableView";

type MapViewProps = {
  table: Array<any>;
  onRowClick: (row: any) => void;
  clickedRow?: MappedItem | null;
};

const severityMap: { [key: string]: number } = {
  low: 1,
  medium: 3,
  high: 5,
};

const MapView = ({ table, onRowClick, clickedRow }: MapViewProps) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX; // Replace with your token

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/momolt/cm6mzqawt00nh01ry4yeb2fst/draft", // Change to other styles if needed
      center: [-73.2082, 44.8139], // Longitude, Latitude for Quebec City
      zoom: 7,
    });

    mapRef.current = map;

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
              rowIndex: table.indexOf(row), // Add rowIndex to properties
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
            "match",
            ["get", "severity"],
            1,
            "rgba(255,255,0,0.5)", // low
            3,
            "rgba(255,165,0,0.5)", // medium
            5,
            "rgba(255,0,0,0.5)", // high
            "rgba(255,255,255,0.2)", // fallback color
          ],
          "circle-stroke-color": "grey",
          "circle-stroke-width": 2,
        },
      });

      // Add click event listener for the circles
      map.on("click", "locations", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["locations"],
        });

        if (features.length) {
          const clickedFeature = features[0];
          const rowIndex = clickedFeature.properties.rowIndex;
          const clickedRow = table[rowIndex];
          console.log("Clicked row:", clickedRow);
          onRowClick(clickedRow); // Call the callback function
        }
      });

      // Change the cursor to a pointer when the mouse is over the locations layer
      map.on("mouseenter", "locations", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change the cursor back to default when it leaves the locations layer
      map.on("mouseleave", "locations", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, [table, onRowClick]);

  useEffect(() => {
    if (clickedRow && mapRef.current) {
      const map = mapRef.current;
      const coordinates = [clickedRow.location[1], clickedRow.location[0]];

      // Create a popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setLngLat(coordinates)
        .setHTML(
          `<h3>${clickedRow.location}</h3><p>Severity: ${clickedRow.severity}</p>`
        )
        .addTo(map);

      // Fly to the location of the clicked row
      map.flyTo({ center: coordinates, zoom: 10 });

      return () => popup.remove();
    }
  }, [clickedRow]);

  return (
    <div className="w-[91vw] border rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="h-[calc(100vh-50px)]" />
    </div>
  );
};

export default MapView;
