import { demoApi } from './demo-api.js'
import { createHttpApi } from './http-api.js'

// VITE_API_URL set (client/.env) -> real server. Not set (GitHub Pages) -> browser demo.
const apiUrl = import.meta.env.VITE_API_URL

export const api = apiUrl ? createHttpApi(apiUrl) : demoApi
export const isDemo = api.mode === 'demo'
