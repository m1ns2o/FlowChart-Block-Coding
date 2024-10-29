<template>
  <div class="flowchart-component process">
    <input
      v-model="inputValue"
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="onEnter"
      class="process-input"
      placeholder="ex) x"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    name: {
      type: String,
      default: '입력',
    },
  });

  const emit = defineEmits(['update:name', 'blur', 'enter']);

  const inputValue = ref(props.name);
  const isDefaultValue = ref(props.name === '입력');

  watch(
    () => props.name,
    (newValue) => {
      inputValue.value = newValue;
      isDefaultValue.value = newValue === '입력';
    }
  );

  watch(inputValue, (newValue) => {
    emit('update:name', newValue);
    isDefaultValue.value = newValue === '입력';
  });

  const onFocus = () => {
    if (isDefaultValue.value) {
      inputValue.value = '';
    }
  };

  const onBlur = () => {
    if (inputValue.value.trim() === '') {
      inputValue.value = '입력';
      isDefaultValue.value = true;
    }
    emit('blur', inputValue.value);
  };

  const onEnter = () => {
    if (inputValue.value.trim() === '') {
      inputValue.value = '입력';
      isDefaultValue.value = true;
    }
    emit('enter', inputValue.value);
  };
</script>

<style scoped>
  .flowchart-component {
    width: 200px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    background-color: rgb(153, 210, 104);
    user-select: none;
    z-index: 1;
    clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
    padding: 0 20px;
    box-sizing: border-box;
  }

  .process-input {
    width: 100%;
    height: 40px;
    background: transparent;
    border: none;
    text-align: center;
    font-size: 14px;
    color: #000;
    position: relative;
    z-index: 2;
  }

  .process-input::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  .process-input:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
