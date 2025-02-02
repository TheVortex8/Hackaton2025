import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapView = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX; // Replace with your token

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11", // Change to other styles if needed
      center: [-71.2082, 46.8139], // Longitude, Latitude for Quebec City
      zoom: 4,
    });

    return () => map.remove();
  }, []);

  return (
    <div className="w-[91vw] border rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="h-[calc(100vh-50px)]" />
    </div>
  );
};

export default MapView;
