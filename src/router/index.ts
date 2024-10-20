import { createRouter, createWebHistory } from 'vue-router'

// import Flowchart from '../views/FlowchartView.vue'
import HomeView from '../views/HomeView.vue'
import Classlogin from '../views/ClassloginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/flowchart',
      name: 'flowchart',
      // component: Flowchart
      component: () => import('../views/FlowchartView.vue') //lazy load
    },
    {
      path: '/classnumber',
      name: 'classnumber',
      component: Classlogin
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
  ]
})

export default router