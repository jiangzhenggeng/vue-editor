
import * as types from './types';

export const showPageLoading = ({ commit }) => {
	commit(types.PAGE_LOADING_QUERY, {
		show: true
	})
};
export const hidePageLoading = ({ commit }) => {
	commit(types.PAGE_LOADING_QUERY, {
		show: false
	})
};

export const showBrowseUpdate = ({ commit }) => {
	commit(types.SHOW_BROWSE_UPDATE, {
		show_update: true
	})
};

export const hideBrowseUpdate = ({ commit }) => {
	commit(types.SHOW_BROWSE_UPDATE, {
		show_update: false
	})
};