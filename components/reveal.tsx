"use client"

import type React from "react"
import { createElement, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type RevealProps<E extends React.ElementType = "div"> = {
  as?: E
  children: React.ReactNode
  className?: string
  /**
   * Intersection observer rootMargin offset like "0px 0px -10% 0px".
   * Use negative bottom margin to trigger slightly before fully in view.
   */
  margin?: string
  /** Delay in ms before applying visible styles */
  delay?: number
  /** Animate only the first time it comes into view */
  once?: boolean
}

export function Reveal<E extends React.ElementType = "div">({
  as,
  children,
  className,
  margin = "0px 0px -10% 0px",
  delay = 0,
  once = true,
  ...rest
}: RevealProps<E> & Omit<React.ComponentPropsWithoutRef<E>, keyof RevealProps>) {
  const Tag = (as || "div") as E
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current as Element | null
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delay > 0) {
              const id = setTimeout(() => setVisible(true), delay)
              if (!once) return () => clearTimeout(id)
            } else {
              setVisible(true)
            }
            if (once) obs.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { rootMargin: margin },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [delay, margin, once])

  return createElement(
    Tag,
    {
      ref: ref as any,
      className: cn(
        "transition-all duration-700 ease-out",
        "opacity-0 translate-y-2",
        visible && "opacity-100 translate-y-0",
        "motion-reduce:transition-none motion-reduce:transform-none",
        className,
      ),
      ...rest,
    },
    children,
  )
}

export default Reveal
