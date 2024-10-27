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
          :idx="idx"
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
import { ref, onMounted, computed, watch } from 'vue'
import ProblemComponent from '../components/ProblemComponent.vue'
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'
import { useAuthCheck } from '../composables/useAuthCheck'
import { useProblemStore } from '../stores/problem'
import { useRoute, useRouter } from 'vue-router'
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

const route = useRoute()
const router = useRouter()
const problemStore = useProblemStore()
const userStore = useUserStore()

const { classnum, name } = storeToRefs(userStore)
const { checkAuth } = useAuthCheck()

const tab = ref('problem')
const problemData = ref({})
const canvasItems = ref([])

const problems = computed(() => problemStore.getProblemList)
const problemSorted = computed(() => problems.value.map(problem => problem.id))
const idx = computed(() => problemSorted.value.indexOf(Number(route.params.id)) ?? -1)

// 스낵바 상태 관리
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// 문제 데이터 초기화 함수
const initializeProblem = async () => {
  if (!checkAuth()) return
  
  try {
    if (!problemStore.isDataLoaded(classnum.value)) {
      await problemStore.fetchProblems(classnum.value)
    }
    await getProblemData()
  } catch (error) {
    console.error('문제 데이터 초기화 실패:', error)
  }
}

// 문제 데이터 가져오기
const getProblemData = async () => {
  const response = await axios.get(`/problems/${route.params.id}`)
  problemData.value = response.data
  canvasItems.value = [] // 캔버스 초기화
  tab.value = 'problem' // 탭 초기화
}

// 결과 표시 및 라우팅 처리
const showResult = async (isCorrect: boolean) => {
  snackbar.value = {
    show: true,
    message: isCorrect ? '정답입니다! 🎉' : '틀렸습니다. 다시 시도해보세요. 😢',
    color: isCorrect ? 'success' : 'error'
  }

  if (isCorrect) {
    const nextProblemId = problemSorted.value[idx.value + 1]
    if (nextProblemId) {
      await router.replace(`${nextProblemId}`)
    }
    else{
      snackbar.value.message = '모든 문제를 해결했습니다! 🎉'
      snackbar.value.color ='success'
      // router.push('/problemlist')
    }
  }
}

// 라우트 파라미터 변경 감지
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await initializeProblem()
    }
  }
)

onMounted(initializeProblem)
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