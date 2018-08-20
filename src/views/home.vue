<template>
	<div class="home">
		<el-container>
			<el-aside width="auto">
				<div class="logo"></div>
				<el-menu default-active="1" :unique-opened="true" :router="true" :collapse="isCollapse" class="el-menu-admin" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
					<el-submenu :index="menu.path" v-for="menu in menus" :key="menu.id">
						<template slot="title">
							<i class="el-icon-location"></i>
							<span>{{menu.authName}}</span>
						</template>
						<el-menu-item :index="submenu.path" v-for="submenu in menu.children" :key="submenu.id">
							<i class="el-icon-menu"></i>
							<span slot="title">{{submenu.authName}}</span>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-container>
				<el-header>
					<i class="myicon myicon-menu toggle-btn" @click="toggleCollapse"></i>
					<div class="system-title">电商后台管理系统</div>
					<div>
						<span class="welcome">您好，{{$store.state.username}}</span>
						<el-button type="text" @click="logout">退出</el-button>
					</div>
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import {getMenus} from '../api/index.js'

	export default {
		data() {
			return {
				isCollapse: false,
				menus: []
			}
		},
		methods: {
			toggleCollapse() {
				this.isCollapse = !this.isCollapse
			},
			logout() {
				localStorage.removeItem('token')
				this.$router.push('/login')
			}
		},
		created() {
			getMenus().then(res => {
				if (res.meta.status === 200) {
					this.menus = res.data
				} else {
					this.$message({
						type: 'warning',
						message: res.meta.msg
					})
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		height: 100%;
		background-color: #E5E5E5;
		.el-menu-admin:not(.el-menu--collapse) {
			width: 200px;
			min-height: 400px;
		}
		.el-container {
			height: 100%;
		}
		.el-aside {
			background-color: #545c64;
		}
		.el-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #545c64;
		}
		.logo {
			height:60px;
			background: url(../assets/logo.png);
			background-size: cover;
			background-color: white;
		}
		.toggle-btn {
			padding: 0 10px;
			margin-left: -20px;
			font-size: 36px;
			line-height: 60px;
			color: white;
			cursor: pointer;
			&:hover {
				background-color: #00635a;
			}
		}
		.system-title {
			font-size: 28px;
			color: white;
		}
		.welcome, {
			color: white;
		}
	}
</style>