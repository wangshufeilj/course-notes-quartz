import { FullSlug, resolveRelative } from "../util/path"
import { courseLessons, coursePage, isPageType, mlinkFrontmatter } from "./CourseData"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const LessonPager: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  if (!isPageType(fileData, "lesson")) return null
  const fm = mlinkFrontmatter(fileData)
  const lessons = courseLessons(allFiles, fm.courseId!)
  const index = lessons.findIndex((lesson) => lesson.slug === fileData.slug)
  const previous = index > 0 ? lessons[index - 1] : undefined
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined
  const course = coursePage(allFiles, fm.courseId!)
  return (
    <nav class="ml-lesson-pager" aria-label="讲次导航">
      {previous ? (
        <a class="prev" href={resolveRelative(fileData.slug!, previous.slug as FullSlug)}>
          <small>← 上一讲</small>
          <strong>{mlinkFrontmatter(previous).title}</strong>
        </a>
      ) : (
        <span class="pager-empty"></span>
      )}
      {course && (
        <a class="course" href={resolveRelative(fileData.slug!, course.slug as FullSlug)}>
          课程目录
        </a>
      )}
      {next ? (
        <a class="next" href={resolveRelative(fileData.slug!, next.slug as FullSlug)}>
          <small>下一讲 →</small>
          <strong>{mlinkFrontmatter(next).title}</strong>
        </a>
      ) : (
        <span class="pager-empty"></span>
      )}
    </nav>
  )
}

export default (() => LessonPager) satisfies QuartzComponentConstructor
