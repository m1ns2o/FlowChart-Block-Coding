<template>
  <!-- 전체 컨테이너에 마진 추가 -->
  <v-container class="px-4">
    <v-card class="problem-card mx-auto my-4">
      <!-- 문제 헤더 섹션 -->
      <v-card-item class="bg-indigo-darken-2">
        <v-card-title class="text-h5 text-white d-flex align-center">
          <span class="me-3 problem-id">#{{ idx + 1 }}</span>
          <span>{{ problem.Title }}</span>
        </v-card-title>
      </v-card-item>

      <!-- 문제 내용 섹션 -->
      <v-card-text class="content-section mt-4 px-6">
        <div class="font-weight-bold mb-2" style="font-size: 25px;">문제 설명</div>
        <div class="problem-content text-lg-left" style="font-size: 20px; padding: 3px">
          {{ problem.Content }}
        </div>
      </v-card-text>

      <!-- 테스트케이스 섹션 -->
      <v-card-text class="px-6">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon icon="mdi-test-tube" class="me-2 text-indigo-darken-2"></v-icon>
                입출력 예시
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="pa-4">
                    <div class="text-subtitle-2 font-weight-bold mb-2">
                      <v-icon 
                        icon="mdi-arrow-right-bold-box" 
                        color="indigo-darken-2" 
                        class="me-2"
                      ></v-icon>
                      입력 예시
                    </div>
                    <v-card-text class="bg-indigo-lighten-5 rounded">
                      <pre class="sample-text">{{ problem.TestcaseInput }}</pre>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="pa-4">
                    <div class="text-subtitle-2 font-weight-bold mb-2">
                      <v-icon 
                        icon="mdi-arrow-left-bold-box" 
                        color="indigo-darken-2" 
                        class="me-2"
                      ></v-icon>
                      출력 예시
                    </div>
                    <v-card-text class="bg-indigo-lighten-5 rounded">
                      <pre class="sample-text">{{ problem.TestcaseOutput }}</pre>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <!-- 부가 정보 섹션 -->
      <v-card-text class="px-6">
        <v-chip
          class="me-2"
          color="indigo-darken-2"
          variant="outlined"
        >
          Class ID: {{ classnum }}
        </v-chip>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Problem {
  ID: number;
  Title: string;
  Content: string;
  TestcaseInput: string;
  TestcaseOutput: string;
  ClassID: number;
}

// const idx = computed(() => props.problemSorted?.indexOf(props.problem.ID) ?? -1);
// console.log('problemSorted:', props.problemSorted);
// console.log('problem.ID:', props.problem.ID);
// console.log('type of problem.ID:', typeof props.problem.ID);
// console.log('type of problemSorted elements:', typeof props.problemSorted[0]);

const idx = computed(() => {
  // console.log('Finding index:', props.problemSorted?.indexOf(props.problem.ID));
  // console.log(props.problem.ID)
  // console.log(props.problemSorted)
  return props.problemSorted?.indexOf(props.problem.ID) ?? -1;
});

const props = defineProps<{
  problem: Problem;
  classnum: string;
  problemSorted: number[];
}>();
</script>

<style scoped>
.problem-card {
  border-radius: 8px;
  overflow: hidden;
  max-width: 1200px; /* 최대 너비 설정 */
  width: 100%;
}

.problem-id {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9em;
}

.content-section {
  min-height: 200px;
}

.problem-content {
  line-height: 1.6;
  white-space: pre-wrap;
}

.sample-text {
  font-family: 'Courier New', Courier, monospace;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.v-expansion-panel-title:hover {
  background-color: rgba(63, 81, 181, 0.05);
}
</style>