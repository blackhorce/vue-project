<template>
	<div class="roles">
		<el-row>
			<el-col :span="24">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
					<el-breadcrumb-item>权限管理</el-breadcrumb-item>
					<el-breadcrumb-item>角色列表</el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24"><el-button type="primary" plain>添加角色</el-button></el-col>
		</el-row>
		<el-table :data="roleList" v-loading="loading" border style="width: 100%; margin-top: 20px;">
			<el-table-column type="expand">
				<template slot-scope="scope">
					<el-row v-for="firstChild in scope.row.children" :key="firstChild.id">
						<el-col :span="4">
							<el-tag closable @close="deleteRights(scope.row, firstChild.id)">{{firstChild.authName}}</el-tag>
							<i class="el-icon-arrow-right" v-if="firstChild.children.length"></i>
						</el-col>
						<el-col :span="20">
							<el-row v-for="secondChild in firstChild.children" :key="secondChild.id">
								<el-col :span="4">
									<el-tag closable type="success" @close="deleteRights(scope.row, secondChild.id)">{{secondChild.authName}}</el-tag>
									<i class="el-icon-arrow-right" v-if="secondChild.children.length"></i>
								</el-col>
								<el-col :span="20">
									<el-tag closable type="warning" v-for="thirdChild in secondChild.children" :key="thirdChild.id" @close="deleteRights(scope.row, thirdChild.id)">{{thirdChild.authName}}</el-tag>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
					<el-row v-if="!scope.row.children.length">
						<el-col :span="24">该角色没有分配权限，请前往分配！</el-col>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column prop="roleName" label="角色名称"></el-table-column>
			<el-table-column prop="roleDesc" label="描述"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" plain icon="el-icon-edit" title="编辑角色"></el-button>
					<el-button size="mini" type="danger" plain icon="el-icon-delete" title="删除角色"></el-button>
					<el-button size="mini" type="warning" plain icon="el-icon-check" title="授权角色" @click="showRightsTreeDialog(scope.row)"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="授权角色" :visible.sync="rightsTreeDialogVisible">
			<div class="tree-container">
				<el-tree :data="rightsTree" show-checkbox node-key="id" :props="defaultProps" :default-checked-keys="selectedRights" :default-expand-all="true">
				</el-tree>
			</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="rightsTreeDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="rightsTreeDialogVisible = false">确 定</el-button>
		</span>
	</el-dialog>
	</div>
</template>

<script>
	import {getRoleList, deleteRoleRights, getRightsList} from '../../api/index.js'

	export default {
		data() {
			return {
				loading: false,
				roleList: [],
				rightsTreeDialogVisible: false,
				rightsTree: [],
				selectedRights: [],
				defaultProps: {
					children: 'children',
					label: 'authName'
				}
			}
		},
		methods: {
			deleteRights(row, rightId) {
				deleteRoleRights({roleId: row.id, rightId}).then(res => {
					if (res.meta.status === 200) {
						row.children = res.data
					} else {
						this.$message({
							type: 'warning',
							message: res.meta.msg
						})
					}
				})
			},
			showRightsTreeDialog(row) {
				this.rightsTreeDialogVisible = true
				getRightsList({type: 'tree'}).then(res => {
					if (res.meta.status === 200) {
						this.rightsTree = res.data
					} else {
						this.$message({
							type: 'warning',
							message: res.meta.msg
						})
					}
					this.selectedRights.length = 0
					row.children.forEach(first => {
						if (first.children.length) {
							first.children.forEach(second => {
								if (second.children.length) {
									second.children.forEach(third => {
										this.selectedRights.push(third.id)
									})
								}
							})
						}
					})
				})
			}
		},
		created() {
			this.loading = true
			getRoleList().then(res => {
				if (res.meta.status === 200) {
					this.roleList = res.data
				} else {
					this.$message({
						type: 'warning',
						message: res.meta.msg
					})
				}
				this.loading = false
			})
		}
	}
</script>

<style lang="scss" scoped>
	.roles {
		.el-tag {
			margin: 0 5px 5px 0;
		}
		.tree-container {
			height: 300px;
			overflow: auto;
		}
	}
</style>