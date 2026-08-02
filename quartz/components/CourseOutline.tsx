import { FullSlug, resolveRelative } from "../util/path"
import { courseLessons, groupLessonsBySection, isPageType, mlinkFrontmatter } from "./CourseData"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const CourseOutline: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  if (!isPageType(fileData, "course")) return null
  const fm = mlinkFrontmatter(fileData)
  const groups = groupLessonsBySection(courseLessons(allFiles, fm.courseId!))
  return (
    <section class="ml-course-outline">
      <div class="ml-section-heading">
        <div>
          <span>CONTENTS</span>
          <h2>课程目录</h2>
        </div>
        <p>{groups.length} 个章节</p>
      </div>
      {groups.map(([section, lessons], groupIndex) => (
        <div class="ml-outline-section">
          <div class="ml-outline-section-title">
            <span>{String(groupIndex + 1).padStart(2, "0")}</span>
            <h3>{section}</h3>
          </div>
          <ol>
            {lessons.map((lesson) => {
              const item = mlinkFrontmatter(lesson)
              return (
                <li>
                  <a href={resolveRelative(fileData.slug!, lesson.slug as FullSlug)}>
                    <span>{String(item.order).padStart(2, "0")}</span>
                    <strong>{item.title}</strong>
                    <i>开始阅读 →</i>
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </section>
  )
}

export default (() => CourseOutline) satisfies QuartzComponentConstructor
