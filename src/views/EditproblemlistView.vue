<template>
  <div class="main">
    <v-container>
      <div class="aspect-ratio-wrapper">
        <div class="aspect-ratio-container">
          <v-card class="card-menu" elevation="1" rounded="lg">
            <v-card-title
              class="text-h5 font-weight-bold indigo--text text--darken-2 card-title"
            >
              {{ formTitle }}
            </v-card-title>
            <div class="problem-list-container">
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="(problem, index) in problems"
                    :key="problem.id"
                    class="mb-2"
                  >
                    <v-card
                      class="problem-card"
                      elevation="0"
                      outlined
                      @click="navigateToProblem(problem.id)"
                    >
                      <v-card-text
                        class="d-flex align-center justify-space-between"
                      >
                        <div class="d-flex align-center">
                          <span
                            class="problem-number mr-3 indigo--text text--darken-2"
                            >{{ index + 1 }}</span
                          >
                          <span class="problem-title">{{ problem.title }}</span>
                        </div>
                        <div>
                          <v-btn
                            @click="editProblem(problem.id)"
                            @click.stop
                            elevation="0"
                            variant="plain"
                            class="action-btn"
                          >
                            <v-icon left>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            @click="openDeleteDialog(problem.id)"
                            @click.stop
                            elevation="0"
                            variant="plain"
                            class="action-btn"
                            color="red"
                          >
                            <v-icon left>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </div>
            <v-card-actions class="card-actions">
              <v-btn
                block
                class="add-btn"
                color="indigo darken-1"
                elevation="0"
                rounded
                height="42"
                @click="addNewProblem"
              >
                <v-icon left>mdi-plus</v-icon> 새 문제 추가
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-container>

    <!-- Floating 클래스 삭제 버튼 -->
    <v-btn
      class="floating-delete-btn"
      color="white"
      fab
      size="large"
      elevation="4"
      @click="openClassDeleteDialog"
    >
      <v-icon size="24" color="red darken-1">mdi-delete</v-icon>
      <!-- 아이콘 색상을 빨간색으로 변경 -->
    </v-btn>

    <!-- 문제 삭제 확인 다이얼로그 -->
    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title class="text-h5">확인</v-card-title>
        <v-card-text>이 문제를 삭제하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="closeDeleteDialog">취소</v-btn>
          <v-btn color="red darken-1" @click="deleteProblem">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 클래스 삭제 확인 다이얼로그 -->
    <v-dialog v-model="classDeleteDialog" max-width="300px">
      <v-card>
        <v-card-title class="text-h5">클래스 삭제</v-card-title>
        <v-card-text>이 클래스를 삭제하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="closeClassDeleteDialog"
            >취소</v-btn
          >
          <v-btn color="red darken-1" @click="deleteClass">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  // Problem 인터페이스 정의
  interface Problem {
    id: number;
    title: string;
  }

  interface ProblemResponse {
    ID: number;
    Title: string;
  }

  interface ClassResponse {
    Problems: ProblemResponse[];
  }

  const router = useRouter();
  // problems ref에 타입 지정
  const problems = ref<Problem[]>([]);
  const deleteDialog = ref(false);
  const classDeleteDialog = ref(false);
  const editedIndex = ref(-1);
  const deletingItemId = ref(0);

  const formTitle = computed(() => {
    return editedIndex.value === -1 ? '새 문제 추가' : '문제 수정';
  });

  onMounted(() => {
    console.log(axios.defaults.headers.common['Authorization']);
    getProblemlist();
  });

  const getProblemlist = async () => {
    const class_id = localStorage.getItem('class_id');
    const response = await axios.get<ClassResponse>(`classes/${class_id}`);
    console.log(response.data);
    problems.value = response.data.Problems.map((problem: ProblemResponse) => ({
      id: problem.ID,
      title: problem.Title,
    }));
  };

  const navigateToProblem = (problemId: number) => {
    router.push(`/problem/${problemId}/solved`);
  };

  const addNewProblem = () => {
    router.push('/editproblem');
  };

  const editProblem = (problemId: number) => {
    router.push(`/editproblem/${problemId}`);
  };

  const openDeleteDialog = (id: number) => {
    deletingItemId.value = id;
    deleteDialog.value = true;
  };

  const closeDeleteDialog = () => {
    deleteDialog.value = false;
    deletingItemId.value = 0;
  };

  const deleteProblem = async () => {
    const index = problems.value.findIndex(
      (problem) => problem.id === deletingItemId.value
    );
    if (index !== -1) {
      problems.value.splice(index, 1);
      await axios.delete(`problems/${deletingItemId.value}`);
    }
    closeDeleteDialog();
  };

  const openClassDeleteDialog = () => {
    classDeleteDialog.value = true;
  };

  const closeClassDeleteDialog = () => {
    classDeleteDialog.value = false;
  };

  const deleteClass = async () => {
    try {
      const class_id = localStorage.getItem('class_id');
      await axios.delete(`classes/${class_id}`);
      localStorage.clear();
      router.push('/class');
    } catch (error) {
      console.error('클래스 삭제 중 오류 발생:', error);
    } finally {
      closeClassDeleteDialog();
    }
  };
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

  .card-actions {
    position: sticky;
    bottom: 0;
    background-color: #ffffff;
    padding: 16px;
    border-top: 1px solid #e0e0e0;
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

  .action-btn {
    width: 30px !important;
    min-width: 24px !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .add-btn {
    font-weight: 500 !important;
    text-transform: none !important;
    letter-spacing: 0.0125em !important;
    background-color: rgba(63, 81, 181, 0.04) !important;
  }

  /* Floating 버튼 스타일 */
  .floating-delete-btn {
    position: fixed !important;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    border-radius: 50% !important;
    aspect-ratio: 1 !important; /* 가로 세로 비율 1:1로 강제 */
    min-width: 56px !important; /* 최소 너비 지정 */
    min-height: 56px !important; /* 최소 높이 지정 */
    width: 56px !important; /* 너비 고정 */
    height: 56px !important; /* 높이 고정 */
  }
</style>
