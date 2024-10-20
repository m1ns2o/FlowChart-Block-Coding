<template>
  <div class="flowchart-component start">
    {{ name }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: "시작",
  },
});
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
.start {
  border-radius: 30px;
  background-color: #e9ecef;
}
</style>
