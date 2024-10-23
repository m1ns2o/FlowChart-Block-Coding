<template>
    <div class="main">
      <v-container class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8">
            <v-sheet class="pa-6" rounded="lg" elevation="1">
              <h2 class="mb-4">{{ isEditMode ? '문제 수정' : '문제 추가' }}</h2>
              <v-form @submit.prevent="submitForm" v-model="formValid">
                <v-text-field
                  v-model="title"
                  :rules="titleRules"
                  label="제목"
                  required
                  variant="outlined"
                  bg-color="white"
                  color="indigo"
                  label-color="indigo-darken-2"
                ></v-text-field>
                <v-textarea
                  v-model="content"
                  :rules="contentRules"
                  label="본문"
                  required
                  variant="outlined"
                  bg-color="white"
                  color="indigo"
                  label-color="indigo-darken-2"
                  rows="8"
                ></v-textarea>
                <v-textarea
                  v-model="testInput"
                  :rules="testCaseRules"
                  label="테스트 케이스 입력"
                  required
                  variant="outlined"
                  bg-color="white"
                  color="indigo"
                  label-color="indigo-darken-2"
                  rows="1"
                ></v-textarea>
                <v-textarea
                  v-model="testOutput"
                  :rules="testCaseRules"
                  label="테스트 케이스 출력"
                  required
                  variant="outlined"
                  bg-color="white"
                  color="indigo"
                  label-color="indigo-darken-2"
                  rows="1"
                ></v-textarea>
                <v-btn 
                  class="mt-4" 
                  type="submit" 
                  block 
                  color="indigo"
                  :disabled="!formValid"
                >
                  {{ isEditMode ? '수정' : '생성' }}
                </v-btn>
              </v-form>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios';
  
  const formValid = ref(false)
  const title = ref('')
  const content = ref('')
  const testInput = ref('')
  const testOutput = ref('')
  
  const route = useRoute()
  const router = useRouter()
  
  const isEditMode = computed(() => !!route.params.id)
  const id = route.params.id as string
  
  const titleRules = [
    (v: string) => !!v || '제목을 입력해주세요.',
    (v: string) => v.length <= 100 || '제목은 100자 이내로 입력해주세요.'
  ]
  
  const contentRules = [
    (v: string) => !!v || '본문을 입력해주세요.',
    (v: string) => v.length <= 1000 || '본문은 1000자 이내로 입력해주세요.'
  ]
  
  const testCaseRules = [
    (v: string) => !!v || '테스트 케이스를 입력해주세요.',
    (v: string) => v.length <= 500 || '테스트 케이스는 500자 이내로 입력해주세요.'
  ]
  
  onMounted(async () => {
    if (isEditMode.value) {
      // API를 통해 문제 데이터를 불러오는 로직
      try {
        const response = await axios.get(`problems/${id}`)
        title.value = response.data.Title
        content.value = response.data.Content
        testInput.value = response.data.TestcaseInput
        testOutput.value = response.data.TestcaseOutput
        console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch problem:', error)
        // 에러 처리 로직 (예: 에러 메시지 표시)
      }
    }
  })
  
  const submitForm = async () => {
    if (formValid.value) {
      // const problemData = {
      //   Title: title.value,
      //   Content: content.value,
      //   TestcaseInput: testInput.value,
      //   TestcaseOutput: testOutput.value
      // }
      try {
        if (isEditMode.value) {
          const problemData = {
            Title: title.value,
            Content: content.value,
            TestcaseInput: testInput.value,
            TestcaseOutput: testOutput.value
          }
          await axios.put(`problems/${id}`, problemData)
        } else {
          const ClassID = await localStorage.getItem('class_id')
          console.log(ClassID)
          const problemData = {
            Title: title.value,
            Content: content.value,
            TestcaseInput: testInput.value,
            TestcaseOutput: testOutput.value,
            ClassID : Number(ClassID)
          }
          await axios.post(`problems`, problemData)
        }
        // 성공 메시지 표시 및 리다이렉트
        router.push('/problems')
      } catch (error) {
        console.error('Failed to submit form:', error)
        // 에러 처리 로직 (예: 에러 메시지 표시)
      }
    }
  }
  
  // API 호출 함수 (실제 구현은 별도로 해야 함)
  // const fetchProblem = async (id: string) => {
  //   // API 호출 로직
  // }
  
  // const createProblem = async (data: any) => {
  //   // API 호출 로직
  // }
  
  // const updateProblem = async (id: string, data: any) => {
  //   // API 호출 로직
  // }
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