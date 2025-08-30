"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

type RouteItem = {
  id: string
  label: string
  el: HTMLElement
}

type Props = {
  // The id of the element that contains the rendered markdown for a stand
  containerId?: string
  // Heading levels to treat as route sections (defaults to h2, falls back to h3)
  headingSelectors?: string[]
  // When true, hides other routes and shows only the selected route
  enableFilter?: boolean
  className?: string
}

/**
 * RouteNavigator
 * - Scans rendered markdown inside containerId and finds headings (h2, fallback h3).
 * - Offers a searchable dropdown to jump to a route and now auto-filters to that route on selection.
 * - Works without changing your markdown structure.
 */
export default function RouteNavigator({
  containerId = "md-viewer",
  headingSelectors = ["h2", "h3"],
  enableFilter = true,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [routes, setRoutes] = React.useState<RouteItem[]>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [filterOn, setFilterOn] = React.useState<boolean>(false)

  // Use a stable string key instead of the array identity for dependencies
  const selectorKey = headingSelectors.join(",")

  // Keep latest filter state in refs to avoid re-creating observers
  const filterOnRef = React.useRef(filterOn)
  const selectedIdRef = React.useRef<string | null>(selectedId)
  React.useEffect(() => {
    filterOnRef.current = filterOn
  }, [filterOn])
  React.useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  // Build route list whenever markdown content changes
  React.useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    const collectRoutes = () => {
      let headings = container.querySelectorAll<HTMLElement>(selectorKey)
      // prefer h2 if present; else use provided selectors (h3 fallback)
      const h2s = container.querySelectorAll<HTMLElement>("h2")
      if (h2s.length > 0) headings = h2s

      const list: RouteItem[] = []
      headings.forEach((h, idx) => {
        const text = (h.textContent || `Route ${idx + 1}`).trim()
        const id = h.id || slugify(text)
        if (!h.id) h.id = id
        list.push({ id, label: text, el: h })
      })

      setRoutes((prev) => {
        if (prev.length === list.length && prev.every((p, i) => p.id === list[i]?.id && p.label === list[i]?.label)) {
          return prev
        }
        return list
      })
    }

    collectRoutes()

    // Watch for changes in the container (markdown re-render)
    const mo = new MutationObserver(() => {
      collectRoutes()
      // Re-apply filter if needed after DOM changes without re-creating the effect
      if (filterOnRef.current && selectedIdRef.current) {
        applyFilter(container, headingSelectors, selectedIdRef.current)
      }
    })
    mo.observe(container, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [containerId, selectorKey])

  // Apply or clear filtering when state changes
  React.useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return
    if (!enableFilter) return

    if (filterOn && selectedId) {
      applyFilter(container, headingSelectors, selectedId)
    } else {
      clearFilter(container)
    }
  }, [filterOn, selectedId, containerId, selectorKey, enableFilter])

  const onSelect = (id: string) => {
    setSelectedId(id)
    if (enableFilter) setFilterOn(true)
    setOpen(false)

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const target = routes.find((r) => r.id === id)?.el
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      })
    }
  }

  const onClear = () => {
    setSelectedId(null)
    setFilterOn(false)
    const container = document.getElementById(containerId)
    if (container) clearFilter(container)
  }

  return (
    <div
      className={cn(
        "w-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-md p-2 md:p-3",
        "sticky top-16 md:top-20 z-20",
        className,
      )}
      aria-label="Route navigation"
    >
      <div className="flex flex-col md:flex-row items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between w-full md:w-auto bg-transparent">
              <span className="truncate max-w-[14rem]">
                {selectedId
                  ? routes.find((r) => r.id === selectedId)?.label || "Select route"
                  : routes.length > 0
                    ? "Select route"
                    : "No routes found"}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[280px]" align="start">
            <Command>
              <CommandInput placeholder="Search routes..." />
              <CommandList>
                <CommandEmpty>No routes found.</CommandEmpty>
                <CommandGroup heading="Routes">
                  {routes.map((r) => (
                    <CommandItem key={r.id} value={r.label} onSelect={() => onSelect(r.id)}>
                      {r.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div>
          {/* Removed manual filter toggle button; selection now auto-filters */}
          <Button
            type="button"
            variant="ghost"
            onClick={onClear}
            className="ml-auto"
            aria-label="Clear selection and filter"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

function clearFilter(container: HTMLElement) {
  // Unhide everything we might have hidden
  container.querySelectorAll<HTMLElement>("[data-hidden-by-filter='true']").forEach((el) => {
    el.style.display = ""
    el.removeAttribute("data-hidden-by-filter")
  })
}

function applyFilter(container: HTMLElement, headingSelectors: string[], selectedId: string) {
  clearFilter(container)

  // Build a list of heading nodes in order
  let headings = Array.from(container.querySelectorAll<HTMLElement>(headingSelectors.join(",")))
  const h2s = Array.from(container.querySelectorAll<HTMLElement>("h2"))
  if (h2s.length > 0) headings = h2s

  if (headings.length === 0) return

  // Determine sections as [startHeading, ... content until next heading)
  const sections = headings.map((h, idx) => {
    const next = headings[idx + 1]
    const nodes: HTMLElement[] = [h]
    let cursor = h.nextElementSibling as HTMLElement | null
    while (cursor && cursor !== next) {
      nodes.push(cursor)
      cursor = cursor.nextElementSibling as HTMLElement | null
    }
    return { id: h.id, nodes }
  })

  // Hide all sections except the selected one
  for (const section of sections) {
    if (section.id !== selectedId) {
      for (const node of section.nodes) {
        node.setAttribute("data-hidden-by-filter", "true")
        node.style.display = "none"
      }
    }
  }
}
