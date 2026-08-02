import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.BrandHeader(),
    Component.Search(),
    Component.ThemeFamilyToggle(),
    Component.Darkmode(),
    Component.ReaderMode(),
  ],
  afterBody: [Component.ReadingProgress(), Component.LessonPager()],
  footer: Component.BrandFooter(),
}

const isStructuredPage = (page: any) =>
  ["library", "course", "lesson"].includes(page.fileData.frontmatter?.type)
const isCourseContext = (page: any) =>
  ["course", "lesson"].includes(page.fileData.frontmatter?.type)

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.CourseHero(),
    Component.LessonHeader(),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !isStructuredPage(page),
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) =>
        page.fileData.frontmatter?.type !== "library" &&
        page.fileData.frontmatter?.type !== "course",
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.frontmatter?.type === "lesson",
    }),
    Component.CourseOutline(),
    Component.CourseCatalog(),
  ],
  left: [
    Component.ConditionalRender({
      component: Component.CourseNavigation(),
      condition: isCourseContext,
    }),
    Component.ConditionalRender({
      component: Component.Explorer({
        title: "Notebook Index",
        folderClickBehavior: "link",
        folderDefaultState: "collapsed",
      }),
      condition: (page) => !isCourseContext(page),
    }),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.TableOfContents()),
      condition: (page) => page.fileData.frontmatter?.type === "lesson" || !isStructuredPage(page),
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.CourseHero(),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !isStructuredPage(page),
    }),
    Component.CourseOutline(),
    Component.CourseCatalog(),
  ],
  left: [
    Component.ConditionalRender({
      component: Component.CourseNavigation(),
      condition: isCourseContext,
    }),
    Component.ConditionalRender({
      component: Component.Explorer({
        title: "Notebook Index",
        folderClickBehavior: "link",
        folderDefaultState: "collapsed",
      }),
      condition: (page) => !isCourseContext(page),
    }),
  ],
  right: [],
}
