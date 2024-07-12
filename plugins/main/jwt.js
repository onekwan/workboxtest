import cryptojs from "crypto-js";

const ID_TOKEN_KEY = "token";
const ID_USER_KEY = "user_info";
let _kc_storage = window.localStorage;


function lg(){
    let args = Array.prototype.slice.call(arguments);
    //args.unshift("url : " + window.location.hash)
    console.log.apply(console, args);
}

const encodingSession = function (userInfo) {
    let wordArray = cryptojs.enc.Utf8.parse(userInfo);
    return cryptojs.enc.Base64.stringify(wordArray);
}

const decodingSession = function (encUserInfo) {
  return cryptojs.enc.Base64.parse(encUserInfo).toString(cryptojs.enc.Utf8);
}


export const getToken = () => {
    let token = _kc_storage.getItem(ID_TOKEN_KEY)
   // tool_app.getCookie(ID_TOKEN_KEY);
    if(token){
        return decodingSession(token);
    }else{
        return null;
    }
}

export const saveToken = token => {

    token = encodingSession(token);
    _kc_storage.setItem(ID_TOKEN_KEY, token)
    //tool_app.setCookie(ID_TOKEN_KEY, token, "3");
}

export const destroyToken = () => {
    _kc_storage.removeItem(ID_TOKEN_KEY)
}

export const saveUser = user => {
    try{
        user = encodingSession(JSON.stringify(user));
        _kc_storage.setItem(ID_USER_KEY, user)
    }catch (e) {
        lg(e);
    }

    //tool_app.setCookie(ID_TOKEN_KEY, token, "3");
}

export const getUser = () => {
    let user = _kc_storage.getItem(ID_USER_KEY)
    // tool_app.getCookie(ID_TOKEN_KEY);
    if(user){
        try{
            return JSON.parse(decodingSession(user));
        }catch (e) {
            lg(e);
            return null;
        }
    }else{
        return null;
    }
}

window._$getAccountInfo = function(){
    return getUser();
}


export const destroyUser = () => {
    _kc_storage.removeItem(ID_USER_KEY)
}


export const destoryAllItem = ()=>{
    _kc_storage.removeItem(ID_TOKEN_KEY)
    _kc_storage.removeItem(ID_USER_KEY)
}

export default {
    destoryAllItem,
    getToken,
    saveToken,
    destroyToken,
    saveUser,
    getUser,
    destroyUser,
}
