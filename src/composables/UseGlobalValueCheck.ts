import { getCurrentInstance } from 'vue';

// 쿠키에서 값을 가져오는 함수
// const getCookie = (name: string): string | null => {
//   const nameEQ = name + "=";
//   const ca = document.cookie.split(';');
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i].trim();
//     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// };
interface CookieData {
    classnum: string;
    name: string;
   }
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

// Global Property 타입 정의
interface GlobalProperties {
  $classnum?: string;
  $name?: string;
}

// Global Property 값을 확인하는 함수
export const useGlobalValueCheck = () => {
  // 현재 인스턴스를 가져옵니다.
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('This function must be called within a component setup.');
  }

  const globalProperties = instance.appContext.config.globalProperties as GlobalProperties;

  // 값을 확인하는 함수
  const checkGlobalValues = (): boolean => {
    const classnum = globalProperties.$classnum;
    const name = globalProperties.$name;

    // classnum 또는 name이 없으면 쿠키에서 값을 가져오기
    if (!classnum || !name) {
      const classnumFromCookie = getCookie('classnum');
      const nameFromCookie = getCookie('name');

      // 쿠키에서 가져온 값으로 globalProperties 설정
      if (classnumFromCookie && nameFromCookie) {
        globalProperties.$classnum = classnumFromCookie;
        globalProperties.$name = nameFromCookie;
        return true; // 값이 정상적으로 설정되었으면 true 반환
      } else {
        return false; // 값이 없으면 false 반환
      }
    }

    return true; // Global Property에 값이 이미 존재하면 true 반환
  };

  return { checkGlobalValues };
};
