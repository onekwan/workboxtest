import {getFirebaseBackend} from '../helpers/firebase/authUtils'
import axios from "axios";


export const state = () => ({
    currentProduct: null,
    availableQuota: 0,
    orderCnt: 0,
    orderId: null,
    paymentId : null,

    //결제 관련
    orderData : {},
    mainZoneID : null,
    payMethod : null
});


export const mutations = {
    SET_CURRENT_PRODUCT(state, newValue) {
        state.currentProduct = newValue;
        state.availableQuota = newValue.availableQuota_local;
    },
    SET_PASS_DATE(state, newValue) {
        state.currentProduct.passStart = newValue.passStart;
        state.currentProduct.passEnd = newValue.passEnd;
    },
    CLEAR_DATA(state, newValue) {
        state.currentProduct = null;
        state.availableQuota = 0;
        state.orderCnt = 0;
        state.orderId = 0;
        state.paymentId = 0;
    },
    SET_ORDER_CNT(state, newValue) {
        state.orderCnt = newValue;
    },
    SET_ORDER_ID(state, newValue) {
        state.orderId = newValue;
    },
    SET_PAYMENT_ID(state, newValue) {
        state.paymentId = newValue;
    },
    SET_ORDER_DATA(state, newValue) {
        state.orderData = newValue;
    },
    SET_MAIN_ZONE_ID(state, newValue) {
        state.mainZoneID = newValue;
    },
    SET_PAY_METHOD(state, newValue) {
        state.payMethod = newValue;
    }
}

export const getters = {
    currentProduct(state) {
        return state.currentProduct;
    },
    availableQuota(state) {
        return state.availableQuota;
    },
    orderCnt(state) {
        return state.orderCnt;
    },
    orderId(state) {
        return state.orderId;
    },
    paymentId(state) {
        return state.paymentId;
    },
}

export const actions = {}
