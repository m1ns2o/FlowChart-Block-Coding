<template>
  <div class="main">
    <v-container>
      <div class="aspect-ratio-wrapper">
        <div class="aspect-ratio-container">
          <v-card class="card-menu" elevation="1" rounded="lg">
            <v-card-title class="text-h5 font-weight-bold indigo--text text--darken-2 card-title">문제 리스트</v-card-title>
            <div class="problem-list-container">
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
            </div>
          </v-card>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'
import { useAuthCheck } from '../composables/useAuthCheck'
import { useProblemStore } from '../stores/problem'

const { checkAuth } = useAuthCheck()

const problemStore = useProblemStore()
const userStore = useUserStore()
const { classnum, name } = storeToRefs(userStore)
const router = useRouter()

const getProblemList = async () => {
  if (!problemStore.isDataLoaded(classnum.value)) {
    await problemStore.fetchProblems(classnum.value)
  }
}

onMounted(async () => {
  if (!checkAuth()) return

  try {
    await getProblemList()
  } catch (error) {
    console.error('문제 목록을 가져오는데 실패했습니다:', error)
  }
})

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
  max-width: 1200px; /* 최대 너비 설정 */
  /* width: 100%; */
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
  background-color: #ffffff !important;
  display: flex;
  flex-direction: column;
}

.card-title {
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 1;
  padding: 16px;
}

.problem-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
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