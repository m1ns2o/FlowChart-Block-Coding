// src/stores/user.ts
import { defineStore } from 'pinia'

interface UserState {
  classnum: string;
  name: string;
}

// 쿠키 관련 타입 정의
interface CookieData {
  classnum: string;
  name: string;
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

// store 정의
export const useUserStore = defineStore({
  id: 'user', // id 추가

  state: (): UserState => ({
    classnum: '',
    name: '',
  }),

  getters: {
    hasUserInfo(): boolean {
      return !!this.classnum && !!this.name;
    }
  },

  actions: {
    checkAndSetUserInfo(): boolean {
      if (this.classnum && this.name) {
        return true;
      }

      const cookieData = getCookie();
      
      if (cookieData) {
        this.classnum = cookieData.classnum;
        this.name = cookieData.name;
        return true;
      }

      return false;
    },

    setUserInfo(classnum: string, name: string): void {
      this.classnum = classnum;
      this.name = name;
    },

    resetUserInfo(): void {
      this.classnum = '';
      this.name = '';
    }
  }
});