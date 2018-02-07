import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'

Vue.use(Vuex);

const state = {
    token:window.sessionStorage.getItem('token'),
    username:window.sessionStorage.getItem('username')
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})