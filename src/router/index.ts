import { createRouter, createWebHistory } from 'vue-router'

// import Flowchart from '../views/FlowchartView.vue'
import HomeView from '../views/HomeView.vue'
import Classlogin from '../views/ClassloginView.vue'
import Problemlist from '../views/ProblemlistView.vue'
import ClassView from '../views/ClassView.vue'
import EditproblemlistView from '../views/EditproblemlistView.vue'
import EditproblemView from '../views/EditproblemView.vue'
import ProblemView from '../views/ProblemView.vue'


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
      path: '/editproblemlist',
      name: 'editproblemlist',
      component: EditproblemlistView
    },
    {
      path: '/classnumber',
      name: 'classnumber',
      component: Classlogin
    },
    {
      path: '/class',
      name: 'class',
      component: ClassView
    },
    {
      path: '/problemlist',
      name: 'problemlist',
      component: Problemlist
    },
    {
      path: '/test',
      name: 'test',
      component: EditproblemView
    },
    {
      path: '/editproblem/:id?',
      name: 'editproblem',
      component: EditproblemView
    },
    {
      path: '/problem/:id?',
      name: 'problem',
      component: ProblemView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
  ]
})

export default router