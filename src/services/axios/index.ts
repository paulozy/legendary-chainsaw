import axios from 'axios'

export const api = axios.create({
  baseURL: '/api/',
  timeout: 1500,
  headers:  { 'Content-Type': 'application/json'}
})