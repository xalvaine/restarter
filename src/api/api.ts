import axios from 'axios'
import { PATH } from '@/config'

export interface Tokens {
  access: string
  refresh: string
}

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL })

const updateTokens = (tokens: Tokens) => {
  localStorage.setItem(`refresh`, tokens.refresh)
  api.defaults.headers.Authorization = `Bearer ${tokens.access}`
}

const clearTokens = () => {
  localStorage.removeItem(`refresh`)
  delete api.defaults.headers.Authorization
}

const createResponseInterceptor = () => {
  const interceptor = api.interceptors.response.use(
    undefined,
    async (error) => {
      if (
        error.response.status !== 401 ||
        error.response.config.url !== `/auth/jwt/refresh/`
      ) {
        return Promise.reject(error)
      }
      api.interceptors.response.eject(interceptor)

      try {
        const { data } = await api.post(`/auth/jwt/refresh/`, {
          refresh: localStorage.getItem(`refresh`),
        })
        updateTokens(data)
        return await api(error.response.config)
      } catch (error) {
        clearTokens()
        window.location.replace(PATH.LOGIN)
        await Promise.reject(error)
      } finally {
        createResponseInterceptor()
      }
    },
  )
}

createResponseInterceptor()

export { api, updateTokens, clearTokens }