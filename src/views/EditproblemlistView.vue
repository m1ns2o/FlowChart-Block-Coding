<template>
    <div class="main">
      <v-container>
        <div class="aspect-ratio-wrapper">
          <div class="aspect-ratio-container">
            <v-card class="card-menu" elevation="3">
              <v-card-title class="text-h5 font-weight-bold indigo--text text--darken-2">
                문제 리스트
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item 
                    v-for="(problem, index) in problems" 
                    :key="problem.id"
                    class="mb-2"
                  >
                    <v-card class="problem-card" elevation="0" outlined>
                      <v-card-text class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center" @click="navigateToProblem(problem.id)">
                          <span class="problem-number mr-3 indigo--text text--darken-2">{{ index + 1 }}</span>
                          <span class="problem-title">{{ problem.title }}</span>
                        </div>
                        <div>
                          <!-- 수정 버튼 -->
                          <!-- <v-btn @click="editProblem(problem)" elevation="0" variant="plain" class="action-btn">
                            <v-icon left>mdi-pencil</v-icon> 
                          </v-btn> -->
                          <!-- 삭제 버튼 -->
                          <v-btn @click="openDeleteDialog(problem.id)" elevation="0" variant="plain" class="action-btn" color="red">
                            <v-icon left>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="indigo" text @click="addNewProblem">
                  <v-icon left>mdi-plus</v-icon> 새 문제 추가
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </v-container>
  
      <!-- 문제 추가/수정 다이얼로그 -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="editedItem.title" label="문제 제목"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEditDialog">취소</v-btn>
            <v-btn color="blue darken-1" text @click="save">저장</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- 삭제 확인 다이얼로그 -->
      <v-dialog v-model="deleteDialog" max-width="300px">
        <v-card>
          <v-card-title class="text-h5">확인</v-card-title>
          <v-card-text>이 문제를 삭제하시겠습니까?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDeleteDialog">취소</v-btn>
            <v-btn color="red darken-1" text @click="deleteProblem">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const problems = ref([
    { id: 1, title: "두 수의 합" },
    { id: 2, title: "배열의 최대값" },
    { id: 3, title: "문자열 뒤집기" },
    { id: 4, title: "이진 탐색" },
    { id: 5, title: "동적 프로그래밍" },
  ])
  
  const editDialog = ref(false)
  const deleteDialog = ref(false)
  const editedIndex = ref(-1)
  const editedItem = ref({ id: 0, title: '' })
  const deletingItemId = ref(0)
  
  const formTitle = computed(() => {
    return editedIndex.value === -1 ? '새 문제 추가' : '문제 수정'
  })
  
  const navigateToProblem = (problemId: number) => {
    router.push(`/problem/${problemId}`)
  }
  
  const addNewProblem = () => {
    editedIndex.value = -1
    editedItem.value = { id: 0, title: '' }
    editDialog.value = true
  }
  
  const editProblem = (item: { id: number; title: string }) => {
    editedIndex.value = problems.value.findIndex(problem => problem.id === item.id)
    editedItem.value = Object.assign({}, item)
    editDialog.value = true
  }
  
  const openDeleteDialog = (id: number) => {
    deletingItemId.value = id
    deleteDialog.value = true
  }
  
  const closeEditDialog = () => {
    editDialog.value = false
    editedItem.value = { id: 0, title: '' }
    editedIndex.value = -1
  }
  
  const closeDeleteDialog = () => {
    deleteDialog.value = false
    deletingItemId.value = 0
  }
  
  const save = () => {
    if (editedIndex.value > -1) {
      Object.assign(problems.value[editedIndex.value], editedItem.value)
    } else {
      editedItem.value.id = Math.max(...problems.value.map(p => p.id)) + 1
      problems.value.push(editedItem.value)
    }
    closeEditDialog()
  }
  
  const deleteProblem = () => {
    const index = problems.value.findIndex(problem => problem.id === deletingItemId.value)
    problems.value.splice(index, 1)
    closeDeleteDialog()
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
  
  /* 수정 및 삭제 버튼의 크기를 조정 */
  .action-btn {
    width: 30px !important;
    min-width: 24px !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  </style>
  