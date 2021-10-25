import Vue from 'vue'
import './utils/flexible'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import { get, post, put, del,postResponseType } from './api/axios'
import '_c/import'
import axios from "axios";

Vue.config.productionTip = false;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$del = del;
Vue.prototype.$postResponseType = postResponseType;
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
