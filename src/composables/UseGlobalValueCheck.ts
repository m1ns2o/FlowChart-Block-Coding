// stores/user.ts
import { defineStore } from 'pinia'

interface UserState {
  classnum: string | null
  name: string | null
}

// 쿠키 관련 타입 정의
interface CookieData {
  classnum: string
  name: string
}

// 쿠키에서 값을 가져오는 함수
const getCookie = (): CookieData | null => {
  try {
    const cookies = document.cookie.split(';')
      .reduce((acc: { [key: string]: string }, curr: string) => {
        const [key, value] = curr.trim().split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
 
    if (cookies.classnum && cookies.name) {
      return {
        classnum: cookies.classnum,
        name: cookies.name
      };
    }
    return null;
  } catch (error) {
    console.error('쿠키 읽기 중 오류 발생:', error);
    return null;
  }
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    classnum: null,
    name: null
  }),

  getters: {
    hasUserInfo: (state): boolean => {
      return !!state.classnum && !!state.name;
    }
  },

  actions: {
    // 쿠키에서 값을 확인하고 store에 설정하는 action
    checkAndSetUserInfo(): boolean {
      // 이미 store에 값이 있는 경우
      if (this.classnum && this.name) {
        return true;
      }

      // 쿠키에서 값을 가져오기
      const cookieData = getCookie();
      
      if (cookieData) {
        this.classnum = cookieData.classnum;
        this.name = cookieData.name;
        return true;
      }

      return false;
    },

    // 값을 직접 설정하는 action
    setUserInfo(classnum: string, name: string) {
      this.classnum = classnum;
      this.name = name;
    },

    // 상태 초기화
    resetUserInfo() {
      this.classnum = null;
      this.name = null;
    }
  }
})