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
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'; 
  import { useUserStore } from '../stores/user'
  import { storeToRefs } from 'pinia'
  import { useAuthCheck } from '../composables/useAuthCheck'
  import { useProblemStore } from '../stores/problem'

  const { checkAuth } = useAuthCheck()

  const problemStore = useProblemStore()
  const userStore = useUserStore()
  const { classnum, name } = storeToRefs(userStore)
  const router = useRouter()
  // const problems = ref([])

  const getProblemList = async () => {
  // store에 데이터가 없을 때만 fetch
  if (!problemStore.isDataLoaded(classnum.value)) {
    await problemStore.fetchProblems(classnum.value)
  }
}

  onMounted(async () => {
    // 인증 체크
    if (!checkAuth()) return

    // 문제 목록 가져오기
    try {
      await getProblemList()
    } catch (error) {
      console.error('문제 목록을 가져오는데 실패했습니다:', error)
    }
  })


// const getProblemlist = async () => {
//   try {
//     const response = await axios.get(`classes/number/${classnum.value}`)
//     console.log('API 응답:', response.data)
    
//     problems.value = response.data.Problems.map((problem: { ID: number; Title: string; }) => ({
//       id: problem.ID,
//       title: problem.Title
//     }))
//   } catch (error) {
//     console.error('문제 목록 가져오기 실패:', error)
//     throw error
//   }
// }


// store에서 문제 목록 가져오기
const problems = computed(() => problemStore.getProblemList)

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