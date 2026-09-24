import { readJson, writeJson, removeKey } from './storage.js'

// Server mode: talks to the Express API in ../server
const TOKEN_KEY = 'todo-notebook:token'

export function createHttpApi(baseUrl) {
  const root = baseUrl.replace(/\/$/, '')

  async function request(path, { method = 'GET', body } = {}) {
    const token = readJson(TOKEN_KEY, null)
    let response
    try {
      response = await fetch(`${root}/api${path}`, {
        method,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })
    } catch {
      throw new Error('Cannot reach the server. Is it running?')
    }

    if (response.status === 204) return null
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      if (response.status === 401) removeKey(TOKEN_KEY)
      const error = new Error(data.message || 'Something went wrong.')
      error.status = response.status
      throw error
    }
    return data
  }

  async function authenticate(path, body) {
    const { token, user } = await request(path, { method: 'POST', body })
    writeJson(TOKEN_KEY, token)
    return user
  }

  return {
    mode: 'server',

    hasSession: () => Boolean(readJson(TOKEN_KEY, null)),
    async currentUser() {
      const { user } = await request('/auth/me')
      return user
    },
    login: (email, password) => authenticate('/auth/login', { email, password }),
    register: (name, email, password) => authenticate('/auth/register', { name, email, password }),
    logout: () => removeKey(TOKEN_KEY),

    listTasks: () => request('/todos'),
    createTask: (fields) => request('/todos', { method: 'POST', body: fields }),
    updateTask: (id, fields) => request(`/todos/${id}`, { method: 'PATCH', body: fields }),
    deleteTask: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
  }
}
