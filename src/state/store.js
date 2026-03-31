class Store {
  constructor(state = {}) {
    this.state = { ...state }
    this.listeners = new Set()
  }

  get(key) {
    return this.state[key]
  }

  set(key, value) {
    this.state[key] = value
    this.notify()
  }

  subscribe(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  notify() {
    this.listeners.forEach((fn) => fn({ ...this.state }))
  }

  getState() {
    return { ...this.state }
  }
}

export const store = new Store({
  user: null,
  routes: [],
  loading: false,
})
