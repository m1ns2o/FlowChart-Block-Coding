<template>
    <div class="canvas" @drop="onDrop" @dragover.prevent>
      <VueDraggableNext v-model="localComponents" item-key="id" class="component-list">
        <template #item="{ element }">
          <div :class="['flowchart-component', element.type]">
            {{ element.label }}
          </div>
        </template>
      </VueDraggableNext>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, computed } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'

  import { FlowchartComponent, FlowchartComponentType } from '../types'
  
  export default defineComponent({
    name: 'Canvas',
    components: {
      VueDraggableNext
    },
    props: {
      components: {
        type: Array as PropType<FlowchartComponent[]>,
        required: true
      }
    },
    emits: ['update-components'],
    setup(props, { emit }) {
      const localComponents = computed({
        get: () => props.components,
        set: (value) => emit('update-components', value)
      })
  
      const onDrop = (event: DragEvent) => {
        const toolData = event.dataTransfer?.getData('application/json')
        if (toolData) {
          const { type, label } = JSON.parse(toolData)
          const newComponent: FlowchartComponent = {
            id: Date.now(),
            type: type as FlowchartComponentType,
            label,
            x: event.offsetX,
            y: event.offsetY
          }
          localComponents.value.push(newComponent)
        }
      }
  
      return {
        localComponents,
        onDrop
      }
    }
  })
  </script>
  
  <style scoped>
  .canvas {
    flex-grow: 1;
    border: 1px solid #ccc;
    min-height: 600px;
    position: relative;
  }
  
  .component-list {
    height: 100%;
  }
  
  .flowchart-component {
    position: absolute;
    padding: 10px;
    border: 1px solid #000;
    background-color: #fff;
    cursor: move;
  }
  
  .START, .END {
    border-radius: 50%;
  }
  
  .DECISION {
    transform: rotate(45deg);
  }
  
  .DECISION span {
    display: inline-block;
    transform: rotate(-45deg);
  }
  </style>