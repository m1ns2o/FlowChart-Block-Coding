<template>
  <div>
    <Flowchart
      :flowchartComponents="flowchartComponents"
      v-model:canvasItems="canvasItems"
    />
    <div class="debug-info">
      <h3>디버그 정보:</h3>
      <p>컴포넌트 수: {{ flowchartComponents.length }}</p>
      <p>캔버스 아이템 수: {{ canvasItems.length }}</p>
      <p>연결선 수: {{ connections }}</p>
    </div>
  </div>
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
])

const canvasItems = ref([])

const connections = computed(() => {
  return canvasItems.value.length > 1 ? canvasItems.value.length - 1 : 0
})
</script>

<style scoped>
.debug-info {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9fa;
}
</style>