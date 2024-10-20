<template>
  <div class="flowchart-component process">
    <input
      v-model="inputValue"
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="onEnter"
      class="process-input"
      placeholder="ex) x값은 (x)이다."
    />
    <svg class="clip-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
      <path d="M0,0 H200 V45 Q170,35 100,50 Q30,65 0,55 V60 H200 V0 Z" />
    </svg>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "출력",
  },
});

const emit = defineEmits(["update:name", "blur", "enter"]);

const inputValue = ref(props.name);
const isDefaultValue = ref(props.name === "출력");

watch(
  () => props.name,
  (newValue) => {
    inputValue.value = newValue;
    isDefaultValue.value = newValue === "출력";
  }
);

watch(inputValue, (newValue) => {
  emit("update:name", newValue);
  isDefaultValue.value = newValue === "출력";
});

const onFocus = () => {
  if (isDefaultValue.value) {
    inputValue.value = "";
  }
};

const onBlur = () => {
  if (inputValue.value.trim() === "") {
    inputValue.value = "출력";
    isDefaultValue.value = true;
  }
  emit("blur", inputValue.value);
};

const onEnter = () => {
  if (inputValue.value.trim() === "") {
    inputValue.value = "출력";
    isDefaultValue.value = true;
  }
  emit("enter", inputValue.value);
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
  background-color: #37719f;
  user-select: none;
  z-index: 1;
  position: relative;
  overflow: hidden;
}

.process-input {
  width: 90%;
  height: 40px;
  background: transparent;
  border: none;
  text-align: center;
  font-size: 14px;
  color: #fff;
  position: relative;
  z-index: 2;
}

.process-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.process-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.2);
}

.clip-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.clip-svg path {
  fill: #fff;
}
</style>
