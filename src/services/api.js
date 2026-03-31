const BASE_URL = process.env.API_URL || 'http://localhost:8080'

export async function fetchData(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }

  return res.json()
}

export async function get(endpoint) {
  return fetchData(endpoint)
}

export async function post(endpoint, data) {
  return fetchData(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
