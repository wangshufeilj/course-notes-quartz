import { FullSlug, resolveRelative } from "../util/path"
import { isPageType, mlinkFrontmatter } from "./CourseData"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const CourseCatalog: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  if (!isPageType(fileData, "library")) return null

  const courses = allFiles
    .filter((file) => isPageType(file, "course"))
    .sort((a, b) =>
      String(mlinkFrontmatter(a).courseCode).localeCompare(String(mlinkFrontmatter(b).courseCode)),
    )

  const isHome = fileData.slug === "index"
  return (
    <div class="ml-library-shell">
      <section class={isHome ? "ml-library-hero is-home" : "ml-library-hero"}>
        <div class="ml-hero-index">ML / LIBRARY / {String(courses.length).padStart(2, "0")}</div>
        <p class="ml-hero-kicker">Linked notes for deliberate learning</p>
        <h1>{isHome ? "把课程，整理成可以反复翻阅的书。" : "课程书库"}</h1>
        <p class="ml-hero-summary">
          连接课程、概念与实践。每一门课程按章节整理，保留视频定位、原生公式与可检索文本。
        </p>
        <div class="ml-hero-rule">
          <span></span>
          <small>M-LINK TECH NOTEBOOK</small>
        </div>
      </section>

      <section class="ml-course-catalog" aria-labelledby="course-catalog-title">
        <div class="ml-section-heading">
          <div>
            <span>CATALOG</span>
            <h2 id="course-catalog-title">课程书库</h2>
          </div>
          <p>{courses.length} 本教材 · 持续生长</p>
        </div>
        <div class="ml-course-grid">
          {courses.map((course, index) => {
            const fm = mlinkFrontmatter(course)
            const available = allFiles.filter((file) => {
              const item = mlinkFrontmatter(file)
              return item.type === "lesson" && item.courseId === fm.courseId
            }).length
            const total = Number(fm.totalLessons ?? available)
            const percent = total > 0 ? Math.min(100, Math.round((available / total) * 100)) : 0
            return (
              <a
                class="ml-course-card"
                href={resolveRelative(fileData.slug!, course.slug as FullSlug)}
              >
                <div class="ml-course-spine">
                  <span>{fm.courseCode ?? `ML-${index + 1}`}</span>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                </div>
                <div class="ml-course-card-body">
                  <div class="ml-course-card-top">
                    <span>{fm.statusLabel ?? "持续更新"}</span>
                    <small>{percent}% INDEXED</small>
                  </div>
                  <h3>{fm.title}</h3>
                  <p>{fm.description}</p>
                  <div class="ml-course-meta">
                    <span>{fm.instructor}</span>
                    <span>
                      {available} / {total} 讲
                    </span>
                  </div>
                  <div class="ml-course-meter">
                    <i style={`width:${percent}%`}></i>
                  </div>
                  <div class="ml-course-enter">
                    进入课程 <b aria-hidden="true">↗</b>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default (() => CourseCatalog) satisfies QuartzComponentConstructor
