<template>
  <div class="main">
    <div class="components-list">
      <div class="nav_style"></div>
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
const componentList = ref([])

const COMPONENT_WIDTH = 200
const COMPONENT_HEIGHT = 60
const VERTICAL_SPACING = 200
const HORIZONTAL_SPACING = 500
const Y_AXIS_EXPANSION_FACTOR = 4 // Increase this value to expand the canvas faster vertically

const canvasRef = ref(null)
const canvasSize = ref({ width: 1500, height: 2000 })
const previousCanvasSize = ref({ width: 1500, height: 2000 })

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

const createConnection = (from, to, color) => {
  const startX = from.x + COMPONENT_WIDTH / 2;
  const startY = from.y + COMPONENT_HEIGHT;
  const endX = to.x + COMPONENT_WIDTH / 2;
  const endY = to.y;

  let path;
  if (to.y >= from.y) {
    const midY = (startY + endY) / 2;
    path = `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`;
  } else {
    const midX = (startX + endX) / 2;
    path = `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`;
  }
  
  return { path, color };
};

const connections = computed(() => {
  const lines = [];
  const items = canvasItems.value;

  items.forEach(item => {
    if (item.type === 'Decision') {
      const rightBranch = findNearestRight(item, items);
      const bottomBranch = findNearestBottom(item, items);
      
      if (rightBranch) {
        lines.push(createConnection(item, rightBranch, '#00FF00'));
      }
      if (bottomBranch) {
        lines.push(createConnection(item, bottomBranch, '#FF0000'));
      }
    } else {
      const nextItem = findNextItem(item, items);
      if (nextItem) {
        lines.push(createConnection(item, nextItem, '#007bff'));
      }
    }
  });
  return lines;
});

const findNearestRight = (item, items) => {
  return items.find(other => 
    other !== item && 
    other.y >= item.y &&
    Math.abs(other.y - item.y) < VERTICAL_SPACING && 
    other.x > item.x
  );
};

const findNearestBottom = (item, items) => {
  return items.find(other => 
    other !== item && 
    other.y > item.y && 
    Math.abs(other.x - item.x) < HORIZONTAL_SPACING / 2
  );
};

const findNextItem = (item, items) => {
  return items.find(other => 
    other !== item && 
    other.y > item.y &&
    other.y - item.y < VERTICAL_SPACING && 
    Math.abs(other.x - item.x) < HORIZONTAL_SPACING / 6
  );
};

const sortedCanvasItems = computed(() => {
  const items = [...canvasItems.value];
  const processed = new Set();

  const processItem = (item) => {
    if (processed.has(item)) return null;
    processed.add(item);

    const newItem = { ...item, children: [], next: null };

    if (item.type === 'Decision') {
      const rightBranch = findNearestRight(item, items);
      const bottomBranch = findNearestBottom(item, items);
      
      if (rightBranch) {
        const rightResult = processItem(rightBranch);
        if (rightResult) {
          newItem.children.push(rightResult);
        }
      }
      if (bottomBranch) {
        const bottomResult = processItem(bottomBranch);
        if (bottomResult) {
          newItem.children.push(bottomResult);
        }
      }
    } else {
      const nextItem = findNextItem(item, items);
      if (nextItem) {
        newItem.next = processItem(nextItem);
      }
    }

    return newItem;
  };

  const startItem = items.find(item => 
    !items.some(other => 
      (other.type === 'Decision' && (findNearestRight(other, items) === item || findNearestBottom(other, items) === item)) ||
      (other.type !== 'Decision' && findNextItem(other, items) === item)
    )
  );

  return startItem ? processItem(startItem) : null;
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
    updateCanvasSize() // This will now also trigger autoScroll
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
}

const updateCanvasSize = () => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
    const maxItemX = Math.max(...canvasItems.value.map(item => item.x + COMPONENT_WIDTH))
    const maxItemY = Math.max(...canvasItems.value.map(item => item.y + COMPONENT_HEIGHT))
    
    const newWidth = Math.max(rect.width, maxItemX + 100, window.innerWidth)
    const newHeight = Math.max(rect.height, maxItemY + (100 * Y_AXIS_EXPANSION_FACTOR), window.innerHeight)
    
    // Store the previous size before updating
    previousCanvasSize.value = { ...canvasSize.value }
    
    canvasSize.value = {
      width: newWidth,
      height: newHeight
    }
    
    // Call the autoScroll function after updating the canvas size
    autoScroll()
  }
}

const autoScroll = () => {
  if (canvasRef.value) {
    const canvas = canvasRef.value
    const widthDiff = canvasSize.value.width - previousCanvasSize.value.width
    const heightDiff = canvasSize.value.height - previousCanvasSize.value.height

    if (widthDiff > 0) {
      canvas.scrollLeft += widthDiff
    }
    if (heightDiff > 0) {
      canvas.scrollTop += heightDiff * Y_AXIS_EXPANSION_FACTOR
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

.nav_style{
  background-color: #B1C9EF;
  width: 100%;
  height: 5%;
  margin: 0;
  padding: 0;
}

.components-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 50px;
  width: 300px;
  align-items: center;
  overflow-y: auto;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}

.draggable-component {
  cursor: move;
}

.canvas {
  width: 80%;
  height: 90%;
  /* overflow: auto; */
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