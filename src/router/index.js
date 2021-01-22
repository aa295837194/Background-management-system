import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import Welcome  from "../components/Welcome";
import Users from '../components/User/Users'
import Rights from "../components/Power/Rights";
import Roles from "../components/Power/Roles";
import goodsCate from "../components/goods/goodsCate";
import order from "../components/order/order";
import goodsList from "../components/goods/goodsList";
import addGood from "../components/goods/addGood";
import cateParams from "../components/goods/cateParams";
import report from "../components/report/report";
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:"/login"},
  {path:'/login',component:login},
  {path:'/home',component: home,redirect: '/Welcome',children:[
      {path:'/Welcome',component:Welcome},
      {path:'/users',component: Users},
          {path:'/rights',component: Rights},
          {path:'/roles',component: Roles},
          {path:'/categories',component: goodsCate},
          {path:'/orders',component: order},
          {path:'/goods',component: goodsList},
          {path:'/goods/addGood',component: addGood},
          {path:'/params',component: cateParams},
          {path: '/reports',component: report}

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
