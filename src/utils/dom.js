export function $(selector) {
  return document.querySelector(selector)
}

export function $$(selector) {
  return document.querySelectorAll(selector)
}

export function createElement(tag, className = '', innerHTML = '') {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (innerHTML) el.innerHTML = innerHTML
  return el
}

export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
