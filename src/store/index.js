import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'

Vue.use(Vuex);



const state = {
    token: window.sessionStorage.getItem('token'),
    username: window.sessionStorage.getItem('username') != undefined ? window.sessionStorage.getItem('username') : "",
    user_type: window.sessionStorage.getItem('user_type') != undefined ? window.sessionStorage.getItem('user_type') : 0,
    userImage: window.sessionStorage.getItem('userImage') != undefined ? window.sessionStorage.getItem('userImage') : "",
    user_id: window.sessionStorage.getItem('user_id') != undefined ? window.sessionStorage.getItem('user_id') : -1
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})