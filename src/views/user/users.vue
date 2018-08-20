<template>
	<div class="user">
		<el-row>
			<el-col :span="24">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
					<el-breadcrumb-item>用户管理</el-breadcrumb-item>
					<el-breadcrumb-item>用户列表</el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initUserList">
					<el-button slot="append" icon="el-icon-search" @click="initUserList"></el-button>
				</el-input>
				<el-button type="success" plain @click="addDialogFormVisible = true">添加用户</el-button>
			</el-col>
		</el-row>
		<el-table :data="userList" v-loading="loading" border style="width: 100%; margin-top: 20px;">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="username" label="姓名"></el-table-column>
			<el-table-column prop="email" label="邮箱"></el-table-column>
			<el-table-column prop="mobile" label="电话"></el-table-column>
			<el-table-column label="用户状态">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" plain icon="el-icon-edit" title="编辑用户" @click="showEditDialog(scope.row)"></el-button>
					<el-button size="mini" type="danger" plain icon="el-icon-delete" title="删除用户" @click="showDeleteDialog(scope.row)"></el-button>
					<el-button size="mini" type="warning" plain icon="el-icon-check" title="分配角色" @click="showGrantDialog(scope.row)"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
		<el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
			<el-form :model="addForm" ref="addForm" :rules="rules" label-width="80px">
				<el-form-item label="姓名" prop="username">
					<el-input v-model="addForm.username" auto-complete="off" ref="addUsername"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="addForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUserSubmit('addForm')">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
			<el-form :model="editForm" ref="editForm" :rules="rules" label-width="80px">
				<el-form-item label="姓名" prop="username">
					<el-tag type="info">{{editForm.username}}</el-tag>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="editForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUserSubmit('editForm')">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="分配用户角色" :visible.sync="grantDialogFormVisible">
			<el-form :model="grantForm" label-width="120px">
				<el-form-item label="当前的用户">
					<el-tag type="info">{{grantForm.username}}</el-tag>
				</el-form-item>
				<el-form-item label="请选择角色：">
					<el-select placeholder="请选择角色" v-model="roleId">
						<el-option v-for="(role, index) in roleList" :key="index" :label="role.roleName" :value="role.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="grantDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {getUserList, changeUserState, addUser, getUserById, editUser, deleteUser, getRoleList, grantRole} from '../../api/index.js'

	export default {
		data() {
			return {
				loading: false,
				userList: [],
				total: 0,
				query: '',
				pagenum: 1,
				pagesize: 5,
				currentPage: 1,
				addDialogFormVisible: false,
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				editDialogFormVisible: false,
				editForm: {
					username: '',
					email: '',
					mobile: '',
					id: 0
				},
				grantDialogFormVisible: false,
				grantForm: {},
				roleList: [],
				roleId: '',
				rules: {
					username: [{required: true, message: '请输入姓名', trigger: 'blur'}],
					password: [{required: true, message: '请输入密码', trigger: 'blur'}],
					email: [
						{required: true, message: '请输入邮箱', trigger: 'blur'},
						{type: 'email', message: '请输入正确格式的邮箱', trigger: 'blur'}
					],
					mobile: [
						{required: true, message: '请输入电话', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
			handleSizeChange(val) {
				this.pagesize = val
				this.initUserList()
			},
			handleCurrentChange(val) {
				this.pagenum = val
				this.initUserList()
			},
			initUserList() {
				this.loading = true
				getUserList({params: {query: this.query, pagenum: this.pagenum, pagesize: this.pagesize}}).then(res => {
					if (res.meta.status === 200) {
						this.userList = res.data.users
						this.total = res.data.total
					} else {
						this.$message({
							type: 'warning',
							message: res.meta.msg
						})
					}
					this.loading = false
				})
			},
			changeState(row) {
				changeUserState({uid: row.id, type: row.mg_state}).then(res => {
					let msgType = res.meta.status === 200 ? 'success' : 'warning'
					this.$message({
						type: msgType,
						message: res.meta.msg
					})
				})
			},
			addUserSubmit(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						addUser(this.addForm).then(res => {
							if (res.meta.status === 201) {
								this.$message({
									type: 'success',
									message: '添加用户成功'
								})
								this.addDialogFormVisible = false
								for (let k in this.addForm) {
									this.addForm[k] = ''
								}
							} else if (res.meta.status === 400) {
								this.$message({
									type: 'warning',
									message: res.meta.msg
								})
								this.addForm.username = ''
								this.$refs['addUsername'].focus()
							} else {
								this.$message({
									type: 'warning',
									message: res.meta.msg
								})
							}
							this.initUserList()
						})
					}
				})
			},
			showEditDialog(row) {
				this.editDialogFormVisible = true
				getUserById(row.id).then(res => {
					if (res.meta.status === 200) {
						this.editForm.username = res.data.username
						this.editForm.email = res.data.email
						this.editForm.mobile = res.data.mobile
						this.editForm.id = res.data.id
					}
				})
			},
			editUserSubmit(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						editUser(this.editForm).then(res => {
							let type = res.meta.status === 200 ? 'success' : 'warning'
							this.$message({
								type,
								message: res.meta.msg
							})
							this.editDialogFormVisible = false
							this.initUserList()
						})
					}
				})
			},
			showDeleteDialog(row) {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteUser(row.id).then(res => {
						let type = res.meta.status === 200 ? 'success' : 'warning'
						this.$message({
							type,
							message: res.meta.msg
						})
						this.initUserList()
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})          
				})
			},
			showGrantDialog(row) {
				this.grantDialogFormVisible = true
				this.grantForm = row
				getRoleList().then(res => {
					if (res.meta.status === 200) {
						this.roleList = res.data
					} else {
						this.$message({
							type: 'warning',
							message: res.meta.msg
						})
					}
				})
			},
			grantRoleSubmit() {
				if (!this.roleId) {
					this.$message({
						type: 'warning',
						message: '角色不能为空，请选择角色！'
					})
					return
				}
				grantRole({id: this.grantForm.id, rid: this.roleId}).then(res => {
					if (res.meta.status === 200) {
						this.$message({
							type: 'success',
							message: res.meta.msg
						})
						this.grantDialogFormVisible = false
					} else {
						this.$message({
							type: 'warning',
							message: res.meta.msg
						})
					}
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