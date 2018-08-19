import axios from 'axios'

const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL

axios.interceptors.request.use(config => {
	let token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = token
	}
	return config
}, error => Promise.reject(error))

// 登录验证
export const loginPost = params => {
	return axios.post('/login', params).then(res => {
		return res.data
	})
}

// 请求用户列表
export const getUserList = params => {
	return axios.get('/users', params).then(res => res.data)
}

// 修改用户状态
export const changeUserState = params => {
	return axios.put(`users/${params.uid}/state/${params.type}`).then(res => res.data)
}

// 添加用户
export const addUser = params => {
	return axios.post('users', params).then(res => res.data)
}

// 根据用户id获取信息
export const getUserById = params => {
	return axios.get(`users/${params}`).then(res => res.data)
}

// 编辑用户
export const editUser = params => {
	return axios.put(`users/${params.id}`, params).then(res => res.data)
}

// 删除用户
export const deleteUser = params => {
	return axios.delete(`users/${params}`).then(res => res.data)
}

// 获取角色列表
export const getRoleList = () => {
	return axios.get('roles').then(res => res.data)
}

// 分配角色
export const grantRole = params => {
	return axios.put(`users/${params.id}/role`, params).then(res => res.data)
}

// 获取权限列表
export const getRightsList = params => {
	return axios.get(`rights/${params.type}`).then(res => res.data)
}

// 删除角色指定权限
export const deleteRoleRights = params => {
	return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`).then(res => res.data)
}