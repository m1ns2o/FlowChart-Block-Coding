<template>
    <v-card
    elevation="0"
    >
      <v-tabs
        v-model="tab"
        align-tabs="center"
        color="indigo-darken-2"
      >
        <v-tab value="problem">문제</v-tab>
        <v-tab value="submit">제출</v-tab>
      </v-tabs>
  
      <v-window v-model="tab">
        <!-- 문제 탭 내용 -->
        <v-window-item value="problem">
          <ProblemComponent :problem="problemData" :classnum="classnum" :problem-sorted="problemSorted"></ProblemComponent>
        </v-window-item>
  
        <!-- 제출 탭 내용 -->
        <v-window-item value="submit">
          <!-- <ProblemComponent :problem="problemData"></ProblemComponent> -->
        </v-window-item>
      </v-window>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import ProblemComponent from '../components/ProblemComponent.vue';
  import axios from 'axios'; 
  import { useUserStore } from '../stores/user'
  import { storeToRefs } from 'pinia'
  import { useAuthCheck } from '../composables/useAuthCheck'
  import { useProblemStore } from '../stores/problem'
  import { useRoute } from 'vue-router';

    const problemStore = useProblemStore()
    // const router = useRouter()
    const route = useRoute()
    const id = route.params.id as string

    const { checkAuth } = useAuthCheck()

    const userStore = useUserStore()
    const tab = ref('problem')
    const { classnum, name } = storeToRefs(userStore)
    const problemData = ref({})

    const problems = computed(() => problemStore.getProblemList)
    // const problemSorted = ref([])
    const problemSorted = computed(()=>problems.value.map(problem => problem.id))
    

    onMounted(async () => {
        // 인증 체크
        if (!checkAuth()) return

        // 문제 목록 가져오기
        console.log(problemSorted)
        try {
        await getProblemList()
        } catch (error) {
        console.error('문제 목록을 가져오는데 실패했습니다:', error)
        }
        try{
            await getProblemData()
            // console.log(problemData.value)  // 문제 데이터 로그
        }catch (error) {
            console.error('문제 데이터를 가져오는데 실패했습니다:', error)
        }
        // console.log(problems.value) //  
        // console.log('problems.value:', problems.value);
      
    })
    
    const getProblemList = async () => {
        if (!problemStore.isDataLoaded(classnum.value)) {
            await problemStore.fetchProblems(classnum.value)
        }
    }

    const getProblemData = async () => {
        const response = await axios.get(`/problems/${id}`)
        problemData.value = response.data
    }

</script>
  
  <style scoped>
  .v-tab {
    min-width: 100px;
  }
  </style>