# Contributing to allkeralabustimings

Thank you for helping Kerala commuters! This project intentionally avoids any database — all bus timings live in Markdown files in `public/data`.

## How to add or update timings

1. Create a new district folder (if it doesn’t exist) under:
   - `public/data/{district}`  
     Example: `public/data/idukki`

2. Add a Markdown file for each bus stand:
   - `public/data/{district}/{stand}.md`  
     Example: `public/data/idukki/checkpost.md`

3. Use GFM tables. Example template:

\`\`\`markdown
# {Bus Stand Name} Bus Timings

## {Route Title}
| Time     | Bus                      |
|----------|--------------------------|
| 06:00 AM | KSRTC                    |
| 06:30 AM | Example Bus              |

## {Another Route Title}
| Time     | Bus                      |
|----------|--------------------------|
| 07:10 AM | KSRTC (NILAMBUR)         |
| 08:20 AM | HOLY FAMILY (KANNUR)     |
\`\`\`

4. Update the manifest used by the app:
   - Preferred: run the script `scripts/generate-manifest.ts` to auto-scan the folders and produce `public/data/manifest.json`.
   - Alternative: manually update `public/data/manifest.json` with the district and stand entries:

\`\`\`json
{
  "districts": [
    {
      "name": "idukki",
      "stands": [{ "name": "checkpost", "path": "/data/idukki/checkpost.md" }]
    }
  ]
}
\`\`\`

## Naming

- Use lowercase, hyphen-less folder/filenames where possible (e.g., `kozhikode`, `nit.md`).
- Display names are derived from filenames by the app; keep them clean and simple.

## Testing your changes

- In the v0 preview, select your district and bus stand. Your new Markdown table should render below the search panel.
- Tables are responsive and scrollable on mobile.

## Code of Conduct

Be respectful and constructive. Follow the project’s simple goals: accuracy, clarity, and accessibility.

Thanks for contributing!
