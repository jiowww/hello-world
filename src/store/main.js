import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    uerInfo: '',
  },
  mutations: {
    //存储token
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token.token);
    },
    //删除token
    delToken(state) {
      state.token = '';
      localStorage.removeItem("token");
    },
    setUserInfo(state, userInfo) {
      state.uerInfo = userInfo;
      localStorage.setItem("userInfo", userInfo);
    }

  },
  getters: {
    getUserInfo(state) {
      return state.uerInfo;
    }
  }
});
