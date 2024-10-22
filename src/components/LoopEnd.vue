<template>
  <div class="flowchart-component process">반복 끝</div>
</template>

<script setup>
// import { ref, watch } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "반복 끝",
  },
});

//   const emit = defineEmits(['update:name', 'blur', 'enter'])

//   const inputValue = ref(props.name)
//   const isDefaultValue = ref(props.name === '프로세스')

//   watch(() => props.name, (newValue) => {
//     inputValue.value = newValue
//     isDefaultValue.value = newValue === '프로세스'
//   })

//   watch(inputValue, (newValue) => {
//     emit('update:name', newValue)
//     isDefaultValue.value = false
//   })

//   const onFocus = () => {
//     if (isDefaultValue.value) {
//       inputValue.value = ''
//       isDefaultValue.value = false
//     }
//   }

//   const onBlur = () => {
//     if (inputValue.value.trim() === '') {
//       inputValue.value = '프로세스'
//       isDefaultValue.value = true
//     }
//     emit('blur', inputValue.value)
//   }

//   const onEnter = () => {
//     if (inputValue.value.trim() === '') {
//       inputValue.value = '프로세스'
//       isDefaultValue.value = true
//     }
//     emit('enter', inputValue.value)
//   }
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
  border: 1px solid #999;
  user-select: none;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.process {
  background-color: #f8f9fa;
}

.process-input {
  width: 90%;
  height: 70%;
  background: transparent;
  border: none;
  text-align: center;
  font-size: 14px;
}

.process-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
