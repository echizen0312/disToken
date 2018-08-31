import Vue from 'vue'
import Router from 'vue-router'
import Other from './components/Other.vue'
import AccountList from './components/AccountList.vue'
import Account from './components/Account.vue'
import Transfer from './components/Transfer.vue'
import TransferList from './components/TransferList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', name: 'Home', component: AccountList},
    {path: '/Other', name: 'Other', component: Other},
    {path: '/AccountList', name: 'AccountList', component: AccountList},
    {path: '/Account/:name', name: 'Account', component: Account},
    {path: '/Transfer/:name/:token', name: 'Transfer', component: Transfer},
    {path: '/TransferList/:name/:token', name: 'TransferList', component: TransferList}
  ]
})
