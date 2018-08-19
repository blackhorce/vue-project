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
// export const getUserList = params => {
// 	return axios.get('/users', params).then(res => res.data)
// }