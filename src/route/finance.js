const finance = [
  {
    path:'chargeHome',
    name:'chargeHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/charge/chargeHomePage.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'chargeHome/inMoney',
    name:'inMoney',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import("@/views/finance/charge/inMoneyList.vue")
    },
    meta:{key:'finance'}
  },
  {
    path:'chargeHome/outMoney',
    name:'outMoney',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import("@/views/finance/charge/outMoneyList.vue")
    },
    meta:{key:'finance'}
  },
  {
    path:'repayHome',
    name:'repayHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/repay/repayHomePage.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'repayHome/customer',
    name:'customer',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/repay/customer.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'repayHome/supplier',
    name:'supplier',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/repay/supplier.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'repayHome/open',
    name:'open',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/repay/open.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'repayHome/clear',
    name:'clear',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/repay/clear.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'repayHome/store',
    name:'store',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/repay/store.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'accountHome',
    name:'accountHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/account/accountHomePage.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'accountHome/account',
    name:'account',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/account/account.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'accountHome/transfer',
    name:'transfer',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/account/transfer.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'accountHome/flow',
    name:'flow',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/account/flow.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'toloanHome',
    name:'toloanHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/toloan/toloanHomePage.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'toloanHome/in',
    name:'loanInList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/toloan/loanInList.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'toloanHome/out',
    name:'loanOutList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/toloan/loanOutList.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'financeCount',
    name:'financeCount',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/finance/financeCount.vue')
    },
    meta:{key:'finance'}
  },
  {
    path:'set',
    name:'financeSet',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/set/setHomePage.vue')
    },
    meta:{key:'finance'}
  }
];

export default finance;
