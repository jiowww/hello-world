import Vue from 'vue'
import App from './App.vue'
import View from 'view-design'
import router from './router/index.js'
import 'view-design/dist/styles/iview.css'
import store from './store/main'
Vue.config.productionTip = false
import axios from 'axios'
// import jwt from 'jwt-decode'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; 
// import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'http://localhost:8090/ssm'
Vue.prototype.$axios = axios

Vue.config.productionTip = false
// Vue.use(axios,VueAxios);
Vue.use(View);
Vue.use(axios);
Vue.use(router);
new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')

//请求拦截器
axios.interceptors.request.use(config => {
  //判断是否存在token，如果存在将每个页面的header都添加token
  console.log(store.state.token);
  if (store.state.token) {
    config.headers.common['XX-Token'] = localStorage.getItem('token')
  }


  return config;
}, error => {
  // 请求错误
  return Promise.reject(error);
});

axios.interceptors.response.use(
  response => {
    console.log("response");
    console.log(response.data);
    return response;
  },

  error => {
    console.log("errorResponse");
    console.log(error.response);
    if (error.response) {

      switch (error.response.status) {
        case 401:
          console.log("aaa" + error.response.status)
          store.commit('delToken');
          //跳转到登录页面
          router.replace({
            path: '/login',
            // 将跳转的路由path作为参数，登录成功后跳转到该路由
            query: { redirect: router.currentRoute.fullPath }
          });
      }
    }
    return Promise.reject(error.response);
  }
);

