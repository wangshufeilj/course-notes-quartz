// @ts-ignore
import themeFamilyScript from "./scripts/themefamily.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ThemeFamilyToggle: QuartzComponent = () => (
  <button
    class="theme-family-toggle"
    type="button"
    aria-label="切换手册与出版主题"
    title="切换视觉主题"
  >
    <span class="theme-family-manual" aria-hidden="true">
      M
    </span>
    <span class="theme-family-divider" aria-hidden="true"></span>
    <span class="theme-family-editorial" aria-hidden="true">
      E
    </span>
  </button>
)

ThemeFamilyToggle.beforeDOMLoaded = themeFamilyScript

export default (() => ThemeFamilyToggle) satisfies QuartzComponentConstructor
