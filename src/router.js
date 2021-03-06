import Vue from 'vue'
import Router from 'vue-router'
import Other from './components/Other.vue'
import AccountList from './components/AccountList.vue'
import Account from './components/Account.vue'
import Transfer from './components/Transfer.vue'
import TransferList from './components/TransferList.vue'
import Web from './components/Web.vue'
import QrCode from './components/QrCode.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {path: '/', name: 'Home', component: AccountList},
        {path: '/Other', name: 'Other', component: Other},
        {path: '/AccountList', name: 'AccountList', component: AccountList},
        {path: '/Account/:id', name: 'Account', component: Account},
        {path: '/Transfer/:id/:token', name: 'Transfer', component: Transfer},
        {path: '/TransferList/:id/:token', name: 'TransferList', component: TransferList},
        {path: '/Web', name: 'Web', component: Web},
        {path: '/Tracker/:trx_id', name: 'Tracker', component: Web},
        {path: '/QrCode/:id', name: 'QrCode', component: QrCode}
    ]
})
