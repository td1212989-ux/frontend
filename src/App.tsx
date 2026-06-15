import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/index";

import Upload from "./pages/upload";

import History from "./pages/history";

import Analytics from "./pages/analytics";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/upload"
        element={<Upload />}
      />

      <Route
        path="/history"
        element={<History />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}