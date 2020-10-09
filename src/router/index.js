import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import MyDemo from '../components/MyDemo.vue'
import RegisterUser from '../components/RegisterUser.vue'
Vue.use(VueRouter)




const router = new VueRouter({
    // 配置路由信息

    routes: [
        {
            path: '/',
            redirect: 'login'
        },
        {
            path: '/login',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/MyDemo',
            name: 'MyDemo',
            component: MyDemo
        },
        {
            path: '/goRegister',
            name: 'RegisterUser',
            component: RegisterUser
        }
    ]

});

router.beforeEach((to, from, next) => {
    //若要跳转的页面是登录界面
    if (to.path === '/login' || to.path == '/goLogin') {
        next();
    }
    else if (to.path == '/goRegister') {
        next();
    }
    //其他跳转
    else {
        //获取本地存储的token值
        let token = localStorage.getItem('token');
        //若token为空则验证不成功，跳转到登录页面
        if (token === null || token === '') {
            next('/login');
        } else {
            next();
        }
    }

});



export default router;



