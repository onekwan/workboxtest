export const state = () => ({
    bizInfo: {},
    payDocumentType: '',
});

export const mutations = {
    SET_BIZ_INFO(state, newValue){
      state.bizInfo = newValue;
    },
    SET_PAY_DOCUMENT_TYPE(state, newValue){
      state.payDocumentType = newValue;
    },
    RESET(state){
        state.bizInfo = {};
        state.payDocumentTypeData = '';
    }
}

export const getters = {
   getBizInfo: function (state){
     return state.bizInfo;
   },
   getPayDocumentType: function (state){
     return state.payDocumentType;
   }
}

export const actions = {
    resetInfo({ commit, dispatch, getters }){
        commit("RESET");
    }
}
