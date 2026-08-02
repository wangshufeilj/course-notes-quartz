import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const BrandHeader: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const from = fileData.slug!
  return (
    <div class="ml-brand-header">
      <a
        class="ml-brand"
        href={resolveRelative(from, "index" as FullSlug)}
        aria-label="M-Link Tech Notebook 首页"
      >
        <span class="ml-brand-mark" aria-hidden="true">
          <i>M</i>
          <b>L</b>
        </span>
        <span class="ml-brand-type">
          <strong>M-Link</strong>
          <small>Tech Notebook</small>
        </span>
      </a>
      <nav class="ml-primary-nav" aria-label="主导航">
        <a href={resolveRelative(from, "courses/index" as FullSlug)}>Courses</a>
        <a href={resolveRelative(from, "tags/index" as FullSlug)}>Tags</a>
        <a href={resolveRelative(from, "about" as FullSlug)}>About</a>
      </nav>
    </div>
  )
}

export default (() => BrandHeader) satisfies QuartzComponentConstructor
