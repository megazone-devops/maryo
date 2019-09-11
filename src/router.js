import Vue from 'vue';
import Router from 'vue-router';

//#region Import pages
import Index from './pages/index.vue';
import mgmt_main from './pages/mgmt_main.vue';
import pipeline_mgmt from './components/pipeline_mgmt.vue';
import export_pipeline from './components/export_pipeline.vue';
import add_pipeline from './components/add_pipeline.vue';
import add_resource from './components/add_resource.vue';
import show_pipeline from './components/show_pipeline.vue';
//#endregion

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/mgmt_main',
      name: 'mgmt_main',
      component: mgmt_main,
    },
    {
      path: '/pipeline_mgmt',
      name: 'pipeline_mgmt',
      component: pipeline_mgmt,
    },
    {
      path: '/export_pipeline',
      name: 'export_pipeline',
      component: export_pipeline,
    },
    {
      path: '/add_pipeline',
      name: 'add_pipeline',
      component: add_pipeline,
    },
    {
      path: '/add_resource',
      name: 'add_resource',
      component: add_resource,
    },
    {
      path: '/show_pipeline',
      name: 'show_pipeline',
      component: show_pipeline,
    },
  ],
});
