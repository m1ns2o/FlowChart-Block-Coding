<template>
  <v-card elevation="0" class="main">
    <v-tabs v-model="tab" align-tabs="center" color="indigo-darken-2">
      <v-tab value="problem">문제</v-tab>
      <v-tab value="submit">제출</v-tab>
    </v-tabs>
 
    <v-window v-model="tab">
      <!-- 문제 탭 내용 -->
      <v-window-item value="problem">
        <ProblemComponent
          :problem="problemData"
          :classnum="classnum"
          :problem-sorted="problemSorted"
        ></ProblemComponent>
      </v-window-item>
 
      <!-- 제출 탭 내용 -->
      <v-window-item value="submit">
        <Flowchart
          :flowchartComponents="flowchartComponents"
          :problem="problemData"
          :showResult="showResult"
          v-model:canvasItems="canvasItems"
          class="flowchart"
        />
      </v-window-item>
    </v-window>
 
    <!-- 정답/오답 스낵바 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="top"
    >
      {{ snackbar.message }}
      
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
 </template>
 
 <script setup lang="ts">
 import { ref, onMounted, computed } from 'vue'
 import ProblemComponent from '../components/ProblemComponent.vue'
 import axios from 'axios'
 import { useUserStore } from '../stores/user'
 import { storeToRefs } from 'pinia'
 import { useAuthCheck } from '../composables/useAuthCheck'
 import { useProblemStore } from '../stores/problem'
 import { useRoute } from 'vue-router'
 import Flowchart from "../components/Flowchart.vue"
 
 const flowchartComponents = ref([
  { name: "시작", type: "Start" },
  { name: "프로세스", type: "Process" },
  { name: "선택", type: "Decision" },
  { name: "변수", type: "Variable" },
  { name: "입력", type: "Input" },
  { name: "출력", type: "Output" },
  { name: "반복 시작", type: "LoopStart" },
  { name: "반복끝", type: "LoopEnd" },
  { name: "기다리기", type: "Delay" },
 ])
 
 const canvasItems = ref([])
 
 // 스낵바 상태 관리
 const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
 })
 
 // 결과 표시 함수
 const showResult = (isCorrect: boolean) => {
  snackbar.value = {
    show: true,
    message: isCorrect ? '정답입니다! 🎉' : '틀렸습니다. 다시 시도해보세요. 😢',
    color: isCorrect ? 'success' : 'error'
  }
 }
 
 const problemStore = useProblemStore()
 const route = useRoute()
 const id = route.params.id as string
 
 const { checkAuth } = useAuthCheck()
 
 const userStore = useUserStore()
 const tab = ref('problem')
 const { classnum, name } = storeToRefs(userStore)
 const problemData = ref({})
 
 const problems = computed(() => problemStore.getProblemList)
 const problemSorted = computed(() => problems.value.map(problem => problem.id))
 
 onMounted(async () => {
  // 인증 체크
  if (!checkAuth()) return
 
  // 문제 목록 가져오기
  console.log(problemSorted)
  try {
    await getProblemList()
  } catch (error) {
    console.error('문제 목록을 가져오는데 실패했습니다:', error)
  }
  try {
    await getProblemData()
  } catch (error) {
    console.error('문제 데이터를 가져오는데 실패했습니다:', error)
  }
 })
 
 const getProblemList = async () => {
  if (!problemStore.isDataLoaded(classnum.value)) {
    await problemStore.fetchProblems(classnum.value)
  }
 }
 
 const getProblemData = async () => {
  const response = await axios.get(`/problems/${id}`)
  problemData.value = response.data
 }
 </script>
 
 <style scoped>
 .v-tab {
  min-width: 100px;
 }
 .main {
  width: 100vw;
  height: 100vh;
 }
 </style>