<template>
  <div class="flowchart-component variable">
    <input
      v-model="inputValue"
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="onEnter"
      class="variable-input"
      placeholder="ex) x = 4"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: '변수'
  },
})

const emit = defineEmits(['update:name', 'blur', 'enter'])

const inputValue = ref(props.name)
const isDefaultValue = ref(props.name === '변수')

watch(() => props.name, (newValue) => {
  inputValue.value = newValue
  isDefaultValue.value = newValue === '변수'
})

watch(inputValue, (newValue) => {
  emit('update:name', newValue)
  isDefaultValue.value = false
})

const onFocus = () => {
  if (isDefaultValue.value) {
    inputValue.value = ''
    isDefaultValue.value = false
  }
}

const onBlur = () => {
  if (inputValue.value.trim() === '') {
    inputValue.value = '변수'
    isDefaultValue.value = true
  }
  emit('blur', inputValue.value)
}

const onEnter = () => {
  if (inputValue.value.trim() === '') {
    inputValue.value = '변수'
    isDefaultValue.value = true
  }
  emit('enter', inputValue.value)
}
</script>

<style scoped>
.flowchart-component {
  width: 200px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  background-color: #fff;
  user-select: none;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.variable {
  clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%);
  background-color: #e9ecef;
}

.variable-input {
  width: 80%;
  height: 70%;
  background: transparent;
  border: none;
  text-align: center;
  font-size: 14px;
}

.variable-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>