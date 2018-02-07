import * as types from './types.js'

const mutations = {
    [types.LOGIN]:(state,data)=>{
        state.token = data.token;
        state.username = data.username;
        window.sessionStorage.setItem('token',data.token);
        window.sessionStorage.setItem('username',data.username);
    },
    [types.LOGOUT]:(state,data)=>{
        state.token = null;
        state.username = null;
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('username');
    }
}

export default mutations;