// src/components/Header.tsx

import React from "react";
import { Wrench } from "lucide-react";
import flowIcon from "../assets/flow.svg";

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
          src={flowIcon}
          alt="ResilientDB Flow Logo"
          className="h-10 w-10 text-white"
        />
      </div>

      {/* Right side: Construction badge */}
      <div className="flex items-center gap-2 bg-violet-800 text-xs px-3 py-1.5 rounded-full text-neutral-200 uppercase tracking-wide">
        <Wrench className="h-4 w-4" />
        Under Construction
      </div>
    </header>
  );
}
