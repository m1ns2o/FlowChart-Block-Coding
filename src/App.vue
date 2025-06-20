<template>
  <v-app>
    <div style="height: 100%; width: 100%">
      <router-view></router-view>
    </div>
  </v-app>
</template>

<style>
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none; /* 밑줄 제거 */
    color: inherit; /* 부모 요소의 색상을 상속 */
  }

  a:hover,
  a:focus,
  a:active {
    text-decoration: none; /* 호버, 포커스, 클릭 시에도 밑줄 제거 */
    color: inherit; /* 호버, 포커스, 클릭 시 색상도 상속 */
  }
  /* App.vue나 글로벌 스타일시트에 추가 */
  .mdi-custom {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    font-size: inherit;
    vertical-align: middle;
  }

  .mdi-custom svg {
    display: inline-block;
    flex: none;
    transition: inherit;
  }
  /* body::-webkit-scrollbar { 
  display: none;
} */
</style>
