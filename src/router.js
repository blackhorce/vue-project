import Vue from 'vue'
import VueRouter from 'vue-router'

import login from './views/login.vue'
import home from './views/home.vue'
import welcome from './views/welcome/welcome.vue'
import users from './views/user/users.vue'
import rights from './views/rights/rights.vue'
import roles from './views/rights/roles.vue'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{path: '*', redirect: '/'},
		{name: 'login', path: '/login', component: login},
		{
			name: 'home',
			path: '/',
			component: home,
			redirect: '/welcome',
			children: [
				{name: 'welcome', path: 'welcome', component: welcome},
				{name: 'users', path: 'users', component: users},
				{name: 'rights', path: 'rights', component: rights},
				{name: 'roles', path: 'roles', component: roles}
			]
		}
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