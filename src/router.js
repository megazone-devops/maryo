import Vue from 'vue'
import Router from 'vue-router'
import pipeline_input from './components/pipeline_input.vue'
import pipeline_mgmt from './components/pipeline_mgmt.vue'
import show_pipeline from './components/show_pipeline.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'pipeline_input',
      component: pipeline_input
    },
    {
      path: '/pipeline_mgmt',
      name: 'pipeline_mgmt',
      component: pipeline_mgmt
    },
    {
      path: '/show_pipeline',
      name: 'show_pipeline',
      component: show_pipeline
    }
  ]
})
