import {getFirebaseBackend} from '../helpers/firebase/authUtils'
import axios from "axios";


export const state = () => ({
    sites : [],
    clients : [],
    zones : [],
    zone_groups : [],
    machines : [],
    machine_groups : [],
    pass_groups : [],
    passes : [],
    pass_forms : [],
    tenants : [],
    tenant_groups : [],
    no_resident : [],
    user_operator : [],
    user_maintainers : [],
    discount_forms : [],
});


export const mutations = {
    SET_OPTIONS(state, newValue) {
        let type = newValue.type.replaceAll('-', '_');
        state[type] = newValue.data;
    }
}

export const getters = {

}

export const actions = {}
