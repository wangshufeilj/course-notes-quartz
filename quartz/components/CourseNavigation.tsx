import { FullSlug, resolveRelative } from "../util/path"
import { courseLessons, coursePage, groupLessonsBySection, mlinkFrontmatter } from "./CourseData"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import courseNavigationScript from "./scripts/coursenavigation.inline"

const CourseNavigation: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const fm = mlinkFrontmatter(fileData)
  if (!fm.courseId || (fm.type !== "course" && fm.type !== "lesson")) return null
  const course = coursePage(allFiles, fm.courseId)
  const lessons = courseLessons(allFiles, fm.courseId)
  const groups = groupLessonsBySection(lessons)
  return (
    <nav class="ml-course-nav" aria-label="当前课程目录">
      <button class="ml-course-nav-toggle" type="button" aria-expanded="false">
        <span>课程目录</span>
        <i aria-hidden="true">＋</i>
      </button>
      <div class="ml-course-nav-content">
        <div class="ml-course-nav-head">
          <span>COURSE INDEX</span>
          <strong>{mlinkFrontmatter(course ?? fileData).courseCode ?? "M-LINK"}</strong>
        </div>
        {course && (
          <a
            class={fileData.slug === course.slug ? "ml-course-home active" : "ml-course-home"}
            href={resolveRelative(fileData.slug!, course.slug as FullSlug)}
          >
            课程首页
          </a>
        )}
        {groups.map(([section, items], index) => (
          <div class="ml-course-nav-group">
            <h3>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section}
            </h3>
            <ol>
              {items.map((item) => {
                const itemFm = mlinkFrontmatter(item)
                return (
                  <li>
                    <a
                      class={fileData.slug === item.slug ? "active" : ""}
                      href={resolveRelative(fileData.slug!, item.slug as FullSlug)}
                    >
                      <span>{String(itemFm.order).padStart(2, "0")}</span>
                      {itemFm.title?.replace(/^第\d+讲\s*/, "")}
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
    </nav>
  )
}

CourseNavigation.afterDOMLoaded = courseNavigationScript

export default (() => CourseNavigation) satisfies QuartzComponentConstructor
