<template>
    <div class="main">
      <v-container class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-sheet class="pa-6" rounded="lg" elevation="1">
              <v-form @submit.prevent="submitForm" v-model="formValid">
                <v-text-field
                  v-model="classroomNumber"
                  :rules="classroomRules"
                  label="클래스룸 번호"
                  required
                  variant="outlined"
                  bg-color="white"
                  color="indigo"
                  label-color="indigo-darken-2"
                ></v-text-field>
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="이름"
                  required
                  variant="outlined"
                  bg-color="white"
                  color="indigo"
                  label-color="indigo-darken-2"
                ></v-text-field>
                <v-btn 
                  class="mt-4" 
                  type="submit" 
                  block 
                  color="indigo"
                  :disabled="!formValid"
                >
                  입장
                </v-btn>
              </v-form>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGlobalValueCheck } from '../composables/useGlobalValueCheck'; // Composable 함수 가져오기
import axios from 'axios';

// Composable 함수 호출
  const { checkGlobalValues } = useGlobalValueCheck();
  const formValid = ref(false)
  const classroomNumber = ref('')
  const name = ref('')
  
  const router = useRouter()

  interface CookieData {
    classnum: string;
    name: string;
  }

const setCookies = (classnum: string, name: string): void => {
 try {
   const expirationDate = new Date();
   expirationDate.setTime(expirationDate.getTime() + (60 * 60 * 1000)); // 1시간

   const cookieString = `expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
   document.cookie = `classnum=${encodeURIComponent(classnum)}; ${cookieString}`;
   document.cookie = `name=${encodeURIComponent(name)}; ${cookieString}`;
   
   console.log('쿠키 저장 완료. 만료 시간:', expirationDate.toLocaleString());
 } catch (error) {
   console.error('쿠키 저장 중 오류 발생:', error);
 }
};

  
  const classroomRules = [
    (v: string) => !!v || '클래스룸 번호를 입력해주세요.',
    // (v: string) => /^\d+$/.test(v) || '클래스룸 번호는 숫자만 입력 가능합니다.'
  ]
  
  const nameRules = [
    (v: string) => !!v || '이름은 필수입니다.',
    (v: string) => v.length <= 20 || '이름은 10자 이내로 입력해주세요.'
  ]
  
  const submitForm = async () => {  // async 추가
  if (formValid.value) {
    try {
      const response = await axios.post('http://127.0.0.1:8080/users', {  // 전체 URL 사용
        classnum: classroomNumber.value, 
        name: name.value
      }, {
        headers: {
          'Content-Type': 'application/json'  // 헤더 추가
        }
      });
      
      console.log('Success:', response.data);
      setCookies(classroomNumber.value, name.value);
      router.push('/problemlist');  // 성공 시 리다이렉트
      
    } catch (error) {
      console.error('Error:', error.response?.data);  // 에러 처리 추가
    }
  }
  }

  onBeforeMount(()=>{
    if(checkGlobalValues()){
      router.push(`/problemlist`)
    }else{
      console.log('qwer');
    }
  })
  
  </script>
  
  <style scoped>
  .main {
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  /* 추가적인 스타일 커스터마이징 */
  :deep(.v-field__outline) {
    --v-field-border-opacity: 1;
    --v-field-border-width: 2px;
  }
  
  :deep(.v-field--focused .v-field__outline) {
    --v-field-border-opacity: 1;
  }
  </style>