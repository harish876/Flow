// src/components/Header.tsx

import React from "react"
import layersIcon from "../assets/layers.png"

/**
 * A simple IDE-like header with a black background,
 * a small logo on the left, and a "Beta Release" badge on the right.
 */
export function Header() {
  return (
    <header className="flex h-12 items-center justify-between bg-violet-700 px-4 shadow-sm">
      {/* Left side: just the logo */}
      <div className="flex items-center gap-2">
        <img
          src={layersIcon}
          alt="L-Store Logo"
          className="h-6 w-6"
        />
      </div>

      {/* Right side: Beta badge */}
      <div className="bg-violet-800 text-xs px-2 py-1 rounded-full text-neutral-200 uppercase tracking-wide">
        Beta Release
      </div>
    </header>
  )
}