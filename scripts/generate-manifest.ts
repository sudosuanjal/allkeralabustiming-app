// Usage in v0: run this script to rebuild the manifest after adding .md files.
// It scans public/data/{district}/*.md and writes public/data/manifest.json

import { promises as fs } from "node:fs"
import path from "node:path"

type Stand = { name: string; path: string }
type District = { name: string; stands: Stand[] }
type Manifest = { districts: District[] }

async function main() {
  const publicDir = path.resolve("public")
  const dataDir = path.join(publicDir, "data")

  // Ensure data dir exists
  try {
    await fs.access(dataDir)
  } catch {
    console.error("[generate-manifest] data dir not found at", dataDir)
    process.exit(1)
  }

  const districtNames = (await fs.readdir(dataDir, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b))

  const districts: District[] = []

  for (const d of districtNames) {
    const distPath = path.join(dataDir, d)
    const files = (await fs.readdir(distPath, { withFileTypes: true }))
      .filter((f) => f.isFile() && f.name.toLowerCase().endsWith(".md"))
      .map((f) => f.name)
      .sort((a, b) => a.localeCompare(b))

    const stands: Stand[] = files.map((fname) => {
      const name = fname.replace(/\.md$/i, "")
      return {
        name,
        path: `/data/${d}/${fname}`,
      }
    })

    districts.push({ name: d, stands })
  }

  const manifest: Manifest = { districts }
  const outPath = path.join(dataDir, "manifest.json")
  const json = JSON.stringify(manifest, null, 2)
  await fs.writeFile(outPath, json, "utf-8")
  console.log("[generate-manifest] Wrote", outPath)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
