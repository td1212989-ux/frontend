import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "sonner";

import App from "./App";

import "./styles.css";

// ======================
// QUERY CLIENT
// ======================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ======================
// APP RENDER
// ======================

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />

        <Toaster
          position="top-right"
          richColors
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);