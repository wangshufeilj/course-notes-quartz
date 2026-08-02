import { QuartzPluginData } from "../plugins/vfile"

export type MLinkFrontmatter = {
  type?: "library" | "course" | "lesson"
  title?: string
  description?: string
  courseId?: string
  courseCode?: string
  section?: string
  status?: string
  statusLabel?: string
  instructor?: string
  totalLessons?: number
  order?: number
  source?: string
  tags?: string[]
}

export function mlinkFrontmatter(file: QuartzPluginData): MLinkFrontmatter {
  return (file.frontmatter ?? {}) as MLinkFrontmatter
}

export function isPageType(file: QuartzPluginData, type: MLinkFrontmatter["type"]) {
  return mlinkFrontmatter(file).type === type
}

export function courseLessons(allFiles: QuartzPluginData[], courseId: string) {
  return allFiles
    .filter((file) => {
      const fm = mlinkFrontmatter(file)
      return fm.type === "lesson" && fm.courseId === courseId
    })
    .sort((a, b) => Number(mlinkFrontmatter(a).order ?? 0) - Number(mlinkFrontmatter(b).order ?? 0))
}

export function coursePage(allFiles: QuartzPluginData[], courseId: string) {
  return allFiles.find((file) => {
    const fm = mlinkFrontmatter(file)
    return fm.type === "course" && fm.courseId === courseId
  })
}

export function groupLessonsBySection(lessons: QuartzPluginData[]) {
  const groups = new Map<string, QuartzPluginData[]>()
  for (const lesson of lessons) {
    const section = mlinkFrontmatter(lesson).section ?? "课程正文"
    groups.set(section, [...(groups.get(section) ?? []), lesson])
  }
  return [...groups.entries()]
}
