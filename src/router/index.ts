import { createRouter, createWebHistory } from 'vue-router'

import Flowchart from '../views/FlowchartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/flowchart',
      name: 'flowchart',
      component: Flowchart
    },
  ]
})

export default router