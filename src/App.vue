<template>
  <v-app>
    <div style="width: 100vw; height: 100vh">
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
/* body::-webkit-scrollbar { 
  display: none;
} */
</style>
