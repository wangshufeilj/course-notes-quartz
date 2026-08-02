// @ts-ignore
import readingProgressScript from "./scripts/readingprogress.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ReadingProgress: QuartzComponent = () => (
  <div class="ml-reading-progress" aria-hidden="true">
    <span></span>
  </div>
)
ReadingProgress.afterDOMLoaded = readingProgressScript
export default (() => ReadingProgress) satisfies QuartzComponentConstructor
