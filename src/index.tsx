import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { SpotifyDataProvider, SpotifyAuthProvider } from "./lib";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <SpotifyAuthProvider>
      <SpotifyDataProvider>
        <App />
      </SpotifyDataProvider>
    </SpotifyAuthProvider>
  </React.StrictMode>
);
