import { API_URL } from '@/app/config/env'
import axios from 'axios'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})
