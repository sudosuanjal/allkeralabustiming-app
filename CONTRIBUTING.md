# Contributing to allkeralabustimings

Thank you for helping Kerala commuters!  
This project intentionally avoids any database — all bus timings live in Markdown files under `public/data`.

---

## 🚀 Getting Started

- Create a branch from the latest `develop` branch with the format:  
  \`\`\`
  issues/{issue#}/{short-name}
  \`\`\`
  Example: `issues/45/add-idukki-checkpost`

---

## 📝 Issue & PR Guidelines

### Creating an Issue

- When opening an issue, **always specify** whether you are:
  - **Adding a new bus stand** (new Markdown file).
  - **Updating an existing bus stand** (editing a Markdown file).

- If possible, **attach a clear photo of the bus stand’s official bus timings** ([example photo](https://drive.google.com/file/d/1-mFF3SPDUwafiV5MHPr6YjiYgrmT_M_t/view?usp=sharing)).  
  This makes it easier for maintainers and reviewers to validate the information.

- Issue Title Pattern:  
  \`\`\`
  [district:stand] Short description
  \`\`\`
  Example: `[idukki:checkpost] Add morning bus timings`

---

### Pull Requests

- **PR Title**:  
  Use a meaningful description with the issue number.  
  Example: `🚌 Add timings for Idukki Checkpost (#45)`

- **Linking Issues**:  
  Mention the issue number in the PR body using closing keywords (e.g., `Closes #45`).  
  Refer: [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)

---

## 📂 Adding or Updating Timings

1. **Create a district folder** (if it doesn’t exist):  
   `public/data/{district}`  
   Example: `public/data/idukki`

2. **Add a Markdown file for each stand**:  
   `public/data/{district}/{stand}.md`  
   Example: `public/data/idukki/checkpost.md`

3. **Use GFM tables** in the following format:

   \`\`\`markdown
   # {Bus Stand Name} Bus Timings

   ## {Route Title}
   | Time     | Bus                  |
   |----------|----------------------|
   | 06:00 AM | KSRTC                |
   | 06:30 AM | Example Bus          |

   ## {Another Route Title}
   | Time     | Bus                  |
   |----------|----------------------|
   | 07:10 AM | KSRTC (NILAMBUR)     |
   | 08:20 AM | HOLY FAMILY (KANNUR) |
   \`\`\`

4. **Update the manifest**:
   - Preferred: run the script `scripts/generate-manifest.ts` to auto-generate `public/data/manifest.json`.
   - Alternative: manually add entries:

     \`\`\`json
     {
       "districts": [
         {
           "name": "idukki",
           "stands": [
             { "name": "checkpost", "path": "/data/idukki/checkpost.md" }
           ]
         }
       ]
     }
     \`\`\`

5. **Using the .md Generator (Recommended)**  
   You can also use the built-in Markdown generator tool here:  
   👉 [allkeralabustimings.vercel.app/generator](https://allkeralabustimings.vercel.app/generator)  
   This will help you quickly create properly formatted `.md` files for bus timings.

---

## ✅ Review & Testing Process

- Once a PR is created:
  - Maintainers review it.
  - If approved, it’s marked with **"Tested"** and queued for merge.

- To test locally:
  - Select your district and bus stand.
  - Your Markdown table should render correctly below the search panel.
  - Ensure tables are responsive on mobile.

---

## 📌 Naming Rules

- Use **lowercase**, hyphen-less names for folders/files (e.g., `kozhikode`, `nit.md`).
- Display names are auto-derived; keep filenames clean and simple.

---

## 🤝 Code of Conduct

- Be respectful and constructive.
- Follow the project’s simple goals: **accuracy, clarity, and accessibility**.

Thanks for contributing!
