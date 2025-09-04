import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, ExternalLink, FileText, GitBranch, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Contributing Guide - All Kerala Bus Timings",
  description:
    "Learn how to contribute bus timing data to help Kerala commuters. Complete guide for adding new bus stands and updating existing timings.",
}

export default function ContributingPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-4xl px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Contributing Guide</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-8">
        {/* Hero Section */}
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Contributing to allkeralabustimings</h1>
            <p className="text-lg text-muted-foreground mb-4">Thank you for helping Kerala commuters!</p>
            <p className="text-sm text-muted-foreground">
              This project intentionally avoids any database — all bus timings live in Markdown files under{" "}
              <code className="bg-muted px-2 py-1 rounded text-xs">public/data</code>.
            </p>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />🚀 Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Create a branch from the latest <Badge variant="secondary">develop</Badge> branch with the format:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">
                issues/{"{issue#}"}/{"{short-name}"}
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              Example: <code className="bg-muted px-2 py-1 rounded text-xs">issues/45/add-idukki-checkpost</code>
            </p>
          </CardContent>
        </Card>

        {/* Issue & PR Guidelines */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />📝 Issue & PR Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Creating an Issue</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  • When opening an issue, <strong>always specify</strong> whether you are:
                </li>
                <li className="ml-4">
                  - <strong>Adding a new bus stand</strong> (new Markdown file).
                </li>
                <li className="ml-4">
                  - <strong>Updating an existing bus stand</strong> (editing a Markdown file).
                </li>
              </ul>

              <p className="mt-4 text-sm">
                If possible, <strong>attach a clear photo of the bus stand's official bus timings</strong>{" "}
                <Link
                  href="https://drive.google.com/file/d/1-mFF3SPDUwafiV5MHPr6YjiYgrmT_M_t/view?usp=sharing"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                  target="_blank"
                >
                  (example photo <ExternalLink className="h-3 w-3" />)
                </Link>
                . This makes it easier for maintainers and reviewers to validate the information.
              </p>

              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Issue Title Pattern:</p>
                <div className="bg-muted p-3 rounded-lg">
                  <code className="text-sm">[district:stand] Short description</code>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Example:{" "}
                  <code className="bg-muted px-2 py-1 rounded">[idukki:checkpost] Add morning bus timings</code>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Pull Requests</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>PR Title:</strong>
                  <br />
                  Use a meaningful description with the issue number.
                  <br />
                  <span className="text-muted-foreground">Example: </span>
                  <code className="bg-muted px-2 py-1 rounded text-xs">🚌 Add timings for Idukki Checkpost (#45)</code>
                </li>
                <li>
                  <strong>Linking Issues:</strong>
                  <br />
                  Mention the issue number in the PR body using closing keywords (e.g.,{" "}
                  <code className="bg-muted px-2 py-1 rounded text-xs">Closes #45</code>).
                  <br />
                  <Link
                    href="https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue"
                    className="text-primary hover:underline inline-flex items-center gap-1 text-xs"
                    target="_blank"
                  >
                    Refer: Linking a pull request to an issue <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Adding or Updating Timings */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>📂 Adding or Updating Timings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-4 text-sm">
              <li>
                <strong>1. Create a district folder</strong> (if it doesn't exist):
                <br />
                <code className="bg-muted px-2 py-1 rounded text-xs">public/data/{"{district}"}</code>
                <br />
                <span className="text-muted-foreground text-xs">Example: </span>
                <code className="bg-muted px-2 py-1 rounded text-xs">public/data/idukki</code>
              </li>

              <li>
                <strong>2. Add a Markdown file for each stand</strong>:<br />
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  public/data/{"{district}"}/{"{stand}"}.md
                </code>
                <br />
                <span className="text-muted-foreground text-xs">Example: </span>
                <code className="bg-muted px-2 py-1 rounded text-xs">public/data/idukki/checkpost.md</code>
              </li>

              <li>
                <strong>3. Use GFM tables</strong> in the following format:
                <div className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">{`# {Bus Stand Name} Bus Timings

## {Route Title}
| Time     | Bus                  |
|----------|----------------------|
| 06:00 AM | KSRTC                |
| 06:30 AM | Example Bus          |

## {Another Route Title}
| Time     | Bus                  |
|----------|----------------------|
| 07:10 AM | KSRTC (NILAMBUR)     |
| 08:20 AM | HOLY FAMILY (KANNUR) |`}</pre>
                </div>
              </li>

              <li>
                <strong>4. Update the manifest</strong>:
                <ul className="mt-2 space-y-2 text-xs">
                  <li>
                    • <strong>Preferred:</strong> run the script{" "}
                    <code className="bg-muted px-2 py-1 rounded">scripts/generate-manifest.ts</code> to auto-generate{" "}
                    <code className="bg-muted px-2 py-1 rounded">public/data/manifest.json</code>.
                  </li>
                  <li>
                    • <strong>Alternative:</strong> manually add entries:
                  </li>
                </ul>
                <div className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto">
                  <pre className="text-xs">{`{
  "districts": [
    {
      "name": "idukki",
      "stands": [
        { "name": "checkpost", "path": "/data/idukki/checkpost.md" }
      ]
    }
  ]
}`}</pre>
                </div>
              </li>

              <li>
                <strong>5. Using the .md Generator (Recommended)</strong>
                <br />
                You can also use the built-in Markdown generator tool here:
                <br />
                <Link
                  href="/generator"
                  className="text-primary hover:underline inline-flex items-center gap-1 text-xs mt-1"
                >
                  👉 allkeralabustimings.vercel.app/generator <ExternalLink className="h-3 w-3" />
                </Link>
                <br />
                <span className="text-muted-foreground text-xs">
                  This will help you quickly create properly formatted{" "}
                  <code className="bg-muted px-1 rounded">.md</code> files for bus timings.
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Review & Testing Process */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />✅ Review & Testing Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-2">Once a PR is created:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Maintainers review it.</li>
                <li>
                  • If approved, it's marked with{" "}
                  <Badge variant="secondary" className="text-xs">
                    "Tested"
                  </Badge>{" "}
                  and queued for merge.
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm mb-2">To test locally:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Select your district and bus stand.</li>
                <li>• Your Markdown table should render correctly below the search panel.</li>
                <li>• Ensure tables are responsive on mobile.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Naming Rules */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>📌 Naming Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                • Use <strong>lowercase</strong>, hyphen-less names for folders/files (e.g.,{" "}
                <code className="bg-muted px-2 py-1 rounded text-xs">kozhikode</code>,{" "}
                <code className="bg-muted px-2 py-1 rounded text-xs">nit.md</code>).
              </li>
              <li>• Display names are auto-derived; keep filenames clean and simple.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Code of Conduct */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>🤝 Code of Conduct</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Be respectful and constructive.</li>
              <li>
                • Follow the project's simple goals: <strong>accuracy, clarity, and accessibility</strong>.
              </li>
            </ul>
            <p className="mt-4 text-center font-medium">Thanks for contributing!</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
