<template>
	<div class="rights">
		<el-row>
			<el-col :span="24">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
					<el-breadcrumb-item>权限管理</el-breadcrumb-item>
					<el-breadcrumb-item>权限列表</el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
		</el-row>
		<el-table :data="rightsList" v-loading="loading" border style="width: 100%; margin-top: 20px;">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="authName" label="权限名称"></el-table-column>
			<el-table-column prop="path" label="路径"></el-table-column>
			<el-table-column label="层级">
				<template slot-scope="scope">
					<span>{{scope.row.level | fmtLevel}}</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import {getRightsList} from '../../api/index.js'

	export default {
		data() {
			return {
				loading: false,
				rightsList: []
			}
		},
		filters: {
			fmtLevel(level) {
				switch (level) {
					case '0':
						return '一级'
					case '1':
						return '二级'
					case '2':
						return '三级'
				}
			}
		},
		created() {
			this.loading = true
			getRightsList({type: 'list'}).then(res => {
				if (res.meta.status === 200) {
					this.rightsList = res.data
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
	
</style>