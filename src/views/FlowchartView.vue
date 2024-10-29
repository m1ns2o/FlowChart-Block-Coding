<template>
  <Flowchart
    :flowchartComponents="flowchartComponents"
    v-model:canvasItems="canvasItems"
    class="flowchart"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  // import { useRouter } from "vue-router";
  import Flowchart from '../components/Flowchart.vue';

  // const router = useRouter();

  const flowchartComponents = ref([
    { name: '시작', type: 'Start' },
    { name: '프로세스', type: 'Process' },
    { name: '선택', type: 'Decision' },
    { name: '변수', type: 'Variable' },
    { name: '입력', type: 'Input' },
    { name: '출력', type: 'Output' },
    { name: '반복 시작', type: 'LoopStart' },
    { name: '반복끝', type: 'LoopEnd' },
    { name: '기다리기', type: 'Delay' },
  ]);
  const canvasItems = ref([]);
</script>

<style scoped>
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .flowchart {
    height: 100%;
    width: 100%;
  }
</style>
