import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const BrandFooter: QuartzComponent = ({ fileData }: QuartzComponentProps) => (
  <footer class="ml-footer">
    <div>
      <strong>M-Link Tech Notebook</strong>
      <span>连接课程、概念与实践。</span>
    </div>
    <nav>
      <a href={resolveRelative(fileData.slug!, "courses/index" as FullSlug)}>Courses</a>
      <a href={resolveRelative(fileData.slug!, "about" as FullSlug)}>About</a>
      <a href="https://quartz.jzhao.xyz/">Built with Quartz</a>
    </nav>
  </footer>
)

export default (() => BrandFooter) satisfies QuartzComponentConstructor
