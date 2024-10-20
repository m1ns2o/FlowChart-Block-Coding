<template>
  <div class="main">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="6" md="4" lg="4" xl="3" class="text-center">
          <v-card
            class="mx-auto my-6 card-hover"
            width="300"
            height="360"
            elevation="1"
            href="/classnumber"
          >
            <v-card-item
              class="text-center d-flex flex-column align-center justify-center"
              style="height: 100%"
            >
              <v-avatar size="120" color="indigo-darken-2" class="mb-6">
                <v-icon size="64" color="white">mdi-school</v-icon>
              </v-avatar>
              <v-card-title class="text-h4 mb-2">학생</v-card-title>
              <v-card-text class="text-body-1"> 클래스룸 입장하기 </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="4" xl="3" class="text-center">
          <v-card
            class="mx-auto my-6 card-hover"
            width="300"
            height="360"
            elevation="1"
          >
            <v-card-item
              class="text-center d-flex flex-column align-center justify-center"
              style="height: 100%"
            >
              <v-avatar size="120" color="indigo-darken-2" class="mb-6">
                <v-icon size="64" color="white">mdi-human-male-board</v-icon>
              </v-avatar>
              <v-card-title class="text-h4 mb-2">교사</v-card-title>
              <v-card-text class="text-body-1"> 클래스룸 만들기 </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.main {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
</style>
