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
    
    <div class="page">
      <button
      @click="runCompile(sortedCanvasItems)">RUN</button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import Start from './Start.vue'
import Process from './Process.vue'
import Decision from './Decision.vue'
import Loop from './Loop.vue'
import Variable from './Variable.vue'
import Input from './Input.vue'
import Output from './Output.vue'
import LoopStart from './LoopStart.vue'
import LoopEnd from './LoopEnd.vue'

interface FlowchartComponent {
  type: string;
  name: string;
}

interface CanvasItem extends FlowchartComponent {
  x: number;
  y: number;
}

interface Connection {
  path: string;
  color: string;
}

interface CanvasSize {
  width: number;
  height: number;
}

const props = defineProps<{
  flowchartComponents: FlowchartComponent[]
}>()

const emit = defineEmits(['update:canvasItems'])

const canvasItems = ref<CanvasItem[]>([])
const selectedItemIndex = ref<number | null>(null)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)

const COMPONENT_WIDTH = 200
const COMPONENT_HEIGHT = 60
const LOOP_WIDTH = 250
const LOOP_HEIGHT = 300
const VERTICAL_SPACING = 200
const HORIZONTAL_SPACING = 500
const Y_AXIS_EXPANSION_FACTOR = 4

const canvasRef = ref<HTMLDivElement | null>(null)
const canvasSize = ref<CanvasSize>({ width: 1500, height: 2000 })
const previousCanvasSize = ref<CanvasSize>({ width: 1500, height: 2000 })

const getComponent = (type: string) => {
  const componentMap: { [key: string]: any } = {
    'Start': Start,
    'Process': Process,
    'Decision': Decision,
    'Variable': Variable,
    'Input': Input,
    'Output': Output,
    'Loop': Loop,
    'LoopStart': LoopStart,
    'LoopEnd': LoopEnd,
  }
  return componentMap[type] || Process
}

const createConnection = (from: CanvasItem, to: CanvasItem, color: string): Connection => {
  const fromWidth = from.type === 'Loop' ? LOOP_WIDTH : COMPONENT_WIDTH
  const fromHeight = from.type === 'Loop' ? LOOP_HEIGHT : COMPONENT_HEIGHT
  const toWidth = to.type === 'Loop' ? LOOP_WIDTH : COMPONENT_WIDTH
  
  const startX = from.x + fromWidth / 2;
  const startY = from.y + fromHeight;
  const endX = to.x + toWidth / 2;
  const endY = to.y;

  let path: string;
  if (to.y >= from.y) {
    const midY = (startY + endY) / 2;
    path = `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`;
  } else {
    const midX = (startX + endX) / 2;
    path = `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`;
  }
  
  return { path, color };
};

const connections = computed((): Connection[] => {
  const lines: Connection[] = [];
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

const findNearestRight = (item: CanvasItem, items: CanvasItem[]): CanvasItem | undefined => {
  const itemWidth = item.type === 'Loop' ? LOOP_WIDTH : COMPONENT_WIDTH
  return items.find(other => 
    other !== item && 
    other.y >= item.y &&
    Math.abs(other.y - item.y) < VERTICAL_SPACING && 
    other.x > item.x + itemWidth
  );
};

const findNearestBottom = (item: CanvasItem, items: CanvasItem[]): CanvasItem | undefined => {
  const itemHeight = item.type === 'Loop' ? LOOP_HEIGHT : COMPONENT_HEIGHT
  return items.find(other => 
    other !== item && 
    other.y > item.y + itemHeight && 
    Math.abs(other.x - item.x) < HORIZONTAL_SPACING
  );
};

const findNextItem = (item: CanvasItem, items: CanvasItem[]): CanvasItem | undefined => {
  const itemHeight = item.type === 'Loop' ? LOOP_HEIGHT : COMPONENT_HEIGHT
  return items.find(other => 
    other !== item && 
    other.y > item.y + itemHeight &&
    other.y - (item.y + itemHeight) < VERTICAL_SPACING && 
    Math.abs(other.x - item.x) < HORIZONTAL_SPACING / 6
  );
};

interface SortedCanvasItem extends CanvasItem {
  children: SortedCanvasItem[];
  next: SortedCanvasItem | null;
}

const sortedCanvasItems = computed((): SortedCanvasItem | null => {
  const items = [...canvasItems.value];
  const processed = new Set<CanvasItem>();

  const processItem = (item: CanvasItem): SortedCanvasItem | null => {
    if (processed.has(item)) return null;
    processed.add(item);

    const newItem: SortedCanvasItem = { ...item, children: [], next: null };

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

const onDragStart = (event: DragEvent, component: FlowchartComponent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(component))
  }
}

const onDrop = (event: DragEvent) => {
  const componentData = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}')
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  canvasItems.value.push({
    ...componentData,
    x,
    y
  })
  emit('update:canvasItems', canvasItems.value)
  updateCanvasSize()
  saveToLocalStorage()
}

const startItemDrag = (event: MouseEvent, index: number) => {
  selectedItemIndex.value = index
  isDragging.value = true
  dragStartX.value = event.clientX - canvasItems.value[index].x
  dragStartY.value = event.clientY - canvasItems.value[index].y
}

const startCanvasDrag = () => {
  selectedItemIndex.value = null
}

const doDrag = (event: MouseEvent) => {
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
  saveToLocalStorage()
}

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function(this: any) {
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

const deleteItem = (index: number) => {
  canvasItems.value.splice(index, 1)
  selectedItemIndex.value = null
  emit('update:canvasItems', canvasItems.value)
  saveToLocalStorage()
}

const updateCanvasSize = () => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
    const maxItemX = Math.max(...canvasItems.value.map(item => item.x + (item.type === 'Loop' ? LOOP_WIDTH : COMPONENT_WIDTH)))
    const maxItemY = Math.max(...canvasItems.value.map(item => item.y + (item.type === 'Loop' ? LOOP_HEIGHT : COMPONENT_HEIGHT)))
    
    const newWidth = Math.max(rect.width, maxItemX + 100, window.innerWidth)
    const newHeight = Math.max(rect.height, maxItemY + (100 * Y_AXIS_EXPANSION_FACTOR), window.innerHeight)
    
    previousCanvasSize.value = { ...canvasSize.value }
    
    canvasSize.value = {
      width: newWidth,
      height: newHeight
    }
    
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

const updateItemName = (index: number, newName: string) => {
  canvasItems.value[index].name = newName
  emit('update:canvasItems', canvasItems.value)
  saveToLocalStorage()
}

const saveToLocalStorage = () => {
  try {
    localStorage.setItem('canvasItems', JSON.stringify(canvasItems.value))
    localStorage.setItem('sortedCanvasItems', JSON.stringify(sortedCanvasItems.value))
    console.log(sortedCanvasItems.value)
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const loadFromLocalStorage = () => {
  try {
    const savedCanvasItems = localStorage.getItem('canvasItems')
    if (savedCanvasItems) {
      canvasItems.value = JSON.parse(savedCanvasItems)
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
}

// SortedCanvasItem 인터페이스 정의 (이전과 동일)
// interface SortedCanvasItem extends CanvasItem {
//   children: SortedCanvasItem[];
//   next: SortedCanvasItem | null;
// }

let code = ''

const compile = (item: SortedCanvasItem): void => {
  switch(item.type){
    case 'Variable':
      code += `let ${item.name};\n`;
      break;
    case 'Process':
      code += `${item.name};\n`;
      break;
    case 'Input':
      code += `const temp = prompt("입력", "");
      ${item.name} = isNaN(Number(temp)) ? temp : Number(temp);\n`;
      break;
    case 'Output':
      code += `console.log(${item.name});\n`;
      break;
    case 'LoopStart':
      compileLoopStart(item.name);
      break;
    case 'LoopEnd':
      compileLoopEnd();
      break;
    case 'Decision':
      compileDecision(item);
      break;
    default:
      // console.warn(`Unsupported type: ${item.type}`);
      break;
  }

  // 다음 아이템이 있으면 재귀적으로 compile 호출
  if (item.next) {
    compile(item.next);
  }
}

const compileLoopStart = (condition: string): void => {
  if (isNaN(Number(condition))) {
    code += `while(${condition}) {\n`;
  } else {
    code += `for(let i = 0; i < ${condition}; i++) {\n`;
  }
}

const compileLoopEnd = (): void => {
  code += "}\n";
}

const compileDecision = (item: SortedCanvasItem): void => {
  code += `if (${item.name}) {\n`;
  if (item.children[0]) {
    compile(item.children[0]);
  }
  code += "} else {\n";
  if (item.children[1]) {
    compile(item.children[1]);
  }
  code += "}\n";
}

// compile 함수 사용 예시
const runCompile = (sortedCanvasItems: SortedCanvasItem | null): void => {
  code = ''; // 코드 초기화
  if (sortedCanvasItems) {
    compile(sortedCanvasItems);
    console.log(code); // 생성된 코드 출력
  } else {
    console.warn('No items to compile');
  }
}

watch(canvasItems, () => {
  saveToLocalStorage()
}, { deep: true })

onMounted(() => {
  loadFromLocalStorage()
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
  height: 85%;
  overflow-x: hidden;
  overflow-y: auto;
  border: 2px solid #333;
  position: relative;
  /* margin: auto; */
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

.page{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  gap: 30px;
}

.page > button{
  margin-top: 20px;
  width: 200px;
  height: 60px;
  background-color: skyblue;
}
</style>