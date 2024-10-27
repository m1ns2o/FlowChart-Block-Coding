<template>
    <div class="main">
      <v-container>
        <div class="aspect-ratio-wrapper">
          <div class="aspect-ratio-container">
            <v-card class="card-menu" elevation="1" rounded="lg">
              <!-- <v-card-title class="text-h5 font-weight-bold indigo--text text--darken-2"> -->
                <v-card-title class="text-h5 font-weight-bold indigo--text text--darken-2 d-flex flex-column align-center" 
                    >
                문제 해결 현황
                <v-chip
                  class="ml-2"
                  :color="getTotalSolvedCount > 0 ? 'success' : 'grey'"
                  small
                  style="margin-top: 5px;"
                >
                  {{ getTotalSolvedCount }}/{{ totalStudents }}명 해결
                </v-chip>
              </v-card-title>
              
              <v-card-text>
                <v-list>
                  <v-list-item 
                    v-for="user in allUsers" 
                    :key="user.ID"
                    class="mb-2"
                  >
                    <v-card 
                      class="solved-card" 
                      elevation="0" 
                      outlined
                      :class="{ 'solved': isUserSolved(user.ID) }"
                    >
                      <v-card-text class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                          <v-avatar
                            :color="isUserSolved(user.ID) ? 'success' : 'grey'"
                            size="36"
                            class="mr-3 white--text"
                          >
                            {{ user.Name.charAt(0).toUpperCase() }}
                          </v-avatar>
                          <div class="user-info">
                            <div class="user-name">{{ user.Name }}</div>
                            <div class="user-class text-caption">{{ user.Classnum }}</div>
                          </div>
                        </div>
                        <div class="d-flex flex-column align-end">
                          <v-chip
                            v-if="isUserSolved(user.ID)"
                            color="success"
                            small
                            class="mb-1"
                          >
                            해결완료
                          </v-chip>
                          <v-chip
                            v-else
                            color="grey"
                            small
                            class="mb-1"
                          >
                            미해결
                          </v-chip>
                          <div class="solved-time text-caption" v-if="isUserSolved(user.ID)">
                            {{ formatDate(getUserSolvedTime(user.ID)) }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-card-text>
  
              <v-card-actions class="pa-4">
                <v-btn
                  block
                  color="indigo"
                  @click="goBack"
                  elevation="2"
                >
                  <v-icon left>mdi-arrow-left</v-icon>
                  문제 목록으로 돌아가기
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const route = useRoute()
  
  interface Problem {
    ID: number
    Title: string
    Content: string
    TestcaseInput: string
    TestcaseOutput: string
    ClassID: number
  }
  
  interface ClassUser {
    ID: number
    Name: string
    Classnum: string
  }
  
  interface ClassResponse {
    classnum: string
    users: ClassUser[]
  }
  
  interface SolvedUser {
    userId: number
    userName: string
    classnum: string
    solvedAt: string
  }
  
  const currentProblem = ref<Problem>({
    ID: 0,
    Title: '',
    Content: '',
    TestcaseInput: '',
    TestcaseOutput: '',
    ClassID: 0
  })
  
  const solvedUsers = ref<SolvedUser[]>([])
  const allUsers = ref<ClassUser[]>([])
  const problemId = route.params.id
  
  // 총 학생 수
  const totalStudents = computed(() => {
    return allUsers.value.length
  })
  
  // 중복 제거된 해결한 사용자 목록
  const uniqueSolvedUsers = computed(() => {
    const userMap = new Map<number, SolvedUser>()
    solvedUsers.value.forEach(user => {
      if (!userMap.has(user.userId) || 
          new Date(user.solvedAt) > new Date(userMap.get(user.userId)!.solvedAt)) {
        userMap.set(user.userId, user)
      }
    })
    return Array.from(userMap.values())
  })
  
  // 총 해결한 학생 수
  const getTotalSolvedCount = computed(() => {
    return uniqueSolvedUsers.value.length
  })
  
  // 사용자가 문제를 해결했는지 확인하는 함수
  const isUserSolved = (userId: number) => {
    return uniqueSolvedUsers.value.some(user => user.userId === userId)
  }
  
  // 사용자의 해결 시간을 반환하는 함수
  const getUserSolvedTime = (userId: number) => {
    const user = uniqueSolvedUsers.value.find(user => user.userId === userId)
    return user ? user.solvedAt : ''
  }
  
  onMounted(async () => {
    await Promise.all([
      getProblemDetail(problemId as string),
      getAllUsers(),
      getSolvedUsers("1")
    ])
  })
  
  const getProblemDetail = async (problemId: string) => {
    try {
      const response = await axios.get(`/solve/problem/${problemId}`)
      currentProblem.value = response.data
    } catch (error) {
      console.error('Problem detail fetch error:', error)
    }
  }
  
  const getAllUsers = async () => {
    try {
      const classnum = localStorage.getItem('classnum')
      const response = await axios.get(`/users/class/${classnum}`)
      if (response.data && response.data.users) {
        allUsers.value = response.data.users
      } else {
        allUsers.value = []
        console.error('Failed to fetch users:', response.data)
      }
    } catch (error) {
      console.error('All users fetch error:', error)
      allUsers.value = []
    }
  }
  
  const getSolvedUsers = async (classId: string) => {
    try {
      const response = await axios.get(`/solve/problem/${problemId}`)
      if (response.data && response.data.success) {
        solvedUsers.value = response.data.data.solvedUsers || []
      } else {
        solvedUsers.value = []
        console.error('Failed to fetch solved users:', response.data)
      }
    } catch (error) {
      console.error('Solved users fetch error:', error)
      solvedUsers.value = []
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const goBack = () => {
    router.back()
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
    padding-top: 125%;
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
  
  .solved-card {
    background-color: #f8f8f8 !important;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
  }
  
  .solved-card.solved {
    border-left-color: #4CAF50; /* success color */
  }
  
  .solved-card:hover {
    background-color: #f0f0f0 !important;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
  }
  
  .user-name {
    font-weight: 500;
    color: #333333;
  }
  
  .user-class {
    color: #666666;
  }
  
  .solved-time {
    color: #666666;
  }
  </style>