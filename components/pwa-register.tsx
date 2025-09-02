"use client"

import { useEffect } from "react"

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    const register = async () => {
      try {
        // Ensure secure context and delay until page is fully loaded
        await new Promise((r) => window.addEventListener("load", r, { once: true }))
        await navigator.serviceWorker.register("/sw.js")
      } catch (_e) {
        // Silently ignore in preview; avoid console noise
      }
    }
    register()
  }, [])
  return null
}
