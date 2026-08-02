import { courseLessons, isPageType, mlinkFrontmatter } from "./CourseData"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const LessonHeader: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  if (!isPageType(fileData, "lesson")) return null
  const fm = mlinkFrontmatter(fileData)
  const lessons = courseLessons(allFiles, fm.courseId!)
  const index = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.slug === fileData.slug),
  )
  const percent = lessons.length ? Math.round(((index + 1) / lessons.length) * 100) : 0
  return (
    <section class="ml-lesson-header">
      <div class="ml-lesson-overline">
        <span>{fm.section}</span>
        <i>
          {String(index + 1).padStart(2, "0")} / {String(lessons.length).padStart(2, "0")}
        </i>
      </div>
      <h1>{fm.title}</h1>
      <div class="ml-lesson-progress">
        <span style={`width:${percent}%`}></span>
      </div>
    </section>
  )
}

export default (() => LessonHeader) satisfies QuartzComponentConstructor
