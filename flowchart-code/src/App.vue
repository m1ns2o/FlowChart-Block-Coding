<template>
  <div>
    <h2>순서도 컴포넌트</h2>
    <div class="components-list">
      <div
        v-for="component in flowchartComponents"
        :key="component.type"
        draggable="true"
        @dragstart="onDragStart($event, component)"
        class="draggable-component"
      >
        {{ component.name }}
      </div>
    </div>
    <h2>캔버스</h2>
    <div
      class="canvas"
      @dragover.prevent
      @drop="onDrop"
      @mousedown="startCanvasDrag"
      @mousemove="throttledDoDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <svg class="connections" :width="800" :height="600">
        <path
          v-for="(connection, index) in connections"
          :key="index"
          :d="connection.path"
          fill="none"
          stroke="#007bff"
          stroke-width="2"
          marker-end="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#007bff" />
          </marker>
        </defs>
      </svg>
      <div
        v-for="(item, index) in canvasItems"
        :key="index"
        :style="{ position: 'absolute', left: `${item.x}px`, top: `${item.y}px` }"
        @mousedown.stop="startItemDrag($event, index)"
        :class="['flowchart-component', item.type, { selected: selectedItemIndex === index }]"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="debug-info">
      <h3>디버그 정보:</h3>
      <p>컴포넌트 수: {{ flowchartComponents.length }}</p>
      <p>캔버스 아이템 수: {{ canvasItems.length }}</p>
      <p>연결선 수: {{ connections.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const flowchartComponents = ref([
  { name: '시작', type: 'start' },
  { name: '프로세스', type: 'process' },
  { name: '결정', type: 'decision' },
  { name: '종료', type: 'end' }
])

const canvasItems = ref([])
const selectedItemIndex = ref(null)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)

const COMPONENT_WIDTH = 100
const COMPONENT_HEIGHT = 60
const VERTICAL_SPACING = 200

const connections = computed(() => {
  const lines = []
  const sortedItems = [...canvasItems.value].sort((a, b) => a.y - b.y)

  for (let i = 0; i < sortedItems.length - 1; i++) {
    const item1 = sortedItems[i]
    const item2 = sortedItems[i + 1]
    
    if (Math.abs(item2.y - item1.y) <= VERTICAL_SPACING) {
      const startX = item1.x + COMPONENT_WIDTH / 2
      const startY = item1.y + COMPONENT_HEIGHT
      const endX = item2.x + COMPONENT_WIDTH / 2
      const endY = item2.y

      const midY = (startY + endY) / 2
      const path = `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`
      lines.push({ path })
    }
  }
  return lines
})

const onDragStart = (event, component) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(component))
}

const onDrop = (event) => {
  const componentData = JSON.parse(event.dataTransfer.getData('text/plain'))
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  canvasItems.value.push({
    ...componentData,
    x,
    y
  })
}

const startItemDrag = (event, index) => {
  selectedItemIndex.value = index
  isDragging.value = true
  dragStartX.value = event.clientX - canvasItems.value[index].x
  dragStartY.value = event.clientY - canvasItems.value[index].y
}

const startCanvasDrag = (event) => {
  selectedItemIndex.value = null
}

const doDrag = (event) => {
  if (isDragging.value && selectedItemIndex.value !== null) {
    const index = selectedItemIndex.value
    canvasItems.value[index].x = event.clientX - dragStartX.value
    canvasItems.value[index].y = event.clientY - dragStartY.value
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const throttledDoDrag = throttle(doDrag, 16)

</script>

<style scoped>
.components-list {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}
.draggable-component {
  cursor: move;
  padding: 10px;
  border: 1px solid #999;
  background-color: #f0f0f0;
}
.canvas {
  width: 800px;
  height: 600px;
  border: 2px solid #333;
  position: relative;
}
.connections {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.flowchart-component {
  width: 100px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  background-color: #fff;
  border: 1px solid #999;
  user-select: none;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.start, .end {
  border-radius: 30px;
  background-color: #e9ecef;
}
.process {
  background-color: #f8f9fa;
}
.decision {
  background-color: #e9ecef;
}
.selected {
  outline: 2px solid #007bff;
  box-shadow: 0 0 10px rgba(0,123,255,0.5);
}
.debug-info {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9fa;
}
</style>