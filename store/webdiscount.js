export const state = () => ({
    searchCarList : [],
    currentParkingInfo : {},
    totalSalesPrice : 0
});

export const mutations = {
    SET_SEARCH_LIST(state, newValue) {
        state.searchCarList = newValue;
    },
    SET_CURRENT_CAR : function (state, newValue = {}) {
        state.currentParkingInfo = newValue;
        tool_app.log('*************** SET_CURRENT_CAR *****************');
        tool_app.log(newValue);
    },
    RESET(state){
        state.searchCarList = [];
        state.currentParkingInfo = {};
    }
}

export const getters = {
    getSearchCarList: function (state) {
        return state.searchCarList
    },
    get_currentCar(state){
        return state.currentCar;
    }
}

export const actions = {
    resetInfo({ commit, dispatch, getters }){
        commit("RESET");
    }
}

// ===
// Private helpers
// ===
