import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const initState = {
	//页面加载提示
	show: true,
	//显示更新浏览器
	show_update: !( window.File && window.FileList && window.Blob && (window.FileReader || window.FormData) )
};

export default new Vuex.Store({
	state: initState,
	actions,
	mutations,
});
