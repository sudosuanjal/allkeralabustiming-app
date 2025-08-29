"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Timing = { id: string; time: string; bus: string }
type Route = { id: string; title: string; timings: Timing[] }

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

function toFileName(standName: string) {
  return (
    standName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "bus-stand"
  )
}

function buildMarkdown(standName: string, routes: Route[]) {
  const header = `# ${standName.trim() || "Bus Stand"} Bus Timings`
  const sections = routes
    .filter((r) => r.title.trim() || r.timings.some((t) => t.time.trim() || t.bus.trim()))
    .map((r) => {
      const title = r.title.trim() || "Route"
      const rows = r.timings
        .filter((t) => t.time.trim() || t.bus.trim())
        .map((t) => `| ${t.time.trim() || "-"} | ${t.bus.trim() || "-"} |`)
      const table = ["| Time   | Bus     |", "|--------|---------|", rows.length ? rows.join("\n") : "| - | - |"].join(
        "\n",
      )
      return `## ${title}\n${table}`
    })
  return [header, ...sections].join("\n\n")
}

export default function MdGenerator() {
  const [standName, setStandName] = useState("")
  const [routes, setRoutes] = useState<Route[]>([
    { id: uid("route"), title: "", timings: [{ id: uid("tm"), time: "", bus: "" }] },
  ])
  const [notes, setNotes] = useState("")

  const markdown = useMemo(() => {
    const md = buildMarkdown(standName, routes)
    return notes.trim() ? `${md}\n\n Notes \n${notes.trim()}\n` : md
  }, [standName, routes, notes])

  const canDownload =
    standName.trim().length > 0 && routes.some((r) => r.title.trim() || r.timings.some((t) => t.time || t.bus))

  function addRoute() {
    setRoutes((prev) => [...prev, { id: uid("route"), title: "", timings: [{ id: uid("tm"), time: "", bus: "" }] }])
  }
  function removeRoute(id: string) {
    setRoutes((prev) => prev.filter((r) => r.id !== id))
  }
  function updateRouteTitle(id: string, title: string) {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, title } : r)))
  }
  function addTiming(routeId: string) {
    setRoutes((prev) =>
      prev.map((r) => (r.id === routeId ? { ...r, timings: [...r.timings, { id: uid("tm"), time: "", bus: "" }] } : r)),
    )
  }
  function removeTiming(routeId: string, timingId: string) {
    setRoutes((prev) =>
      prev.map((r) => (r.id === routeId ? { ...r, timings: r.timings.filter((t) => t.id !== timingId) } : r)),
    )
  }
  function updateTiming(routeId: string, timingId: string, key: "time" | "bus", val: string) {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === routeId ? { ...r, timings: r.timings.map((t) => (t.id === timingId ? { ...t, [key]: val } : t)) } : r,
      ),
    )
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${toFileName(standName)}.md`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 500)
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-balance text-2xl font-semibold">Markdown Generator</h1>
        <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
          Back to search
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="stand">Bus Stand Name</Label>
              <Input
                id="stand"
                placeholder="e.g., Athikayam"
                value={standName}
                onChange={(e) => setStandName(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Routes</p>
                <Button type="button" onClick={addRoute} variant="outline" size="sm">
                  Add Route
                </Button>
              </div>

              <div className="space-y-4">
                {routes.map((route, rIdx) => (
                  <div key={route.id} className="rounded-md border p-3">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor={`route-${route.id}`}>Route Title</Label>
                        <Input
                          id={`route-${route.id}`}
                          placeholder={rIdx % 2 === 0 ? "Athikayam → Pathanamthitta" : "Pathanamthitta → Athikayam"}
                          value={route.title}
                          onChange={(e) => updateRouteTitle(route.id, e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeRoute(route.id)}
                        className="mt-6"
                        disabled={routes.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Timings</p>
                        <Button type="button" onClick={() => addTiming(route.id)} variant="secondary" size="sm">
                          Add Row
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
                        {route.timings.map((t) => (
                          <div key={t.id} className="contents md:contents">
                            <Input
                              placeholder="06:15 AM"
                              value={t.time}
                              onChange={(e) => updateTiming(route.id, t.id, "time", e.target.value)}
                              aria-label="Time"
                            />
                            <Input
                              placeholder="KSRTC / Local / Bus Name"
                              value={t.bus}
                              onChange={(e) => updateTiming(route.id, t.id, "bus", e.target.value)}
                              aria-label="Bus"
                            />
                            <div className="flex md:justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeTiming(route.id, t.id)}
                                disabled={route.timings.length <= 1}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label htmlFor="notes">Optional Notes (won’t affect tables)</Label>
              <Textarea
                id="notes"
                placeholder="Any extra notes or references..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="button" onClick={download} disabled={!canDownload}>
                Download .md
              </Button>
              <span className="text-xs text-muted-foreground">File name will be {toFileName(standName)}.md</span>
            </div>
          </CardContent>
        </Card>

        {/* Right: Live Markdown Preview */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "prose prose-sm max-w-none",
                "prose-headings:scroll-mt-24 prose-headings:text-foreground",
                "prose-p:text-foreground prose-strong:text-foreground",
                "prose-a:text-primary hover:prose-a:underline",
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              After downloading, place the file into public/data/&lt;district&gt;/ and run scripts/generate-manifest.ts.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
