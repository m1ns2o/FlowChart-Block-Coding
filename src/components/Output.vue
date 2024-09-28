<template>
  <div class="flowchart-component process">
    {{ name }}
    <svg class="clip-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
      <path d="M0,0 H200 V45 Q170,35 100,50 Q30,65 0,55 V60 H200 V0 Z" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: '프로세스'
  }
})
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
  /* border: 2px solid #000; */
  user-select: none;
  z-index: 1;
  position: relative;
  overflow: hidden;
  /* padding-bottom: 0px; */
}

.clip-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
}
.clip-svg path {
  fill: #fff;
  /* stroke: #000; */
  stroke-width: 2;
}
</style>