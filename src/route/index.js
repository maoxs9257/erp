import Vue from 'vue'
import VueRouter from 'vue-router'



// 仓库
import store from '../store'
import axios from "axios";

import {Message} from "element-ui";

// 路由数据
import routes from './router'


Vue.use(VueRouter);

const router =new VueRouter({routes});

/**
* 路由拦截
* 权限验证
* */
router.beforeEach((to,form,next)=>{
  store.state.token = sessionStorage.getItem('youmuUser');
  store.state.headBack = sessionStorage.getItem('headBack');
  store.state.role = sessionStorage.getItem('role');
  if(to.name === 'login'||to.name === 'register'){
    next();
  }else{
		store.state.setJson = sessionStorage.getItem('set');
    if(store.state.token){
      if(inspectRole(to.name)){
        next();
      }else{
        Message.error('没有访问权限');
        next(form.path);
      }
    }else{
      next({path:'/login'})
    }
  }
});
router.afterEach((to,from)=>{
  if(to.name !== 'login'&&to.name !== 'register'&&to.name!=='workbench'){
    let params = {tenantId: JSON.parse(store.state.token).tenantId};
    axios.get('/api/storeTable/auditNotice',{params})
    .then(res=>{
      if(res.data&&res.data.data){
        store.state.news = res.data.data;
      }
    });
  }else{}
});

// 检查访问权限
function inspectRole(name){
  let role = JSON.parse(store.state.role);
  switch (name) {
    case 'homePage': return true;
    case 'inventoryHomePage': return role.erp_inventory;
    case 'financeHomePage' : return role.erp_finance;
    case 'storeHomePage': return role.erp_store;
    case 'workbench': return true;
    case 'productHome': return role.erp_inventory;
    case 'customerHome': return role.erp_inventory;
    case 'saleHome' :return role.erp_inventory;
    case 'purchaseHome': return role.erp_inventory;
    case 'customerO': return role.erp_inventory&&role.erp_customer_look;
    case 'supplierO': return role.erp_inventory&&role.erp_supplier_look;
    case 'openO': return role.erp_inventory&&role.erp_open_look;
    case 'clearO': return role.erp_inventory&&role.erp_clear_look;
    case 'openSale': return role.erp_inventory&&role.erp_sale_new;
    case 'saleList': return role.erp_inventory&&role.erp_sale_look;
    case 'saleDeta' : return role.erp_inventory&&role.erp_sale_look;
    case 'mySale': return role.erp_inventory&&role.erp_sale_look;
    case 'saleDep': return role.erp_inventory&&role.erp_saledep_look;
    case 'returnGoods':return role.erp_inventory&&role.erp_sale_look;
    case 'returnDeta': return role.erp_inventory&&role.erp_sale_look;
    case 'openPurchase':return role.erp_inventory&&role.erp_purchase_new;
    case 'purchaseList': return role.erp_inventory&&role.erp_purchase_look;
    case 'purchaseDeta': return role.erp_inventory&&role.erp_purchase_look;
    case 'openGoods': return role.erp_inventory&&role.erp_stock_new;
    case 'goodsList': return role.erp_inventory&&role.erp_stock_look;
    case 'goodsDeta': return role.erp_inventory&&role.erp_stock_look;
    case 'openClear': return role.erp_inventory&&role.erp_clearance_new;
    case 'clearList': return role.erp_inventory&&role.erp_clearance_look;
    case 'clearDeta': return role.erp_inventory&&role.erp_clearance_look;
    case 'stockHome': return role.erp_inventory;
    case 'stockQuery': return role.erp_inventory&&role.erp_lockgoods_look;
    case 'stockFlow' : return role.erp_inventory&&role.erp_lockgoods_look;
    case 'stockLock' : return role.erp_inventory&&role.erp_lockgoods_new;
    case 'lockList' : return role.erp_inventory&&role.erp_lockgoods_look;
    case 'lockDeta' : return role.erp_inventory&&role.erp_lockgoods_look;
    case 'onRoadList': return role.erp_inventory&&role.erp_onroad_look;
    case 'inventoryCount': return role.erp_inventory&&role.erp_inventoryfrom_look;
    case 'chargeHome' : return role.erp_finance;
    case 'repayHome' : return role.erp_finance;
    case 'accountHome' : return role.erp_finance;
    case 'toloanHome' : return role.erp_finance;
    case 'financeCount' : return role.erp_finance&&role.erp_financeform_look;
    case 'outMoney': return role.erp_finance&&role.erp_inout_look;
    case 'inMoney' : return role.erp_finance&&role.erp_inout_look;
    case 'customer' : return role.erp_finance&&role.erp_pay_look;
    case 'supplier' : return role.erp_finance&&role.erp_pay_look;
    case 'open' : return role.erp_finance&&role.erp_pay_look;
    case 'clear' : return role.erp_finance&&role.erp_pay_look;
    case 'store' : return role.erp_finance&&role.erp_pay_look;
    case 'account' : return role.erp_finance&&role.erp_account_look;
    case 'transfer' : return role.erp_finance&&role.erp_tranacc_look;
    case 'flow' : return role.erp_finance&&role.erp_flow_look;
    case 'loanOutList' : return role.erp_finance&&role.erp_loan_look;
    case 'loanInList' : return role.erp_finance&&role.erp_loan_look;
    case 'outStoreHome' : return role.erp_store;
    case 'inStoreHome' : return role.erp_store;
    case 'storeManageHome' : return role.erp_store;
    case 'storeCount' : return role.erp_store&&role.erp_storeform_look;
    case 'preOutList' : return role.erp_store&&role.erp_outstore_look;
    case 'outList' : return role.erp_store&&role.erp_outstore_look;
    case 'proOutDeta': return role.erp_store&&role.erp_outstore_look;
    case 'outDeta' : return role.erp_store&&role.erp_outstore_look;
    case 'newPutIn' : return role.erp_store&&role.erp_instore_new;
    case 'excalPutIn' : return role.erp_store&&role.erp_instore_new;
    case 'returnPutIn' : return role.erp_store&&role.erp_instore_new;
    case 'inList' : return role.erp_store&&role.erp_instore_look;
    case 'inDeta' : return role.erp_store&&role.erp_instore_look;
    case 'storeManage' : return role.erp_store&&role.erp_store_look;
    case 'newAllocation' : return role.erp_store&&role.erp_allocation_new;
    case 'allocationList' : return role.erp_store&&role.erp_allocation_look;
    case 'allocationDeta' : return role.erp_store&&role.erp_account_look;
    case 'newCheck': return role.erp_store&&role.erp_Inventory_new;
    case 'checkList' : return role.erp_store&&role.erp_Inventory_look;
		case 'checkDeta' : return role.erp_store&&role.erp_Inventory_look;
		
    case 'set' : return true;
    case 'financeSet' : return true;
    case 'inventorySet' : return true;
    default: return false;
  }
}

export default router;
