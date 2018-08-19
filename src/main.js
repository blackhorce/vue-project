import Vue from 'vue'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import './styles/index.scss'
import router from './router.js'

Vue.use(ElementUi)

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
