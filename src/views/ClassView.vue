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
                v-model="password"
                :rules="passwordRules"
                label="비밀번호"
                required
                variant="outlined"
                bg-color="white"
                color="indigo"
                label-color="indigo-darken-2"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const formValid = ref(false)
const classroomNumber = ref('')
const password = ref('')
const showPassword = ref(false)

const router = useRouter()

const classroomRules = [
  (v: string) => !!v || '클래스룸 번호는 필수입니다.',
  (v: string) => /^\d+$/.test(v) || '클래스룸 번호는 숫자만 입력 가능합니다.'
]

const passwordRules = [
  (v: string) => !!v || '비밀번호를 입력해주세요.',
  (v: string) => v.length >= 8 || '비밀번호는 최소 8자 이상이어야 합니다.'
]

const submitForm = () => {
  if (formValid.value) {
    console.log('Form submitted:', { classroomNumber: classroomNumber.value, password: password.value })
    router.push(`/editproblemlist`)
  }
}
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