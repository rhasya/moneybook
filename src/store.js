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

      localStorage.setItem('uid', payload.uid);
    },
    logout(state) {
      state.email = null;
      state.btnName = 'Login';

      delete localStorage.uid;
    },
    redirect(state, payload) {
      state.redirectTo = payload.redirectTo;
    },
    clearRedirect(state) {
      delete state.redirectTo;
    },
  },
  actions: {

  },
});
