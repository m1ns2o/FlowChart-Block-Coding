<template>
  <div class="flowchart-component loop">
    <div class="loop-count">
      <input
        v-model="inputValue"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="onEnter"
        class="process-loop"
        placeholder="ex) x'"
      />
    </div>
    <div class="loop-content">
      <!-- Content goes here -->
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    name: {
      type: String,
      default: '반복',
    },
  });

  const emit = defineEmits(['update:name', 'blur', 'enter']);

  const inputValue = ref(props.name);
  const isDefaultValue = ref(props.name === '반복');

  watch(
    () => props.name,
    (newValue) => {
      inputValue.value = newValue;
      isDefaultValue.value = newValue === '반복';
    }
  );

  watch(inputValue, (newValue) => {
    emit('update:name', newValue);
    isDefaultValue.value = newValue === '반복';
  });

  const onFocus = () => {
    if (isDefaultValue.value) {
      inputValue.value = '';
    }
  };

  const onBlur = () => {
    if (inputValue.value.trim() === '') {
      inputValue.value = '반복';
      isDefaultValue.value = true;
    }
    emit('blur', inputValue.value);
  };

  const onEnter = () => {
    if (inputValue.value.trim() === '') {
      inputValue.value = '반복';
      isDefaultValue.value = true;
    }
    emit('enter', inputValue.value);
  };
</script>

<style scoped>
  .flowchart-component {
    width: 250px;
    height: 300px;
    display: flex;
    flex-direction: column;
    cursor: move;
    user-select: none;
    z-index: 1;
    box-sizing: border-box;
    border: 2px solid #000;
    background: none;
  }

  .loop-count {
    height: 100px;
    border-bottom: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: #fff; */
  }

  .loop-content {
    flex-grow: 1;
    /* background-color: #fff; */
  }

  .process-loop {
    width: 90%;
    height: 30px;
    background: transparent;
    border: none;
    text-align: center;
    font-size: 14px;
    color: #000;
  }

  .process-loop::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  .process-loop:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.05);
  }
</style>
