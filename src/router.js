import Vue from 'vue'
import VueRouter from 'vue-router'

import login from './views/login.vue'
import home from './views/home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{name: 'login', path: '/login', component: login},
		{name: 'home', path: '/', component: home}
	]
})

router.beforeEach((to, from, next) => {
	let token = localStorage.getItem('token')
	if (token) {
		next()
	} else {
		if (to.path !== '/login') {
			next({path: '/login'})
		} else {
			next()
		}
	}
})

export default router