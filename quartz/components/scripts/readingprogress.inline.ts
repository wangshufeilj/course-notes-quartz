document.addEventListener("nav", () => {
  const bar = document.querySelector<HTMLElement>(".ml-reading-progress span")
  const article = document.querySelector<HTMLElement>(".center article")
  if (!bar || !article) return

  const update = () => {
    const start = article.offsetTop
    const total = Math.max(1, article.offsetHeight - window.innerHeight)
    const progress = Math.max(0, Math.min(1, (window.scrollY - start) / total))
    bar.style.transform = `scaleX(${progress})`
  }
  update()
  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", update)
  window.addCleanup(() => window.removeEventListener("scroll", update))
  window.addCleanup(() => window.removeEventListener("resize", update))
})
