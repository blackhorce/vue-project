<template>
	<div class="login">
		<el-form :model="form" :rules="rules" ref="form" class="form">
			<el-form-item>
				<div class="avatar">
					<img src="../assets/avatar.jpg">
				</div>
			</el-form-item>
			<el-form-item prop="username">
				<el-input v-model="form.username" placeholder="账号" prefix-icon="myicon myicon-user"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input v-model="form.password" placeholder="密码" prefix-icon="myicon myicon-key" type="password"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" class="login-btn" @click="loginSubmit('form')">登录</el-button>
			</el-form-item>	
		</el-form>
	</div>
</template>

<script>
	import {loginPost} from '../api/index.js'

	export default {
		data() {
			return {
				form: {
					username: '',
					password: ''
				},
				rules: {
					username: [
						{required: true, message: '请输入用户名', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
			loginSubmit(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						loginPost(this.form).then(res => {
							if (res.meta.status === 200) {
								localStorage.setItem('token', res.data.token)
								this.$message({
									type: 'success',
									message: res.meta.msg
								})
								this.$router.push({name: 'home'})
							} else {
								this.$message({
									type: 'error',
									message: res.meta.msg
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		width: 100%;
		height: 100%;
		background: #2f4050;
		position: fixed;
		.form {
			width: 400px;
			padding: 0px 40px 15px 40px;
			margin: 200px auto;
			background: #fff;
			.avatar {
				position: relative;
				left: 50%;
				width: 120px;
				height: 120px;
				margin-left: -60px;
				margin-top: -60px;
				box-sizing: border-box;
				border-radius: 50%;
				border: 10px solid #fff;
				box-shadow: 0 1px 5px #ccc;
				overflow: hidden;
			}
			.login-btn {
				width: 100%;
			}
		}
	}
</style>