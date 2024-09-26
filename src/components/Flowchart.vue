<template>
  <div class="main">
    <div class="components-list">
      <div
        v-for="component in flowchartComponents"
        :key="component.type"
        draggable="true"
        @dragstart="onDragStart($event, component)"
        class="draggable-component"
      >
        <component :is="getComponent(component.type)" :name="component.name" />
      </div>
    </div>
    <div
      ref="canvasRef"
      class="canvas"
      @dragover.prevent
      @drop="onDrop"
      @mousedown="startCanvasDrag"
      @mousemove="throttledDoDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <svg class="connections" :width="canvasSize.width" :height="canvasSize.height">
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
        @contextmenu.prevent="deleteItem(index)"
        :class="{ selected: selectedItemIndex === index }"
      >
        <component 
          :is="getComponent(item.type)" 
          v-model:name="item.name"
          @update:name="updateItemName(index, $event)"
        />
      </div>
    </div>
  </div>
  {{ canvasItems }}
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Start from './Start.vue'
import Process from './Process.vue'
import Decision from './Decision.vue'
import End from './End.vue'
import Variable from './Variable.vue'
import Input from './Input.vue'
import Output from './Output.vue'

const props = defineProps({
  flowchartComponents: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:canvasItems'])

const canvasItems = ref([])
const selectedItemIndex = ref(null)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)

const COMPONENT_WIDTH = 200
const COMPONENT_HEIGHT = 60
const VERTICAL_SPACING = 200

const canvasRef = ref(null)
const canvasSize = ref({ width: 1500, height: 2000 })

const getComponent = (type) => {
  const componentMap = {
    'Start': Start,
    'Process': Process,
    'Decision': Decision,
    'End': End,
    'Variable': Variable,
    'Input': Input,
    'Output': Output
  }
  return componentMap[type] || Process
}

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
  emit('update:canvasItems', canvasItems.value)
  updateCanvasSize()
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
    emit('update:canvasItems', canvasItems.value)
    updateCanvasSize()
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

const deleteItem = (index) => {
  canvasItems.value.splice(index, 1)
  selectedItemIndex.value = null
  emit('update:canvasItems', canvasItems.value)
  updateCanvasSize()
}

const updateCanvasSize = () => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
    canvasSize.value = {
      width: Math.max(rect.width, ...canvasItems.value.map(item => item.x + COMPONENT_WIDTH)),
      height: Math.max(rect.height, ...canvasItems.value.map(item => item.y + COMPONENT_HEIGHT))
    }
  }
}

const updateItemName = (index, newName) => {
  canvasItems.value[index].name = newName
  emit('update:canvasItems', canvasItems.value)
}

onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
})
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.components-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 50px;
  width: 300px;
  align-items: center;
  padding-top: 50px;
  border: 1px solid #ccc;
  overflow-y: auto;
}

.draggable-component {
  cursor: move;
}

.canvas {
  width: 80%;
  height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  border: 2px solid #333;
  position: relative;
  margin: auto;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.selected {
  outline: 2px solid #007bff;
}
</style>