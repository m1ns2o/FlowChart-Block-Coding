// src/composables/useAuthCheck.ts
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthCheck = () => {
  const userStore = useUserStore()
  const { classnum, name } = storeToRefs(userStore)
  const router = useRouter()

  const checkAuth = (): boolean => {
    if (!classnum.value || !name.value) {
      console.log('store가 비어있습니다. 쿠키에서 값을 불러옵니다.')
      const hasUserInfo = userStore.checkAndSetUserInfo()
      
      if (!hasUserInfo) {
        console.log('쿠키에도 사용자 정보가 없습니다. 로그인 페이지로 이동합니다.')
        router.push('/login')
        return false
      }
    }
    return true
  }

  return {
    checkAuth,
  }
}