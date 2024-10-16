<template>
    <div class="terminal-wrapper" v-show="localToggle">
      <div class="terminal-content">
        <div class="terminal-header">
          <button class="close-button" @click="closeTerminal">×</button>
        </div>
        <div class="terminal-template" ref="terminalRef">
          <div v-for="(item, index) in terminalContent" :key="index">
            <p v-if="item.type === 'print'">{{ item.content }}</p>
            <div v-else-if="item.type === 'scan'" class="scan-input">
              <!-- <input 
                v-model="item.value" 
                @keyup.enter="submitScan(index)"
                :ref="el => { if (el) scanInputRefs[index] = el }"
                placeholder="Enter your input..."
              /> -->
              <input 
                v-model="item.value" 
                @keyup.enter="submitScan(index)"
                :ref="el => { if (el) scanInputRefs[index] = el as HTMLInputElement }"
                placeholder="Enter your input..."
                />

            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineExpose, nextTick } from 'vue';
  
//   const props = defineProps({
//     toggle: {
//       type: Boolean,
//       required: true,
//     }
//   });

  const localToggle = ref(false);
  const emit = defineEmits(['update:toggle']);
  
//   const emit = defineEmits(['update:toggle']);
  
  const terminalContent = ref<Array<{type: 'print' | 'scan', content?: string, value?: string}>>([]);
  const scanInputRefs = ref<Array<HTMLInputElement>>([]);
  const terminalRef = ref<HTMLElement | null>(null);
  let currentCallback: ((value: string) => void) | null = null;
  
  const print = (content: string) => {
    terminalContent.value.push({ type: 'print', content });
    scrollToBottom();
  };
  
  const scan = (callback: (value: string) => void) => {
    currentCallback = callback;
    const index = terminalContent.value.length;
    terminalContent.value.push({ type: 'scan', value: '' });
    nextTick(() => {
      scanInputRefs.value[index]?.focus();
    });
  };
  
  const submitScan = (index: number) => {
    const scannedValue = terminalContent.value[index].value || '';
    terminalContent.value[index] = { type: 'print', content: `> ${scannedValue}` };
    scrollToBottom();
    if (currentCallback) {
      currentCallback(scannedValue);
      currentCallback = null;
    }
  };
  
  const scrollToBottom = () => {
    nextTick(() => {
      if (terminalRef.value) {
        terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
      }
    });
  };

  const clearTerminal = ()=>{
    terminalContent.value = [];
    scanInputRefs.value = [];
  }
  
  const closeTerminal = () => {
    // emit('update:toggle', false);
    localToggle.value = false;
  };

  const openTerminal = () => {
    // emit('update:toggle', false);
    localToggle.value = true;
    emit('update:toggle', true);
  };
  
  defineExpose({
    print,
    scan,
    openTerminal,
    clearTerminal,
  });
  
//   watch(() => props.toggle, (newValue) => {
//     if (newValue) {
//       // 터미널이 열릴 때 필요한 초기화 작업을 여기에 추가할 수 있습니다.
//       scrollToBottom();
//     }
//   });
  </script>
  
  <style scoped>
  .terminal-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    z-index: 1000;
  }
  
  .terminal-content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #252525;
    display: flex;
    flex-direction: column;
  }
  
  .terminal-header {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    z-index: 1001;
  }
  
  .close-button {
    background-color: #252525;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .terminal-template {
    flex-grow: 1;
    color: #ffffff;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 10px 10px 10px 30px;
    font-family: monospace;
    font-size: 20px;
    text-align: left;
  }
  
  .scan-input input {
    background-color: #333;
    color: #fff;
    border: none;
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    font-size: 20px;
  }
  
  p {
    margin: 5px 0;
  }
  </style>