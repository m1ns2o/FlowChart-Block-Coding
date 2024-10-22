// src/plugins/axios.ts

import axios from 'axios'
import router from '../router'

// axios 기본 설정
axios.defaults.baseURL = 'http://127.0.0.1:8080/'

// 토큰 관리
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `${token}`
    localStorage.setItem('token', token)
  } else {
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

// 초기 토큰 설정
const token = localStorage.getItem('token')
if (token) {
  setAuthToken(token)
}

// 응답 인터셉터
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 인증 에러 발생 시 토큰 제거 및 로그인 페이지로 리다이렉트
      setAuthToken(null)
      router.push('/class')
    }
    return Promise.reject(error)
  }
)

export { axios as default, setAuthToken }