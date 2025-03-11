// src/components/Layout.tsx
import React, { PropsWithChildren, useState } from "react"
import { Link } from "react-router-dom"
import { Toaster } from "sonner"
import { Header } from "./Header"

// shadcn/ui Tooltip
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"

// Import only the icons we need:
import { Home as HomeIcon, List, Brain, Settings } from "lucide-react"

// Redux
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../app/store"
import { toggleAiMode } from "../features/settingsSlice"

// The new SettingsModal
import { SettingsModal } from "./SettingsModal"

/**
 * An IDE-like layout with:
 *   - <Header> top bar
 *   - A sidebar on the left (with Home, Leaderboard, AI toggle, Settings)
 *   - The main content area
 *   - A bottom status bar (footer)
 *   - <Toaster /> from Sonner for toast messages
 */
export function Layout({ children }: PropsWithChildren) {
  // We read aiMode from Redux instead of local state
  const aiMode = useSelector((state: RootState) => state.settings.aiMode)
  const dispatch = useDispatch<AppDispatch>()

  // For showing/hiding the Settings modal
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen flex-col bg-black text-white">
      {/* Our new top bar */}
      <Header />

      {/* Middle section: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (left) */}
        <aside className="flex w-16 flex-col items-center bg-neutral-900 py-4 space-y-4">
          {/* Home button */}
          <SidebarButton
            icon={<HomeIcon className="h-5 w-5" />}
            label="Home"
            link="/"
          />

          {/* Leaderboard button */}
          <SidebarButton
            icon={<List className="h-5 w-5" />}
            label="Leaderboard"
            link="/leaderboard"
          />

          {/* AI Mode toggle */}
          <SidebarButton
            icon={
              aiMode ? (
                <Brain className="h-5 w-5 text-violet-500" />
              ) : (
                <Brain className="h-5 w-5 text-gray-500" />
              )
            }
            label={aiMode ? "AI Mode On" : "AI Mode Off"}
            onClick={() => dispatch(toggleAiMode())}
          />

          {/* Settings icon (opens a modal) */}
          <SidebarButton
            icon={<Settings className="h-5 w-5 text-gray-400" />}
            label="Settings"
            onClick={() => setSettingsOpen(true)}
          />
        </aside>

        {/* Main content area */}
        <main className="relative flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      {/* Footer (bottom bar) */}
      <footer className="flex h-8 items-center justify-between bg-neutral-900 px-4 text-xs text-neutral-400">
        <span>© 2025 L-Store Grader. All rights reserved.</span>
        <span className="italic">
        <a
            href="https://resilientdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="italic hover:underline text-neutral-400"
          >
            Powered by ResilientDB
        </a>
        </span>
      </footer>

      {/* Sonner toaster for any toast messages */}
      <Toaster position="top-right" richColors />

      {/* The new SettingsModal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}

/** Props for a single sidebar button */
interface SidebarButtonProps {
  icon: React.ReactNode
  label: string
  link?: string
  onClick?: () => void
}

/**
 * Sidebar button icon. If `link` is provided, uses <Link>. Otherwise, a <button>.
 * We wrap the content in a shadcn/ui <Tooltip> so the user sees a label on hover.
 */
function SidebarButton({ icon, label, link, onClick }: SidebarButtonProps) {
  const content = link ? (
    <Link
      to={link}
      className="flex h-10 w-10 items-center justify-center rounded hover:bg-neutral-800"
    >
      {icon}
    </Link>
  ) : (
    <button
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded hover:bg-neutral-800"
    >
      {icon}
    </button>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{content}</div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
