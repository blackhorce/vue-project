<template>
	<div class="user">
		<el-row>
			<el-col :span="24">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>用户管理</el-breadcrumb-item>
					<el-breadcrumb-item>用户列表</el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-input placeholder="请输入内容" class="search-input">
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
				<el-button type="success" plain>添加用户</el-button>
			</el-col>
		</el-row>
		<el-table :data="userList" border style="width: 100%; margin-top: 20px;">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="username" label="姓名"></el-table-column>
			<el-table-column prop="email" label="邮箱"></el-table-column>
			<el-table-column prop="mobile" label="电话"></el-table-column>
			<el-table-column label="用户状态">
				<template slot-scope="scope">
					<el-switch v-model="value3"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" plain icon="el-icon-edit"></el-button>
					<el-button size="mini" type="danger" plain icon="el-icon-delete"></el-button>
					<el-button size="mini" type="warning" plain icon="el-icon-check"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
		</div>
	</div>
</template>

<script>
	import {getUserList} from '../../api/index.js'

	export default {
		data() {
			return {
				value3: '',
				userList: [],
				currentPage1: 5,
				currentPage2: 5,
				currentPage3: 5,
				currentPage4: 4
			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			initUserList() {
				getUserList({params: {pagenum: 1, pagesize: 3}}).then(res => {
					this.userList = res.data.users
				})
			}
		},
		created() {
			this.initUserList()
		}
	}
</script>

<style lang="scss" scoped>
	.user {
		.search-input {
			width: 300px;
		}
		.page {
			margin-top: 20px;
			padding: 5px 0;
			background-color: #D3DCE6;
		}
	}
</style>