// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import loading from './components/loading'
Vue.use(loading);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
	store,
  template: '<App/>',
  components: { App }
})
