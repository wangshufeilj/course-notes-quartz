document.addEventListener("nav", () => {
  for (const nav of document.querySelectorAll<HTMLElement>(".ml-course-nav")) {
    const button = nav.querySelector<HTMLButtonElement>(".ml-course-nav-toggle")
    if (!button) continue
    const toggle = () => {
      const open = nav.classList.toggle("is-open")
      button.setAttribute("aria-expanded", String(open))
      const icon = button.querySelector("i")
      if (icon) icon.textContent = open ? "−" : "＋"
    }
    button.addEventListener("click", toggle)
    window.addCleanup(() => button.removeEventListener("click", toggle))
  }
})
