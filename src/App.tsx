// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Toaster } from "sonner";

export function App() {
  return (
    <Router>
      <Toaster position="top-right" theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
