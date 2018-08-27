import Vue from 'vue'
// import App from './App'
import App2 from './App2'
import router from './router'
// import 'element-ui/lib/theme-chalk/index.css'
// import ElementUI from 'element-ui'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'material-design-icons/iconfont/material-icons.css'
import Message from 'muse-ui-message'
import 'muse-ui-message/dist/muse-ui-message.css'
import Loading from 'muse-ui-loading'
import 'muse-ui-loading/dist/muse-ui-loading.css'
import VueCookies from 'vue-cookies'
import VueResource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'

// Vue.use(ElementUI)
Vue.use(MuseUI)
Vue.use(Message)
Vue.use(Loading)
Vue.use(VueCookies)
Vue.use(VueResource)
Vue.use(VueClipboard)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App2)
}).$mount('#app')
