import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import { DeckProvider } from "@/lib/store.tsx";
import { Toaster } from "@/components/ui/toaster";

const root = document.getElementById("root")!;
createRoot(root).render(
  <React.StrictMode>
    <DeckProvider>
      <BrowserRouter>
        <Toaster />
        <App />
      </BrowserRouter>
    </DeckProvider>
  </React.StrictMode>,
);
