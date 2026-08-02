import fs from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifestPath = path.join(root, ".publish.local.json")

if (!fs.existsSync(manifestPath)) {
  throw new Error(
    "Missing .publish.local.json. Copy .publish.local.example.json and add local source paths.",
  )
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
if (!Array.isArray(manifest.notes) || manifest.notes.length === 0) {
  throw new Error(".publish.local.json must contain at least one note.")
}

const displayMathPattern = /\$\$([\s\S]*?)\$\$/g
const inlineMathPattern = /\$([^$\r\n]+?)\$/g
const markdownImagePattern = /!\[[^\]]*\]\([^)]+\)/g
const obsidianImagePattern = /!\[\[[^\]]+\]\]/g
const htmlImagePattern = /<img\b[^>]*>/gi
const timestampLinePattern = /^\s*\[(\d{2}:\d{2}:\d{2})\]\((https?:\/\/[^)]+)\)\s*$/gm

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n/, "")
}

function extractMath(markdown) {
  const display = [...markdown.matchAll(displayMathPattern)].map((match) => match[1].trim())
  const withoutDisplay = markdown.replace(displayMathPattern, "")
  const inline = [...withoutDisplay.matchAll(inlineMathPattern)].map((match) => match[1].trim())
  return { display, inline }
}

function sanitizeBilibiliUrl(raw) {
  const url = new URL(raw.replaceAll("&amp;", "&"))
  if (!/(^|\.)bilibili\.com$/i.test(url.hostname)) return url.toString()

  const keep = new URLSearchParams()
  for (const key of ["p", "t"]) {
    const value = url.searchParams.get(key)
    if (value !== null && value !== "") keep.set(key, value)
  }
  url.search = keep.toString()
  url.hash = ""
  return url.toString()
}

function yamlString(value) {
  return JSON.stringify(String(value))
}

function renderFrontmatter(note) {
  const tags = (note.tags ?? []).map((tag) => `  - ${yamlString(tag)}`).join("\n")
  return [
    "---",
    "type: lesson",
    `title: ${yamlString(note.title)}`,
    `courseId: ${yamlString(note.courseId)}`,
    `section: ${yamlString(note.section)}`,
    `order: ${Number(note.order)}`,
    `permalink: ${yamlString(note.permalink)}`,
    `author: ${yamlString(note.author)}`,
    `source: ${yamlString(sanitizeBilibiliUrl(note.sourceUrl))}`,
    `date: ${yamlString(note.date)}`,
    "draft: false",
    "enableToc: true",
    "cssclasses:",
    "  - lesson-page",
    "tags:",
    tags,
    "---",
    "",
  ].join("\n")
}

function countImages(markdown) {
  return (
    (markdown.match(markdownImagePattern) ?? []).length +
    (markdown.match(obsidianImagePattern) ?? []).length +
    (markdown.match(htmlImagePattern) ?? []).length
  )
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex").toUpperCase()
}

function convert(note) {
  const sourcePath = path.resolve(note.source)
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing source note: ${sourcePath}`)

  const originalBytes = fs.readFileSync(sourcePath)
  const sourceSha256 = sha256(originalBytes)
  const original = originalBytes.toString("utf8")
  const sourceMath = extractMath(original)
  const sourceImageCount = countImages(original)
  const sourceTimestampCount = [...original.matchAll(timestampLinePattern)].length

  let body = stripFrontmatter(original)
  body = body.replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\r?\n?/gm, "")
  body = body.replace(obsidianImagePattern, "")
  body = body.replace(htmlImagePattern, "")
  body = body.replace(timestampLinePattern, (_, timestamp, url) => {
    return `[▶ 视频 ${timestamp}](${sanitizeBilibiliUrl(url)})`
  })
  body = body.replace(/\n{3,}/g, "\n\n").trim() + "\n"

  const output = renderFrontmatter(note) + body
  const outputMath = extractMath(output)
  const outputImageCount = countImages(output)
  const outputTimestampCount = (
    output.match(/\[▶ 视频 \d{2}:\d{2}:\d{2}\]\(https?:\/\/[^)]+\)/g) ?? []
  ).length
  const trackingCount = (output.match(/(?:spm_id_from|vd_source)=/g) ?? []).length

  const errors = []
  if (note.expectedImages !== undefined && sourceImageCount !== note.expectedImages) {
    errors.push(`expected ${note.expectedImages} source images, found ${sourceImageCount}`)
  }
  if (
    note.expectedTimestampLinks !== undefined &&
    sourceTimestampCount !== note.expectedTimestampLinks
  ) {
    errors.push(
      `expected ${note.expectedTimestampLinks} source timestamps, found ${sourceTimestampCount}`,
    )
  }
  if (outputImageCount !== 0)
    errors.push(`output still contains ${outputImageCount} image references`)
  if (outputTimestampCount !== sourceTimestampCount) {
    errors.push(
      `timestamp mismatch: source ${sourceTimestampCount}, output ${outputTimestampCount}`,
    )
  }
  if (trackingCount !== 0) errors.push(`output still contains ${trackingCount} tracking parameters`)
  if (JSON.stringify(sourceMath) !== JSON.stringify(outputMath)) {
    errors.push("LaTeX expressions changed during conversion")
  }
  if (errors.length) throw new Error(`${note.title}: ${errors.join("; ")}`)

  const outputPath = path.resolve(root, note.output)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, output, "utf8")

  const sourceSha256After = sha256(fs.readFileSync(sourcePath))
  if (sourceSha256After !== sourceSha256) {
    throw new Error(`${note.title}: source note changed during conversion`)
  }

  return {
    source: sourcePath,
    sourceSha256,
    output: path.relative(root, outputPath).replaceAll("\\", "/"),
    removedImages: sourceImageCount,
    timestampLinks: outputTimestampCount,
    displayMath: outputMath.display.length,
    inlineMath: outputMath.inline.length,
    trackingParameters: trackingCount,
  }
}

const results = manifest.notes.map(convert)
const report = { generatedAt: new Date().toISOString(), notes: results }
fs.mkdirSync(path.join(root, "scripts"), { recursive: true })
fs.writeFileSync(
  path.join(root, "scripts", ".publish-report.json"),
  JSON.stringify(report, null, 2),
  "utf8",
)
console.log(JSON.stringify(report, null, 2))
