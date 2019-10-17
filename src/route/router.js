import inventory from "./inventory";
import store from "./store";
import finance from "./finance";

const home = [
  {
    path:'/',
    name:'homePage',
    component:()=> import('@/views/homePage.vue')
  },
  {
    path:'/storeHomePage',
    name:'storeHomePage',
    component:()=> import("@/views/store/storeHomePage.vue")
  },
  {
    path:'/store',
    component:()=> import('@/views/main.vue'),
    children:store,
  },
  {
    path:'/financeHomePage',
    name:'financeHomePage',
    component:()=> import('@/views/finance/financeHomePage.vue')
  },
  {
    path:'/finance',
    component:()=> import('@/views/main.vue'),
    children:finance
  },
  {
    path:'/inventoryHomePage',
    name:'inventoryHomePage',
    component:()=> import('@/views/inventory/inventoryHomePage.vue')
  },
  {
    path:'/inventory',
    component:()=> import('@/views/main.vue'),
    children:inventory
  },
  {
    path:'/login',
    name:'login',
    component:()=> import('@/views/login/login.vue')
  },
  {
    path:'/workbench',
    name:'workbench',
    component:() => import('@/views/workbench.vue')
  }
];

export default home;
