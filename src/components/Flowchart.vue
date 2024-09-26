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
          :stroke="connection.color"
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
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
const HORIZONTAL_SPACING = 500

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

const findNearestRight = (item, items) => {
  return items.find(other => 
    other !== item && 
    other.y >= item.y &&  // Decision y >= component y 조건
    Math.abs(other.y - item.y) < VERTICAL_SPACING && 
    other.x > item.x
  );
};

const findNearestBottom = (item, items) => {
  return items.find(other => 
    other !== item && 
    other.y > item.y && 
    Math.abs(other.x - item.x) < HORIZONTAL_SPACING
  );
};

const findNextItem = (item, items) => {
  return items.find(other => 
    other !== item && 
    other.y > item.y && 
    Math.abs(other.x - item.x) < HORIZONTAL_SPACING / 2
  );
};

const createConnection = (from, to, color) => {
  const startX = from.x + COMPONENT_WIDTH / 2;
  const startY = from.y + COMPONENT_HEIGHT;
  const endX = to.x + COMPONENT_WIDTH / 2;
  const endY = to.y;

  let path;
  if (to.y >= from.y) {
    // 아래로 향하는 경우
    const midY = (startY + endY) / 2;
    path = `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`;
  } else {
    // 옆으로 향하는 경우 (이 경우는 발생하지 않아야 하지만, 안전을 위해 추가)
    const midX = (startX + endX) / 2;
    // path = `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`;
  }
  
  return { path, color };
};

const connections = computed(() => {
  const lines = [];
  const sortedItems = [...canvasItems.value].sort((a, b) => a.y - b.y);

  for (let i = 0; i < sortedItems.length; i++) {
    const item1 = sortedItems[i];
    
    if (item1.type === 'Decision') {
      const rightBranch = findNearestRight(item1, sortedItems);
      const bottomBranch = findNearestBottom(item1, sortedItems);
      
      if (rightBranch && rightBranch.y >= item1.y) {
        lines.push(createConnection(item1, rightBranch, '#00FF00')); // 녹색
      }
      if (bottomBranch) {
        lines.push(createConnection(item1, bottomBranch, '#FF0000')); // 빨간색
      }
    } else {
      const nextItem = findNextItem(item1, sortedItems);
      if (nextItem) {
        lines.push(createConnection(item1, nextItem, '#007bff')); // 파란색
      }
    }
  }
  return lines;
});

const isConnected = (item1, item2) => {
  return Math.abs(item2.y - item1.y) <= VERTICAL_SPACING &&
         Math.abs(item2.x - item1.x) <= HORIZONTAL_SPACING;
};

const sortedCanvasItems = computed(() => {
  const items = [...canvasItems.value];
  const sorted = [];
  const processed = new Set();

  const processItem = (item) => {
    if (processed.has(item)) return;
    processed.add(item);
    sorted.push(item);

    if (item.type === 'Decision') {
      const rightBranch = findNearestRight(item, items);
      const bottomBranch = findNearestBottom(item, items);
      
      if (rightBranch && rightBranch.y >= item.y) {
        sorted.push([processItem(rightBranch)]);
      }
      if (bottomBranch) {
        processItem(bottomBranch);
      }
    } else {
      const nextItem = findNextItem(item, items);
      if (nextItem) {
        processItem(nextItem);
      }
    }
  };

  const startItems = items.filter(item => 
    !items.some(other => isConnected(other, item))
  );

  startItems.forEach(processItem);

  return sorted;
});

watch(sortedCanvasItems, (newValue) => {
  console.log('Sorted Canvas Items:');
  console.log(JSON.stringify(newValue, null, 2));
});

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