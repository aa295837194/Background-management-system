import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import Welcome  from "../components/Welcome";
import Users from '../components/User/Users'
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:"/login"},
  {path:'/login',component:login},
  {path:'/home',component: home,redirect: '/Welcome',children:[
      {path:'/Welcome',component:Welcome},
      {path:'/users',component: Users}
      ]}
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    return next();

  }
  const tokenstr =window.sessionStorage.getItem('token');
  if(!tokenstr){
    return next('/login');
  }
  next();
})
export default router
