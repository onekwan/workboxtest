import axios from "axios";
import qs from "qs";
export default ({app, store, router}, inject) => {
    const API_DOMAIN = process.env.ENV_NAME ==='dev' ? 'http://dev.rsss.co.kr:1865' : 'http://localhost:1865';

    function catchNetworkError(e,reject){
        tool_app.log(e)
        let msg = tool_app.getErrorMsg(e)
        if(e.response.status === 401){
            tool_app.dialog_alert(
                '토큰이 만료되었습니다.\n다시 로그인 해주세요.', function () {
                    store.commit("auth/LOGOUT_RESET");
                    window.location.replace('/');
                }
            );
        }else if(e.response.status === 404){
            tool_app.dialog_alert('404 네트워크 통신 오류입니다.<br/>'+msg);
        }else if(e.response.status === 500){
            tool_app.dialog_alert('500 네트워크 통신 오류입니다.<br/>'+msg);
        }else if (e.code === 'ECONNABORTED' && e.message.includes('timeout')) {
            reject(new Error('서버의 응답 대기 시간이 초과되었습니다.'));
            tool_app.dialog_alert('서버의 응답 대기 시간이 초과되었습니다.'+msg);
        }else{
            tool_app.dialog_alert('네트워크 오류입니다.<br/>'+msg);
        }

        reject(e);

    }

    let mainapi = {
        // 옵션내용
        // passForbbidenError 권한 없을 경우 경고창 대신 호출페이지로 권한 넘겨주기
        API_DOMAIN : API_DOMAIN,
        invokeAPI : function (path, payload,type) {
            return new Promise((resolve, reject) => {

                let url = API_DOMAIN;

                url = url + path;

                const config = {
                    method: type ?? "POST",
                    url: url,
                    timeout: 10000,
                    headers: {
                        "Authorization": store.getters['auth/getAccessToken'],
                        "Content-Type": `application/json`
                    },
                    data: payload
                };

                tool_app.log("request path : " + url);
                tool_app.log('request data : ', payload);
                try {
                    tool_app.log("payload : ", JSON.stringify(payload));
                } catch (e) {
                    tool_app.log(e);
                }
                axios(config).then(res => {
                    tool_app.log('response data :',res)
                    resolve(res)
                }).catch(e => {
                    catchNetworkError(e, reject)
                });
            });
        },
        invokeAPI_PG_TEST : function (path, payload,type) {
            return new Promise((resolve, reject) => {

                let url = API_DOMAIN;

                url = url + path;

                const config = {
                    method: "POST",
                    url: url,
                    timeout: 10000,
                    headers: {
                        "Authorization": store.getters['auth/getAccessToken'],
                        "Content-Type": `application/json`
                    },
                    data: payload
                };

                tool_app.log("request path : " + url);
                tool_app.log('request data : ', payload);
                try {
                    tool_app.log("payload : ", JSON.stringify(payload));
                } catch (e) {
                    tool_app.log(e);
                }
                axios(config).then(res => {
                    tool_app.log('response data :',res)
                    resolve(res)
                }).catch(e => {
                    catchNetworkError(e, reject)
                });
            });
        },
        invokeAPI_GET : function (path,payload) {
            return new Promise((resolve, reject) => {

                let url = API_DOMAIN;

                url = url + path;

                if(payload){
                    url = url + "?" + qs.stringify(payload);
                }

                const config = {
                    method: "GET",
                    url: url,
                    timeout: 10000,
                    headers: {
                        "Authorization": store.getters['auth/getAccessToken'],
                        "Content-Type": `application/json`
                    }
                };

                tool_app.log("request path : " + url);
                tool_app.log('request data : ', payload);
                try {
                    // tool_app.log("payload : ", JSON.stringify(api));
                } catch (e) {
                    tool_app.log(e);
                }
                axios(config).then(res => {
                    tool_app.log('response data :',res)
                    if (res.data.code === 401) {
                        tool_app.dialog_alert('토큰이 만료되었습니다.\n다시 로그인 해주세요.');
                        authStore.logout();
                        window.location.replace('/');
                    } else {
                        resolve(res)
                        //this.getRefreshToken();
                    }

                    resolve(res)
                }).catch(e => {
                    catchNetworkError(e, reject)

                });
            });
        },
        invokeAPI_GET_noalert : function (path,payload) {
            return new Promise((resolve, reject) => {

                let url = API_DOMAIN;

                url = url + path;

                if(payload){
                    url = url + "?" + qs.stringify(payload);
                }

                const config = {
                    method: "GET",
                    url: url,
                    timeout: 10000,
                    headers: {
                        "Authorization": store.getters['auth/getAccessToken'],
                        "Content-Type": `application/json`
                    }
                };

                tool_app.log("request path : " + url);
                tool_app.log('request data : ', payload);
                try {
                    // tool_app.log("payload : ", JSON.stringify(api));
                } catch (e) {
                    tool_app.log(e);
                }
                axios(config).then(res => {
                    tool_app.log('response data :',res)
                    if (res.data.code === 401) {

                        authStore.logout();

                    } else {
                        resolve(res)
                        //this.getRefreshToken();
                    }

                    resolve(res)
                }).catch(e => {


                });
            });
        },
        invokeAPI_login: function (api) {
            return new Promise((resolve, reject) => {
                let url = API_DOMAIN + '/api/v1/login';

                const config = {
                    method: 'post',
                    url: url,
                    headers: {
                        "Content-Type": `application/json`,
                    },
                    timeout: 10000,
                    data: api
                };

                tool_app.log("request path : " + url);
                tool_app.log('request data : ', api);
                try {
                    tool_app.log("payload : ", JSON.stringify(api));
                } catch (e) {
                    tool_app.log(e);
                }
                axios(config).then(res => {
                    tool_app.log(res)
                    resolve(res)
                }).catch(e => {
                    if (e.code === 'ECONNABORTED' && e.message.includes('timeout')) {
                        reject(new Error('서버의 응답 대기 시간이 초과되었습니다.'));
                    }else{
                        reject(e)
                    }
                });
            });
        }
    }


    window.mainapi = mainapi;
}




