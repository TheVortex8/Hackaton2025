/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MAPBOX: string;
    // Add other environment variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }