"use client"

import { Inspector } from "react-dev-inspector"
import { useInspectMode } from "@lib/hooks/use-inspect-mode"
import { useEffect, useState } from "react"

export function DevInspector() {
  const isInspectMode = useInspectMode()
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    // Detect if user is on macOS
    if (typeof navigator !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }
  }, [])

  useEffect(() => {
    if (isInspectMode) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        try {
          // Create the keyboard event based on OS platform
          const event = new KeyboardEvent('keydown', {
            key: 'c',
            code: 'KeyC',
            ctrlKey: !isMac,         // ctrl on Windows/Linux
            metaKey: isMac,          // cmd on Mac
            shiftKey: true,
            bubbles: true
          })
          document.dispatchEvent(event)
        } catch (error) {
          console.error('Failed to auto-trigger inspector:', error)
        }
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [isInspectMode, isMac])

  if (!isInspectMode) {
    return null
  }

  return (
    <Inspector 
      keys={isMac ? ["meta", "shift", "c"] : ["control", "shift", "c"]}
      disableLaunchEditor={false}
    />
  )
} 