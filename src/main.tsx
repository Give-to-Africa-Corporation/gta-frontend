import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { GlobalImageFallbacks } from "./components/ui/fallback-image.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <Toaster richColors closeButton position="top-right" />
      <GlobalImageFallbacks />
      <App />
    </AppProvider>
  </React.StrictMode>
);
