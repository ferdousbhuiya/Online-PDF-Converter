const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').trim()

export function apiUrl(path: string) {
  if (!path.startsWith('/')) {
    throw new Error('apiUrl path must start with /')
  }

  if (!configuredBase) {
    return path
  }

  return `${configuredBase.replace(/\/$/, '')}${path}`
}
