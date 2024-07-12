import {getFirebaseBackend} from '../helpers/firebase/authUtils'
import jwt, {currentUserInit} from '../plugins/main/jwt'
import axios from "axios";


export const state = () => ({
    currentUser: jwt.getUser(),
    token: jwt.getToken()
});


export const mutations = {
    SET_CURRENT_USER(state, newValue) {
        state.currentUser = newValue;
        jwt.saveUser(newValue);
    },
    SET_ACCESS_TOKEN: function (state,newValue) {
        state.token = newValue;
        state.isAuthenticated = true;
        jwt.saveToken(newValue)
    },
    LOGOUT_RESET(state) {
        state.currentUser = null;
        state.token = null;
        jwt.destoryAllItem();
    }
}

export const getters = {
    // Whether the user is currently logged in.
    loggedIn(state) {
        return !!state.currentUser
    },
    currentUser(state) {
        return state.currentUser;
    },
    getAccessToken: function (state) {
        return state.token
    },
    getCompanyType: function (state) {
        if(state.currentUser && state.currentUser.company && state.currentUser.company.type) return state.currentUser.company.type;
        return null;
    }
}

export const actions = {
    // This is automatically run in `src/state/store.js` when the app
    // starts, along with any other actions named `init` in other modules.
    // eslint-disable-next-line no-unused-vars
    init({state, dispatch}) {
        dispatch('validate')
    },

    // Logs in the current user.
    logIn({commit, dispatch, getters}, obj) {
        //if (getters.loggedIn) return dispatch('validate')

        tool_app.log("login account info : ", obj);

        commit("SET_CURRENT_USER", obj.user);
        commit("SET_ACCESS_TOKEN", obj.token);

        return true;
    },

    // Logs out the current user.
    logOut({commit}) {
        // eslint-disable-next-line no-unused-vars
        commit('LOGOUT_RESET')
    },


    // Validates the current user's token and refreshes it
    // with new data from the API.
    // eslint-disable-next-line no-unused-vars
    validate({commit, state}) {
        if (!state.currentUser) return Promise.resolve(null)
        const user = getFirebaseBackend().getAuthenticatedUser();
        commit('SET_CURRENT_USER', user)
        return user;
    }
}

// ===
// Private helpers
// ===
