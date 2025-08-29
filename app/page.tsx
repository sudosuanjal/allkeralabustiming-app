"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Reveal from "@/components/reveal"
import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import RouteNavigator from "@/components/route-navigator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type Stand = {
  name: string
  path: string // e.g. /data/idukki/checkpost.md
}

type District = {
  name: string
  stands: Stand[]
}

type Manifest = {
  districts: District[]
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch ${url}`)
    return r.json()
  })

const mdFetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  return res.text()
}

export default function HomePage() {
  const { data: manifest, isLoading, error } = useSWR<Manifest>("/data/manifest.json", fetcher)
  const [district, setDistrict] = useState<string>("")
  const [stand, setStand] = useState<string>("")
  const [query, setQuery] = useState<string>("")

  const selectedDistrict = useMemo(() => {
    if (!manifest) return undefined
    return manifest.districts.find((d) => d.name === district)
  }, [manifest, district])

  const filteredStands = useMemo(() => {
    if (!selectedDistrict) return []
    const q = query.trim().toLowerCase()
    const base = selectedDistrict.stands
    if (!q) return base
    return base.filter((s) => s.name.toLowerCase().includes(q))
  }, [selectedDistrict, query])

  const selectedStand = useMemo(() => {
    if (!selectedDistrict) return undefined
    return selectedDistrict.stands.find((s) => s.name === stand)
  }, [selectedDistrict, stand])

  const { data: md, isLoading: mdLoading } = useSWR(() => (selectedStand?.path ? selectedStand.path : null), mdFetcher)

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
              allkeralabustimings
            </a>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/generator" aria-label="Open Markdown Generator">
                <Button variant="outline" size="sm">
                  .md Generator
                </Button>
              </Link>
              <span className="hidden md:inline text-xs text-muted-foreground">Open-source • Kerala Bus Timings</span>
              <ThemeToggle />
            </div>

            {/* Mobile menu */}
            <div className="sm:hidden">
              <Sheet>
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
                    <Link href="/generator" aria-label="Open Markdown Generator">
                      <Button variant="ghost" className="w-full justify-start">
                        .md Generator
                      </Button>
                    </Link>
                    <div className="border-t my-2" />
                    <ThemeToggle />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Search Panel */}
      <section className="mx-auto w-full max-w-3xl px-4 py-6">
        <Reveal as="div" delay={50}>
          <Card className="border-blue-100 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-balance text-xl">Find Bus Timings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a district, pick a bus stand, then view live Markdown-rendered timings below.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={district}
                    onValueChange={(v) => {
                      setDistrict(v)
                      setStand("")
                      setQuery("")
                    }}
                  >
                    <SelectTrigger id="district" aria-label="Select district">
                      <SelectValue placeholder={isLoading ? "Loading…" : "Choose a district"} />
                    </SelectTrigger>
                    <SelectContent>
                      {error && <div className="px-2 py-1.5 text-sm text-destructive">Failed to load</div>}
                      {manifest?.districts.map((d) => (
                        <SelectItem key={d.name} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stand">Bus Stand</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="stand"
                      placeholder={district ? "Search bus stand…" : "Select a district first"}
                      disabled={!district}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Select value={stand} onValueChange={(v) => setStand(v)} disabled={!district}>
                      <SelectTrigger aria-label="Select bus stand">
                        <SelectValue placeholder={district ? "Choose a bus stand" : "—"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStands.length === 0 && (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">No stands found</div>
                        )}
                        {filteredStands.map((s) => (
                          <SelectItem key={s.name} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </section>

      {/* Markdown Render */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-10">
        {mdLoading && selectedStand && (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2 animate-pulse" />
            <Skeleton className="h-4 w-2/3 animate-pulse" />
            <Skeleton className="h-48 w-full animate-pulse" />
          </div>
        )}

        {!selectedStand && (
          <p className="text-sm text-muted-foreground animate-in fade-in-0 duration-300">
            Select a district and bus stand to view timings.
          </p>
        )}

        {md && selectedStand && (
          <div className="mb-4">
            <RouteNavigator enableFilter className="shadow-sm" />
          </div>
        )}

        {md && selectedStand && (
          <Reveal
            as="article"
            id="md-viewer"
            delay={75}
            className={cn(
              "prose prose-sm max-w-none",
              "prose-headings:scroll-mt-24 prose-headings:text-foreground",
              "prose-p:text-foreground prose-strong:text-foreground",
              "prose-a:text-primary hover:prose-a:underline",
            )}
          >
            <MarkdownContent markdown={md} />
          </Reveal>
        )}
      </section>

      {/* Contribute Section */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-16">
        <Reveal delay={120}>
          <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">How to Contribute</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground">
              <ol className="list-inside list-decimal space-y-2">
                <li>
                  Create a new folder under <code className="rounded bg-muted px-1 py-0.5 text-xs">public/data</code>{" "}
                  with the district name. Example:{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">public/data/idukki</code>
                </li>
                <li>
                  Add a Markdown file per bus stand inside that district. Example:{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">public/data/idukki/checkpost.md</code>
                </li>
                <li>Use GitHub to commit your files. Keep tables in standard Markdown. We support GFM for tables.</li>
                <li>
                  Update the manifest automatically by running the script in{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">/scripts/generate-manifest.ts</code>, or
                  manually edit <code className="rounded bg-muted px-1 py-0.5 text-xs">public/data/manifest.json</code>.
                  <div className="mt-2 rounded border bg-primary p-3 text-primary-foreground">
                    Tip: In v0, you can run the script from the scripts panel; otherwise, contributors can run it
                    locally before opening a PR.
                  </div>
                </li>
              </ol>
              <div className="mt-4">
                <p className="font-medium">Markdown Template</p>
                <pre className="mt-1 overflow-x-auto rounded bg-muted p-3 text-foreground">
                  <code>{`# {Bus Stand Name} Bus Timings

## {Route Title}
| Time   | Bus            |
|--------|----------------|
| 06:00 AM | KSRTC        |
| 06:30 AM | Example Bus  |`}</code>
                </pre>
                <p className="mt-2 text-sm text-muted-foreground">
                  Prefer a form? Use the{" "}
                  <Link href="/generator" className="text-primary underline-offset-4 hover:underline">
                    Markdown Generator
                  </Link>{" "}
                  to create and download the file.
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </section>
    </main>
  )
}

function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ node, ...props }) => (
          <div className="my-4 overflow-x-auto rounded border">
            <table className="w-full text-left text-sm" {...props} />
          </div>
        ),
        thead: (props) => <thead className="bg-muted-foreground text-foreground" {...props} />,
        th: (props) => <th className="px-3 py-2 font-semibold" {...props} />,
        td: (props) => <td className="px-3 py-2 align-top text-foreground" {...props} />,
        h1: (props) => <h1 className="mt-6 scroll-mt-24 text-2xl font-semibold" {...props} />,
        h2: (props) => <h2 className="mt-5 scroll-mt-24 text-xl font-semibold" {...props} />,
        p: (props) => <p className="my-3 leading-6" {...props} />,
        code: ({ inline, ...props }) =>
          inline ? (
            <code className="rounded bg-muted px-1 py-0.5" {...props} />
          ) : (
            <code className="block overflow-x-auto rounded bg-muted p-3 text-foreground" {...props} />
          ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}
