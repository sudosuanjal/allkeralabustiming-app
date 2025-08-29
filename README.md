# allkeralabustimings

A single-page, open-source web app to quickly check Kerala bus timings by district and bus stand.  
Data is stored as Markdown files (no database). The app fetches and renders those Markdown tables.

- Framework: Next.js (App Router), mobile-first UI
- Data: public/data/{district}/{stand}.md
- Rendering: React Markdown with GFM tables
- Search flow: Select district → search/select bus stand → timings render below

## Quick Start

1. Add or edit Markdown files under `public/data`. Example:
   - `public/data/idukki/checkpost.md`
   - `public/data/kozhikode/nit.md`

2. Rebuild the manifest:
   - Preferred: run the script `scripts/generate-manifest.ts` (v0 supports running scripts directly)
   - Or manually update `public/data/manifest.json`

3. Preview/Publish from the v0 UI. No backend required.

## Folder Structure

\`\`\`
public/
  data/
    idukki/
      checkpost.md
    kozhikode/
      nit.md
    pathanamthitta/
      athikayam.md
    manifest.json   <-- generated file used by the UI
scripts/
  generate-manifest.ts
\`\`\`

## Markdown Guidelines

- Use standard GitHub-Flavored Markdown (GFM) tables.
- Example:

\`\`\`markdown
# {Bus Stand Name} Bus Timings

## {Route Title}
| Time     | Bus            |
|----------|----------------|
| 06:00 AM | KSRTC          |
| 06:30 AM | Example Bus    |
\`\`\`

See `CONTRIBUTING.md` for detailed steps.

## Tech Notes

- UI uses shadcn/ui components included with the starter.
- Data fetching uses SWR (client-side) and static assets from `public/data`.
- Dependencies like `react-markdown` and `remark-gfm` are inferred automatically in the v0 environment.

## License

MIT — Contributions welcome!
