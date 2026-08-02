import { mlinkFrontmatter, isPageType } from "./CourseData"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const CourseHero: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  if (!isPageType(fileData, "course")) return null
  const fm = mlinkFrontmatter(fileData)
  const available = allFiles.filter((file) => {
    const item = mlinkFrontmatter(file)
    return item.type === "lesson" && item.courseId === fm.courseId
  }).length
  const total = Number(fm.totalLessons ?? available)
  return (
    <section class="ml-course-hero">
      <div class="ml-course-folio">
        <span>{fm.courseCode ?? "COURSE"}</span>
        <b>01</b>
      </div>
      <div class="ml-course-hero-main">
        <div class="ml-course-status">
          <i></i>
          {fm.statusLabel ?? "持续更新"}
        </div>
        <h1>{fm.title}</h1>
        <p>{fm.description}</p>
        <dl>
          <div>
            <dt>讲师</dt>
            <dd>{fm.instructor}</dd>
          </div>
          <div>
            <dt>进度</dt>
            <dd>
              {available} / {total} 讲
            </dd>
          </div>
          <div>
            <dt>格式</dt>
            <dd>TEXT · LATEX · TIMECODE</dd>
          </div>
        </dl>
        {fm.source && (
          <a class="ml-source-link external" href={fm.source}>
            查看原课程 ↗
          </a>
        )}
      </div>
    </section>
  )
}

export default (() => CourseHero) satisfies QuartzComponentConstructor
