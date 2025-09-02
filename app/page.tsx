"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import ThemeToggle from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RouteNavigator from "@/components/route-navigator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Github, Rocket } from "lucide-react";

type Stand = {
  name: string;
  path: string; // e.g. /data/idukki/checkpost.md
};

type District = {
  name: string;
  stands: Stand[];
};

type Manifest = {
  districts: District[];
};

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch ${url}`);
    return r.json();
  });

const mdFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.text();
};

function formatCompact(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "";
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function GitHubStarButton({
  variant = "outline",
  fullWidth = false,
  className,
}: {
  variant?: string;
  fullWidth?: boolean;
  className?: string;
}) {
  const { data } = useSWR(
    "https://api.github.com/repos/sudosuanjal/allkeralabustiming-app",
    (u: string) => fetch(u).then((r) => r.json()),
    { revalidateOnFocus: false, refreshInterval: 10 * 60 * 1000 }
  );
  const stars = (data?.stargazers_count as number | undefined) ?? undefined;
  return (
    <Button
      asChild
      variant={variant as any}
      size="sm"
      className={cn(fullWidth && "w-full justify-start", className)}
    >
      <a
        href="https://github.com/sudosuanjal/allkeralabustiming-app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Star the GitHub repository"
      >
        <Github className="mr-1 h-4 w-4" />
        Star{stars !== undefined ? ` ${formatCompact(stars)}` : ""}
      </a>
    </Button>
  );
}

function ProductHuntButton({
  variant = "outline",
  fullWidth = false,
  className,
}: {
  variant?: string;
  fullWidth?: boolean;
  className?: string;
}) {
  const upvotesEnv =
    typeof process !== "undefined"
      ? (process.env.NEXT_PUBLIC_PH_UPVOTES as string | undefined)
      : undefined;
  const upvotes = upvotesEnv ? Number(upvotesEnv) : undefined;
  const label = upvotes ? formatCompact(upvotes) : "Soon";
  return (
    <Button
      asChild
      variant={variant as any}
      size="sm"
      className={cn(fullWidth && "w-full justify-start", className)}
    >
      <a
        href="https://www.producthunt.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Product Hunt upvotes"
      >
        <Rocket className="mr-1 h-4 w-4" />
        PH {label}
      </a>
    </Button>
  );
}

export default function HomePage() {
  const {
    data: manifest,
    isLoading,
    error,
  } = useSWR<Manifest>("/data/manifest.json", fetcher);
  const [district, setDistrict] = useState<string>("");
  const [stand, setStand] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [standOpen, setStandOpen] = useState(false);
  const [standFocused, setStandFocused] = useState(false);

  const selectedDistrict = useMemo(() => {
    if (!manifest) return undefined;
    return manifest.districts.find((d) => d.name === district);
  }, [manifest, district]);

  const filteredStands = useMemo(() => {
    if (!selectedDistrict) return [];
    const q = query.trim().toLowerCase();
    const base = selectedDistrict.stands;
    if (!q) return base;
    return base.filter((s) => s.name.toLowerCase().includes(q));
  }, [selectedDistrict, query]);

  const selectedStand = useMemo(() => {
    if (!selectedDistrict) return undefined;
    return selectedDistrict.stands.find((s) => s.name === stand);
  }, [selectedDistrict, stand]);

  useEffect(() => {
    if (!district && standOpen) setStandOpen(false);
  }, [district]);

  const { data: md, isLoading: mdLoading } = useSWR(
    () => (selectedStand?.path ? selectedStand.path : null),
    mdFetcher
  );

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Project logo on desktop, keep text on mobile for space */}
            <a
              href="/"
              className="flex items-center font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              <img
                src="/images/logo.png"
                alt="All Kerala Bus Timings logo"
                className="mr-2 hidden h-10 w-auto md:h-10 sm:block rounded-lg"
              />
              <span className="inline sm:sr-only">allkeralabustimings</span>
            </a>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/generator" aria-label="Open Markdown Generator">
                <Button variant="outline" size="sm">
                  .md Generator
                </Button>
              </Link>
              <GitHubStarButton />
              <ProductHuntButton />
              {/* Add subtle padding/border so ThemeToggle isn't tight to the edge */}
              <div className="ml-1 sm:ml-2 rounded-md border p-1">
                <ThemeToggle />
              </div>
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
                    <Link
                      href="/generator"
                      aria-label="Open Markdown Generator"
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        .md Generator
                      </Button>
                    </Link>
                    <GitHubStarButton variant="ghost" fullWidth />
                    <ProductHuntButton variant="ghost" fullWidth />
                    <div className="border-t my-2" />
                    <div className="rounded-md border p-2 w-fit">
                      <ThemeToggle />
                    </div>
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
              <CardTitle className="text-balance text-xl">
                Find Bus Timings
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a district, pick a bus stand, then view live
                Markdown-rendered timings below.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={district}
                    onValueChange={(v) => {
                      setDistrict(v);
                      setStand("");
                      setQuery("");
                    }}
                  >
                    <SelectTrigger id="district" aria-label="Select district">
                      <SelectValue
                        placeholder={
                          isLoading ? "Loading…" : "Choose a district"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {error && (
                        <div className="px-2 py-1.5 text-sm text-destructive">
                          Failed to load
                        </div>
                      )}
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
                    <div className="relative">
                      <Input
                        id="stand"
                        placeholder={
                          district
                            ? "Search bus stand…"
                            : "Select a district first"
                        }
                        disabled={!district}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => district && setStandFocused(true)}
                        onBlur={() => {
                          setTimeout(() => setStandFocused(false), 100);
                        }}
                        aria-autocomplete="list"
                        aria-expanded={Boolean(district && standFocused)}
                        aria-controls="stand-results"
                      />
                      {district && standFocused && (
                        <div
                          id="stand-results"
                          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-md border bg-background shadow-md"
                          role="listbox"
                          aria-label="Filtered bus stands"
                        >
                          {filteredStands.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              No stands found
                            </div>
                          ) : (
                            filteredStands.slice(0, 50).map((s) => (
                              <button
                                key={s.name}
                                type="button"
                                role="option"
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted focus:bg-muted"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setStand(s.name);
                                  setQuery("");
                                  setStandFocused(false);
                                }}
                              >
                                {s.name}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    <Select
                      value={stand}
                      onValueChange={(v) => {
                        setStand(v);
                        setStandOpen(false);
                      }}
                      disabled={!district}
                      open={standOpen}
                      onOpenChange={setStandOpen}
                    >
                      <SelectTrigger aria-label="Select bus stand">
                        <SelectValue
                          placeholder={district ? "Choose a bus stand" : "—"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStands.length === 0 && (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No stands found
                          </div>
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
            <RouteNavigator enableFilter className="shadow-sm z-40" />
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
              "prose-a:text-primary hover:prose-a:underline"
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
                  Create a new folder under{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    public/data
                  </code>{" "}
                  with the district name. Example:{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    public/data/idukki
                  </code>
                </li>
                <li>
                  Add a Markdown file per bus stand inside that district.
                  Example:{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    public/data/idukki/checkpost.md
                  </code>
                </li>
                <li>
                  Use GitHub to commit your files. Keep tables in standard
                  Markdown. We support GFM for tables.
                </li>
                <li>
                  Update the manifest automatically by running the script in{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    /scripts/generate-manifest.ts
                  </code>
                  , or manually edit{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    public/data/manifest.json
                  </code>
                  .
                  <div className="mt-2 rounded border bg-primary p-3 text-primary-foreground">
                    Tip: In v0, you can run the script from the scripts panel;
                    otherwise, contributors can run it locally before opening a
                    PR.
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
                  <Link
                    href="/generator"
                    className="text-primary underline-offset-4 hover:underline"
                  >
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
  );
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
        thead: (props) => (
          <thead className="bg-muted-foreground text-foreground" {...props} />
        ),
        th: (props) => <th className="px-3 py-2 font-semibold" {...props} />,
        td: (props) => (
          <td className="px-3 py-2 align-top text-foreground" {...props} />
        ),
        h1: (props) => (
          <h1 className="mt-6 scroll-mt-24 text-2xl font-semibold" {...props} />
        ),
        h2: (props) => (
          <h2 className="mt-5 scroll-mt-24 text-xl font-semibold" {...props} />
        ),
        p: (props) => <p className="my-3 leading-6" {...props} />,
        code: ({ inline, ...props }) =>
          inline ? (
            <code className="rounded bg-muted px-1 py-0.5" {...props} />
          ) : (
            <code
              className="block overflow-x-auto rounded bg-muted p-3 text-foreground"
              {...props}
            />
          ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
