const STORAGE_KEY = 'pdf-toolkit-api-base-url'
const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').trim()

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/$/, '')
}

export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && stored.trim()) {
      return normalizeBaseUrl(stored)
    }
  }
  return normalizeBaseUrl(configuredBase)
}

export function setApiBaseUrl(value: string) {
  if (typeof window === 'undefined') return
  const normalized = normalizeBaseUrl(value)
  if (!normalized) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }
  window.localStorage.setItem(STORAGE_KEY, normalized)
}

export function apiUrl(path: string) {
  if (!path.startsWith('/')) {
    throw new Error('apiUrl path must start with /')
  }

  const base = getApiBaseUrl()
  if (!base) {
    return path
  }

  return `${base}${path}`
}
