"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type * as React from "react"

// Simple inline icons to avoid extra deps
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1.25a1 1 0 1 1 2 0V21a1 1 0 0 1-1 1Zm0-18a1 1 0 0 1-1-1V1.75a1 1 0 1 1 2 0V3a1 1 0 0 1-1 1Zm11 7h-1.25a1 1 0 1 1 0-2H23a1 1 0 1 1 0 2ZM3 12a1 1 0 0 1-1 1H.75a1 1 0 1 1 0-2H2A1 1 0 0 1 3 12Zm16.95 8.364a1 1 0 0 1-1.414 0l-.884-.884a1 1 0 0 1 1.414-1.414l.884.884a1 1 0 0 1 0 1.414Zm-14.486-14.95a1 1 0 0 1-1.414 0l-.884-.884A1 1 0 0 1 3.58 2.73l.884.884a1 1 0 0 1 0 1.414Zm14.486-1.414a1 1 0 0 1 0 1.414l-.884.884a1 1 0 0 1-1.414-1.414l.884-.884a1 1 0 0 1 1.414 0ZM5.464 19.536a1 1 0 0 1-1.414 0l-.884-.884a1 1 0 0 1 1.414-1.414l.884.884a1 1 0 0 1 0 1.414Z"
      />
    </svg>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M21.64 13.64a9 9 0 1 1-11.28-11.28 1 1 0 0 1 1.22 1.22A7 7 0 0 0 20.42 12a1 1 0 0 1 1.22 1.22Z"
      />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          {isDark ? <MoonIcon /> : <SunIcon />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("light")} aria-checked={theme === "light"} role="menuitemradio">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} aria-checked={theme === "dark"} role="menuitemradio">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} aria-checked={theme === "system"} role="menuitemradio">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
