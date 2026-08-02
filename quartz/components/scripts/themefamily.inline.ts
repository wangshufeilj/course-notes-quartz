const storedFamily = localStorage.getItem("ml-theme-family")
const initialFamily = storedFamily === "editorial" ? "editorial" : "manual"
document.documentElement.setAttribute("data-theme-family", initialFamily)

document.addEventListener("nav", () => {
  const toggleFamily = () => {
    const current = document.documentElement.getAttribute("data-theme-family")
    const next = current === "editorial" ? "manual" : "editorial"
    document.documentElement.setAttribute("data-theme-family", next)
    localStorage.setItem("ml-theme-family", next)
  }

  for (const button of document.getElementsByClassName("theme-family-toggle")) {
    button.addEventListener("click", toggleFamily)
    window.addCleanup(() => button.removeEventListener("click", toggleFamily))
  }
})
