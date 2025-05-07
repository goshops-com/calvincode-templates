"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useInspectMode } from "@lib/hooks/use-inspect-mode"
import { useEffect, useState } from "react"

export function InspectModeIndicator() {
  const isInspectMode = useInspectMode()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    // Detect if user is on macOS
    if (typeof navigator !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }
  }, [])

  if (!isInspectMode) {
    return null
  }

  const handleDisable = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("inspect")
    router.push(`${pathname}?${params.toString()}`)
  }

  const shortcutText = isMac ? "⌘+⇧+C" : "Ctrl+Shift+C"

  return (
    <div 
      className="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-lg z-50 flex items-center gap-2"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="8" />
      </svg>
      <span>Inspect Mode</span>
      <span className="text-xs">({shortcutText})</span>
      <button 
        onClick={handleDisable}
        className="ml-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 text-xs"
      >
        Disable
      </button>
    </div>
  )
} 