import * as types from './types.js'

const mutations = {
    [types.LOGIN]:(state,data)=>{
        state.token = data;
        window.sessionStorage.setItem('token',data);
    },
    [types.LOGOUT]:(state,data)=>{
        state.token = null;
        window.sessionStorage.removeItem('token');
    }
}

export default mutations;