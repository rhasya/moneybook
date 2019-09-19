import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from './firebase';
import './assets/style.css';

Vue.config.productionTip = false;
// Append firebase
Vue.prototype.$firebase = firebase;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
