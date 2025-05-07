"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * Hook to check if inspect mode is active via the inspect=true query parameter
 * Only returns true in development mode
 */
export function useInspectMode() {
  const searchParams = useSearchParams()
  const [isInspectMode, setIsInspectMode] = useState(false)
  
  useEffect(() => {
    const inspect = searchParams?.get("inspect")
    setIsInspectMode(inspect === "true")
  }, [searchParams])
  
  // Only enable in development mode
  return process.env.NODE_ENV === "development" && isInspectMode
} 