<template>
  <div class="main">
    <v-container>
      <div class="aspect-ratio-wrapper">
        <div class="aspect-ratio-container">
          <v-card class="card-content" elevation="1" rounded="lg">
            <!-- 상단 고정 타이틀 -->
            <v-card-title
              class="text-h5 font-weight-bold indigo--text text--darken-2 card-title"
            >
              <div>
                <div>문제 해결 현황</div>
                <v-chip
                  class="ml-2"
                  :color="solvedUsers.length > 0 ? 'success' : 'grey'"
                  small
                >
                  {{ solvedUsers.length }}/{{ totalStudents }}명 해결
                </v-chip>
              </div>
            </v-card-title>

            <!-- 스크롤 가능한 내용 영역 -->
            <div class="problem-list-container">
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
                      :class="{ solved: isUserSolved(user.Name) }"
                    >
                      <v-card-text
                        class="d-flex align-center justify-space-between"
                      >
                        <div class="d-flex align-center">
                          <v-avatar
                            :color="
                              isUserSolved(user.Name) ? 'success' : 'grey'
                            "
                            size="36"
                            class="mr-3 white--text"
                          >
                            {{ user.Name.charAt(0).toUpperCase() }}
                          </v-avatar>
                          <div class="user-info">
                            <div class="user-name" style="text-align: left">
                              {{ user.Name }}
                            </div>
                            <div
                              class="user-class text-caption"
                              style="text-align: left"
                            >
                              {{ user.Classnum }}
                            </div>
                          </div>
                        </div>
                        <div class="d-flex flex-column align-end">
                          <v-chip
                            v-if="isUserSolved(user.Name)"
                            color="success"
                            small
                            class="mb-1"
                          >
                            해결완료
                          </v-chip>
                          <v-chip v-else color="grey" small class="mb-1">
                            미해결
                          </v-chip>
                          <div
                            class="solved-time text-caption"
                            v-if="isUserSolved(user.Name)"
                          >
                            {{ formatDate(getUserSolvedTime(user.Name)) }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </div>

            <!-- 하단 고정 버튼 -->
            <v-card-actions class="action-footer pa-4">
              <v-btn
                class="action-button"
                color="indigo darken-1"
                elevation="0"
                rounded
                height="42"
                block
                @click="goBack"
              >
                <v-icon left>{{ icons.arrowLeft }}</v-icon>
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
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  import { icons } from '../plugins/icons';

  const router = useRouter();
  const route = useRoute();

  interface Problem {
    ID: number;
    Title: string;
    Content: string;
    TestcaseInput: string;
    TestcaseOutput: string;
    ClassID: number;
  }

  interface ClassUser {
    ID: number;
    Name: string;
    Classnum: string;
  }

  interface SolvedUser {
    userId: number;
    userName: string;
    classnum: string;
    solvedAt: string;
  }

  const currentProblem = ref<Problem>({
    ID: 0,
    Title: '',
    Content: '',
    TestcaseInput: '',
    TestcaseOutput: '',
    ClassID: 0,
  });

  const solvedUsers = ref<SolvedUser[]>([]);
  const allUsers = ref<ClassUser[]>([]);
  const problemId = route.params.id;
  const pollingInterval = ref<number | null>(null);

  // 총 학생 수
  const totalStudents = computed(() => {
    return allUsers.value.length;
  });

  // 사용자가 문제를 해결했는지 확인하는 함수
  const isUserSolved = (userName: string) => {
    return solvedUsers.value.some((user) => user.userName === userName);
  };

  const getUserSolvedTime = (userName: string) => {
    const user = solvedUsers.value.find((user) => user.userName === userName);
    return user ? user.solvedAt : '';
  };

  // Polling 시작 함수
  //   const startPolling = () => {
  //     stopPolling() // 기존 polling이 있다면 중지
  //     pollingInterval.value = window.setInterval(async () => {
  //       await getSolvedUsers()
  //     }, 3000) // 1초마다 갱신
  //   }
  // Polling 시작 함수 수정
  const startPolling = () => {
    stopPolling(); // 기존 polling이 있다면 중지
    pollingInterval.value = window.setInterval(async () => {
      // 두 함수를 Promise.all로 동시에 실행
      await Promise.all([getAllUsers(), getSolvedUsers()]);
    }, 1000); // 1초마다 갱신
  };

  // getAllUsers 함수 에러 처리 개선
  const getAllUsers = async () => {
    try {
      const classnum = localStorage.getItem('classnum');
      if (!classnum) {
        console.error('Classnum not found in localStorage');
        return;
      }

      const response = await axios.get(`/users/class/${classnum}`);
      if (response.data && response.data.users) {
        allUsers.value = response.data.users;
        console.log('All Users updated:', allUsers.value);
      }
    } catch (error) {
      console.error('All users fetch error:', error);
      // 에러 발생시 기존 데이터 유지
      // allUsers.value = [] // 이 라인 제거
    }
  };

  // getSolvedUsers 함수 에러 처리 개선
  const getSolvedUsers = async () => {
    try {
      const response = await axios.get(`/solve/problem/${problemId}`);
      if (response.data && response.data.success) {
        solvedUsers.value = response.data.data.solvedUsers || [];
        console.log('Solved Users updated:', solvedUsers.value);
      }
    } catch (error) {
      console.error('Solved users fetch error:', error);
      // 에러 발생시 기존 데이터 유지
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로딩
  onMounted(async () => {
    try {
      await Promise.all([
        getProblemDetail(problemId as string),
        getAllUsers(),
        getSolvedUsers(),
      ]);
      startPolling();
    } catch (error) {
      console.error('Initial data loading error:', error);
    }
  });

  // Polling 중지 함수
  const stopPolling = () => {
    if (pollingInterval.value !== null) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
  };

  //   onMounted(async () => {
  //     await Promise.all([
  //       getProblemDetail(problemId as string),
  //       getAllUsers(),
  //       getSolvedUsers()
  //     ])
  //     startPolling()
  //   })

  onUnmounted(() => {
    stopPolling();
  });

  const getProblemDetail = async (problemId: string) => {
    try {
      const response = await axios.get(`/solve/problem/${problemId}`);
      currentProblem.value = response.data;
    } catch (error) {
      console.error('Problem detail fetch error:', error);
    }
  };

  //   const getAllUsers = async () => {
  //     try {
  //       const classnum = localStorage.getItem('classnum')
  //       const response = await axios.get(`/users/class/${classnum}`)
  //       if (response.data && response.data.users) {
  //         allUsers.value = response.data.users
  //       }
  //     } catch (error) {
  //       console.error('All users fetch error:', error)
  //       allUsers.value = []
  //     }
  //   }

  //   const getSolvedUsers = async () => {
  //     try {
  //       const response = await axios.get(`/solve/problem/${problemId}`)
  //       if (response.data && response.data.success) {
  //         solvedUsers.value = response.data.data.solvedUsers || []
  //         console.log(solvedUsers.value)
  //       }
  //     } catch (error) {
  //       console.error('Solved users fetch error:', error)
  //     }
  //   }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const goBack = () => {
    router.back();
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

  .card-content {
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
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .action-footer {
    background-color: white;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;
  }

  .action-button {
    font-weight: 500 !important;
    text-transform: none !important;
    letter-spacing: 0.0125em !important;
    background-color: rgba(63, 81, 181, 0.04) !important;
  }

  .action-button:hover {
    background-color: rgba(63, 81, 181, 0.08) !important;
  }

  .solved-card {
    background-color: #f8f8f8 !important;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
  }

  .solved-card.solved {
    border-left-color: #4caf50;
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

  /* 스크롤바 스타일링 */
  .problem-list-container::-webkit-scrollbar {
    width: 8px;
  }

  .problem-list-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .problem-list-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .problem-list-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
