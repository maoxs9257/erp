const inventory = [
  {
    path:'productHome',
    name:'productHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/product/productHomePage.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'customerHome',
    name:'customerHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/customer/customerHomePage.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'customerHome/clear',
    name:'clearO',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/customer/clear.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'customerHome/customer',
    name:'customerO',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/customer/customer.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'customerHome/open',
    name:'openO',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/customer/open.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'customerHome/supplier',
    name:'supplierO',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/customer/supplier.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome',
    name:'saleHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/saleHomePage.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome/openSale',
    name:'openSale',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/openSale.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome/saleList',
    name:'saleList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/saleList.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome/saleDeta',
    name:'saleDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/saleDeta.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome/mySale',
    name:'mySale',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/mySale.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome/unfinOder',
    name:'unfinOder',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/unfinOder.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome/saleDep',
    name:'saleDep',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/saleDep.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome/returnGoods',
    name:'returnGoods',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/returnGoods.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'saleHome/returnDeta',
    name:'returnDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/sale/returnDeta.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome',
    name:'purchaseHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/purchaseHomePage.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/purchaseList',
    name:'purchaseList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/purchaseList.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/purchaseDeta',
    name:'purchaseDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/purchaseDeta.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/openPurchase',
    name:'openPurchase',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/openPurchase.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/clearList',
    name:'clearList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/clearList.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/clearDeta',
    name:'clearDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/clearDeta.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/openClear',
    name:'openClear',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/openClear.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/goods',
    name:'openGoods',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/openGoods.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/goodsList',
    name:'goodsList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/goodsList.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'purchaseHome/goodsDeta',
    name:'goodsDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/purchase/goodsDeta.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'stockHome',
    name:'stockHome',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/stock/stockHomePage.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'stockHome/stockQuery',
    name:'stockQuery',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/stock/stockQuery.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'stockHome/stockFlow',
    name:'stockFlow',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/stock/stockFlow.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'stockHome/stockLock',
    name:'stockLock',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/stock/stockLock.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'stockHome/lockList',
    name:'lockList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/stock/lockList.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'stockHome/lockDeta',
    name:'lockDeta',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/stock/lockDeta.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'stockHome/onRoadList',
    name:'onRoadList',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/stock/onRoadList.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'inventoryCount',
    name:'inventoryCount',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/inventory/inventoryCount.vue')
    },
    meta:{key:'inventory'}
  },
  {
    path:'set',
    name:'inventorySet',
    components:{
      default:()=> import('@/views/nav.vue'),
      main:()=> import('@/views/set/setHomePage.vue')
    },
    meta:{key:'inventory'}
  }
];

export default inventory;
