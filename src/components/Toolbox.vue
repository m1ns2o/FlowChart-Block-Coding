<template>
    <div class="toolbox">
      <h2>도구상자</h2>
      <div
        v-for="tool in tools"
        :key="tool.type"
        class="tool"
        draggable="true"
        @dragstart="onDragStart($event, tool)"
      >
        {{ tool.label }}
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import { FlowchartComponentType } from '../types'
  
  export default defineComponent({
    name: 'Toolbox',
    emits: ['add-component'],
    setup(_, { emit }) {
      const tools = [
        { type: FlowchartComponentType.START, label: '시작' },
        { type: FlowchartComponentType.PROCESS, label: '프로세스' },
        { type: FlowchartComponentType.DECISION, label: '결정' },
        { type: FlowchartComponentType.END, label: '종료' },
      ]
  
      const onDragStart = (event: DragEvent, tool: { type: FlowchartComponentType; label: string }) => {
        if (event.dataTransfer) {
          event.dataTransfer.setData('application/json', JSON.stringify(tool))
        }
      }
  
      return {
        tools,
        onDragStart
      }
    }
  })
  </script>
  
  <style scoped>
  .toolbox {
    width: 200px;
    border: 1px solid #ccc;
    padding: 10px;
  }
  
  .tool {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f0f0f0;
    cursor: move;
  }
  </style>