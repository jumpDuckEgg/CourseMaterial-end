import api from './http.js'

export default {
    //用户登录
    userLogin(params){
        return api.post('/login', params).then(res => res.data); 
    },
    // 用户注册
    userRegister(params){
        return api.post('/register',params).then(res => res.data);
    },
    //获取用户信息
    getAllUsers(){
        return api.get('/user');
    }
}