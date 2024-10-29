<template>
  <div class="main">
    <v-overlay
      :model-value="initialLoading"
      persistent
      class="d-flex align-center justify-center"
      scrim="#f5f5f5"
    >
      <v-progress-circular
        color="indigo"
        indeterminate
        size="64"
        width="6"
      ></v-progress-circular>
    </v-overlay>

    <template v-if="!initialLoading">
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
                  :disabled="!formValid || isLoading"
                  :loading="isLoading"
                >
                  입장
                </v-btn>
              </v-form>
              <v-snackbar
                v-model="showError"
                color="error"
                timeout="3000"
                location="top"
              >
                {{ errorMessage }}
              </v-snackbar>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const initialLoading = ref(true)
const formValid = ref(false)
const classroomNumber = ref('')
const name = ref('')
const isLoading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const router = useRouter()
const userStore = useUserStore()

const classroomRules = [
  (v: string) => !!v || '클래스룸 번호를 입력해주세요.',
]

const nameRules = [
  (v: string) => !!v || '이름은 필수입니다.',
  (v: string) => v.length <= 20 || '이름은 10자 이내로 입력해주세요.'
]

const setCookiesAndStore = (classnum: string, name: string): void => {
  try {
    // Store에 사용자 정보 설정
    userStore.setUserInfo(classnum, name)
    
    // 쿠키 설정
    const expirationDate = new Date()
    expirationDate.setTime(expirationDate.getTime() + (60 * 60 * 1000)) // 1시간

    const cookieString = `expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`
    document.cookie = `classnum=${encodeURIComponent(classnum)}; ${cookieString}`
    document.cookie = `name=${encodeURIComponent(name)}; ${cookieString}`
    
    console.log('사용자 정보 저장 완료. 만료 시간:', expirationDate.toLocaleString())
  } catch (error) {
    console.error('사용자 정보 저장 중 오류 발생:', error)
  }
}

const checkAuthAndRedirect = async () => {
  try {
    const hasUserInfo = userStore.checkAndSetUserInfo()
    if (hasUserInfo) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await router.push('/problemlist')
    }
  } catch (error) {
    console.error('Redirection error:', error)
  } finally {
    setTimeout(() => {
      initialLoading.value = false
    }, 1000)
  }
}

const submitForm = async () => {
  if (formValid.value) {
    isLoading.value = true
    
    try {
      const response = await axios.post('/users', {
        classnum: classroomNumber.value,
        name: name.value
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Success:', response.data)
      setCookiesAndStore(classroomNumber.value, name.value)
      router.push('/problemlist')
      
    } catch (error: any) {
      console.error('Error:', error.response?.data)
      errorMessage.value = error.response?.data?.error || '요청 처리 중 오류가 발생했습니다.'
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(() => {
  checkAuthAndRedirect()
})
</script>

<style scoped>
.main {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 1;
  --v-field-border-width: 2px;
}

:deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
}
</style>