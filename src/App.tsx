// src/App.tsx

import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { Leaderboard } from "./pages/Leaderboard"
// If you have a separate Results component:
import { Results } from "./pages/Results"

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* Possibly both a direct /results and a param-based /results/:transaction_id */}
        <Route path="/results" element={<Results />} />
        <Route path="/results/:transaction_id" element={<Results />} />
      </Routes>
    </Router>
  )
}
