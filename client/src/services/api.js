import axios from 'axios'
import { clearToken, getToken } from '../utils/auth'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '573001112233'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      clearToken()
      window.location.assign('/admin/login')
    }
    return Promise.reject(error)
  }
)

export default api
