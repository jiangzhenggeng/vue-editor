
import Vue from 'vue';
import Router from 'vue-router';
import index from '../pages/index/index.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: index
    }
  ]
});

export default router;
