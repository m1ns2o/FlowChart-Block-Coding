<template>
    <div class="flowchart-component decision">
      <span class="decision-text">{{ name }}</span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    name: {
      type: String,
      default: '결정'
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
    background-color: #fff;
    /* border: 1px solid #999; */
    user-select: none;
    z-index: 1;
    /* box-shadow: 0 2px 5px rgba(0,0,0,0.1); */
  }
  .decision {
    background-color: #e9ecef;
    /* transform: rotate(45deg); */
    /* background: #f1c40f; */
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    /* display: flex; */
    align-items: center;
    justify-content: center;
  }
  .decision-text {
    /* transform: rotate(-45deg); */
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  </style>