import Vue from 'vue'
import Router from 'vue-router'
import Loginin from '@/components/Loginin'
import choice from '@/components/choice'
import selectCourse from '@/components/selectCourse'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Loginin',
      component: Loginin
    },
    {
      path: '/choice',
      name: 'choice',
      component: choice
    },
    {
      path: '/selectCourse',
      name: 'selectCourse',
      component: selectCourse
    }
  ]
})
