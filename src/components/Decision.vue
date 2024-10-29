<template>
  <div class="flowchart-component decision">
    <input
      v-model="inputValue"
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="onEnter"
      class="decision-input"
      placeholder="ex) x > 4"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    name: {
      type: String,
      default: '선택',
    },
  });

  const emit = defineEmits(['update:name', 'blur', 'enter']);

  const inputValue = ref(props.name);
  const isDefaultValue = ref(props.name === '선택');

  watch(
    () => props.name,
    (newValue) => {
      inputValue.value = newValue;
      isDefaultValue.value = newValue === '선택';
    }
  );

  watch(inputValue, (newValue) => {
    emit('update:name', newValue);
    isDefaultValue.value = newValue === '선택';
  });

  const onFocus = () => {
    if (isDefaultValue.value) {
      inputValue.value = '';
    }
  };

  const onBlur = () => {
    if (inputValue.value.trim() === '') {
      inputValue.value = '선택';
      isDefaultValue.value = true;
    }
    emit('blur', inputValue.value);
  };

  const onEnter = () => {
    if (inputValue.value.trim() === '') {
      inputValue.value = '선택';
      isDefaultValue.value = true;
    }
    emit('enter', inputValue.value);
  };
</script>

<style scoped>
  .flowchart-component {
    width: 200px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    background-color: #fff;
    user-select: none;
    z-index: 1;
  }

  .decision {
    background-color: #e9ecef;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .decision-input {
    width: 70%;
    height: 40px;
    background: transparent;
    border: none;
    text-align: center;
    font-size: 14px;
    color: #000;
    position: relative;
    z-index: 2;
  }

  .decision-input::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  .decision-input:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
