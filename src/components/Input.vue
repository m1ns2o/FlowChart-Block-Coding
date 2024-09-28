<template>
    <div class="flowchart-component process">
      <span class="text">{{ name }}</span>
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
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    background-color: #fff;
    /* border: 1px solid #999; */
    user-select: none;
    z-index: 1;
    /* box-shadow: 0 2px 5px rgba(0,0,0,0.1); */
    background-color: rgb(153, 210, 104);
    /* border: 2px solid #000; */
    clip-path: polygon(
      20px 0%,
      100% 0%,
      calc(100% - 20px) 100%,
      0% 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    box-sizing: border-box;
  }
  </style>