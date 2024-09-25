<template>
  <div style="width: 100vw; height: 100vh;">
    <Flowchart
    :flowchartComponents="flowchartComponents"
    v-model:canvasItems="canvasItems"
    class="flowchart"
  />
  </div>
  <!-- <div class="debug-info">
    <h3>디버그 정보:</h3>
    <p>컴포넌트 수: {{ flowchartComponents.length }}</p>
    <p>캔버스 아이템 수: {{ canvasItems.length }}</p>
    <p>연결선 수: {{ connections }}</p>
  </div> -->
</template>

<script setup>
import { ref, computed } from 'vue'
import Flowchart from './components/Flowchart.vue'

const flowchartComponents = ref([
  { name: '시작', type: 'Start' },
  { name: '프로세스', type: 'Process' },
  { name: '결정', type: 'Decision' },
  { name: '종료', type: 'End' },
  { name: '변수', type: 'Variable' },
  { name: '입력', type: 'Input' },
  { name: '출력', type: 'Output' },
])

const canvasItems = ref([])

const connections = computed(() => {
  return canvasItems.value.length > 1 ? canvasItems.value.length - 1 : 0
})
</script>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  /* overflow: hidden; */
}

.flowchart {
  height: 100%;
  width: 100%;
}
</style>
