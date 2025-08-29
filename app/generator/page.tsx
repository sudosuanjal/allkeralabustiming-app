import type { Metadata } from "next"
import MdGenerator from "@/components/md-generator"

export const metadata: Metadata = {
  title: "Markdown Generator",
  description: "Create .md bus timings files from a simple form with multiple routes and timings.",
}

export default function GeneratorPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <MdGenerator />
    </main>
  )
}
