// src/components/Loader.tsx
import React from "react"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  show: boolean
  text?: string
}

export function Loader({ show, text = "Processing..." }: LoaderProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
        <p className="mt-2 text-white">{text}</p>
      </div>
    </div>
  )
}
