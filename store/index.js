import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import state from './state.js'
import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

export default new Vuex.Store({
	state,
	actions,
	mutations,
	getters
})