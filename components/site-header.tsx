"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import * as React from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/generator", label: "Generator" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-foreground">
          All Kerala Bus Timings
          <span className="sr-only">Go to homepage</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-4 sm:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname === l.href && "text-foreground font-medium",
              )}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Nav */}
        <div className="sm:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Open menu">
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-2">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded px-2 py-2 text-sm",
                      pathname === l.href ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="mt-2">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
