<template>
	<div>
		home
	</div>
</template>

<script>
	import {getUserList} from '../api/index.js'

	export default {
		data() {
			return {}
		},
		mounted() {
			this.renderUserList()
		},
		methods: {
			renderUserList() {
				getUserList({pagenum: 1, pagesize: 1}).then(res => {
					console.log(res)
				})
			}
		}
	}
</script>

<style>
	
</style>