import * as types from './types'

export default {
    UserLogin({commit},data){
        commit(types.LOGIN,data);
    },
    UserLogout({commit},data){
        commit(types.LOGOUT,data)
    },
    UserUpdateLogo({ commit }, data) {
        commit(types.UPDATELOGO, data)
    }

}