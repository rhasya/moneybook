import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    email: null,
    btnName: '...',
  },
  mutations: {
    login(state, payload) {
      state.email = payload.email;
      state.btnName = 'Logout';
    },
    logout(state) {
      state.email = null;
      state.btnName = 'Login';
    },
  },
  actions: {

  },
});
