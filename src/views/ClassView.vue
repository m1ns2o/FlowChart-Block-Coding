<template>
  <div class="main">
    <v-overlay
      :model-value="initialLoading"
      persistent
      class="d-flex align-center justify-center"
      scrim="#f5f5f5"
    >
      <v-progress-circular
        color="indigo"
        indeterminate
        size="64"
        width="6"
      ></v-progress-circular>
    </v-overlay>

    <template v-if="!initialLoading">
      <v-container class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-sheet class="pa-6" rounded="lg" elevation="1">
              <v-form @submit.prevent="submitForm" v-model="formValid">
                <v-text-field
                  v-model="classroomNumber"
                  :rules="classroomRules"
                  label="클래스룸 번호"
                  required
                  variant="outlined"
                  bg-color="white"
                  color="indigo"
                  label-color="indigo-darken-2"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="비밀번호"
                  required
                  variant="outlined"
                  bg-color="white"
                  color="indigo"
                  label-color="indigo-darken-2"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
                <v-btn
                  class="mt-4"
                  type="submit"
                  block
                  color="indigo"
                  :disabled="!formValid || isLoading"
                  :loading="isLoading"
                >
                  입장
                </v-btn>
              </v-form>
              <v-snackbar
                v-model="showError"
                color="error"
                timeout="3000"
                location="top"
              >
                {{ errorMessage }}
              </v-snackbar>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  const initialLoading = ref(true);
  const formValid = ref(false);
  const classroomNumber = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const isLoading = ref(false);
  const showError = ref(false);
  const errorMessage = ref('');

  const router = useRouter();

  const classroomRules = [(v: string) => !!v || '클래스룸 번호는 필수입니다.'];

  const passwordRules = [
    (v: string) => !!v || '비밀번호를 입력해주세요.',
    (v: string) => v.length >= 8 || '비밀번호는 최소 8자 이상이어야 합니다.',
  ];

  const hasToken = (): boolean => {
    return !!localStorage.getItem('token');
  };

  const checkAuthAndRedirect = async () => {
    try {
      if (hasToken()) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await router.push('/editproblemlist');
      }
    } catch (error) {
      console.error('Redirection error:', error);
    } finally {
      // 1초 후에 로딩 상태를 해제하여 로딩 애니메이션이 보이도록 함
      setTimeout(() => {
        initialLoading.value = false;
      }, 500);
    }
  };

  const submitForm = async () => {
    if (formValid.value) {
      isLoading.value = true;

      try {
        const response = await axios.post('classes', {
          Classnum: classroomNumber.value,
          Passwd: password.value,
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          axios.defaults.headers.common[
            'Authorization'
          ] = `${response.data.token}`;

          localStorage.setItem('class_id', response.data.id);
          localStorage.setItem('classnum', response.data.classnum);

          console.log('Login successful:', response.data);
          router.push('/editproblemlist');
        } else {
          throw new Error('토큰이 없습니다.');
        }
      } catch (error: any) {
        console.error('Login failed:', error);
        errorMessage.value =
          error.response?.data?.error || '로그인에 실패했습니다.';
        showError.value = true;
      } finally {
        isLoading.value = false;
      }
    }
  };

  // onBeforeMount 대신 onMounted 사용
  onMounted(() => {
    checkAuthAndRedirect();
  });
</script>

<style scoped>
  .main {
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
  }

  :deep(.v-field__outline) {
    --v-field-border-opacity: 1;
    --v-field-border-width: 2px;
  }

  :deep(.v-field--focused .v-field__outline) {
    --v-field-border-opacity: 1;
  }
</style>
