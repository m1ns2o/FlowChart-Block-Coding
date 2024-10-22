<template>
    <div class="main">
      <v-container>
        <div class="aspect-ratio-wrapper">
          <div class="aspect-ratio-container">
            <v-card class="card-menu" elevation="1" rounded="lg" >
              <v-card-title class="text-h5 font-weight-bold indigo--text text--darken-2">문제 리스트</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item 
                    v-for="(problem, index) in problems" 
                    :key="problem.id"
                    @click="navigateToProblem(problem.id)"
                    class="mb-2"
                  >
                    <v-card class="problem-card" elevation="2" :ripple="true">
                      <v-card-text class="d-flex align-center">
                        <span class="problem-number mr-3 indigo--text text--darken-2">{{ index + 1 }}</span>
                        <span class="problem-title">{{ problem.title }}</span>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const problems = ref([
    { id: 1, title: "두 수의 합" },
    { id: 2, title: "배열의 최대값" },
    { id: 3, title: "문자열 뒤집기" },
    { id: 4, title: "이진 탐색" },
    { id: 5, title: "동적 프로그래밍" },
  ])
  
  onMounted(() => {
    // try {
    //     const response = await fetchProblem(route.params.id as string)
    //   } catch (error) {
    //     console.error('Failed to fetch problem:', error)
    //     // 에러 처리 로직 (예: 에러 메시지 표시)
    //   }
  })

  const navigateToProblem = (problemId: number) => {
    router.push(`/problem/${problemId}`)
  }
  </script>
  
  <style scoped>
  .main {
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
  }
  
  .aspect-ratio-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .aspect-ratio-container {
    position: relative;
    width: 100%;
    padding-top: 125%; /* 4:5 비율 */
  }
  
  .card-menu {
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    background-color: #ffffff !important;
    display: flex;
    flex-direction: column;
  }
  
  .problem-card {
    background-color: #f8f8f8 !important;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
  }
  
  .problem-card:hover {
    background-color: #f0f0f0 !important;
    border-left-color: #3f51b5; /* indigo */
  }
  
  .problem-number {
    font-size: 1.2em;
    font-weight: bold;
    min-width: 24px;
    text-align: center;
  }
  
  .problem-title {
    font-size: 1.1em;
    color: #333333;
  }
  </style>