const store = [
  {
    path:'outStoreHome',
    name:'outStoreHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import("@/views/store/outStore/outStoreHomePage.vue")
    },
    meta:{key:'store'}
  },
  {
    path:'outStoreHome/preOutList',
    name:'preOutList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/outStore/preOutList.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'outStoreHome/outList',
    name:'outList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/outStore/outList.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'outStoreHome/proOutDeta',
    name:'proOutDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/outStore/proOutDeta.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'outStoreHome/outDeta',
    name:'outDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/outStore/outDeta.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'inStoreHome',
    name:'inStoreHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import("@/views/store/inStore/inStoreHomePage.vue")
    },
    meta:{key:'store'}
  },
  {
    path:'inStoreHome/newPutIn',
    name:'newPutIn',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/inStore/newPutIn.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'inStoreHome/excalPutIn',
    name:'excalPutIn',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/inStore/excalPutIn.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'inStoreHome/returnPutIn',
    name:'returnPutIn',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/inStore/returnPutIn.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'inStoreHome/inList',
    name:'inList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import("@/views/store/inStore/inList.vue")
    },
    meta:{key:'store'}
  },
  {
    path:'inStoreHome/inDeta',
    name:'inDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import("@/views/store/inStore/inDeta.vue")
    },
    meta:{key:'store'}
  },
  {
    path:'storeManageHome',
    name:'storeManageHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import("@/views/store/storeManage/storeManageHomePage.vue")
    },
    meta:{key:'store'}
  },
  {
    path:'storeManageHome/storeManage',
    name:'storeManage',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/storeManage/manage.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'storeManageHome/newAllocation',
    name:'newAllocation',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/storeManage/newAllocation.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'storeManageHome/allocationList',
    name:'allocationList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/storeManage/allocationList.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'storeManageHome/allocationDeta',
    name:'allocationDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/storeManage/allocationDeta.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'storeManageHome/newCheck',
    name:'newCheck',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/storeManage/newCheck.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'storeManageHome/checkList',
    name:'checkList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/storeManage/checkList1.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'storeManageHome/checkDeta',
    name:'checkDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/store/storeManage/checkDeta1.vue')
    },
    meta:{key:'store'}
  },
  {
    path:'storeCount',
    name:'storeCount',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import("@/views/store/storeCount.vue")
    },
    meta:{key:'store'}
  },
  {
    path:'set',
    name:'set',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/set/setHomePage.vue')
    },
    meta:{key:'store'}
  }
];

export default store;
