import {
    menuItems
} from "../components/menu";

export default function ({ app, store, route, redirect}) {
    let token = store.getters['auth/getAccessToken'];



    if(!token){
        let loginPath = '/account/login';
        try{
            if(window.localStorage.getItem('loginType') === 'admin'){
                loginPath = '/account/login';
            }else if(window.localStorage.getItem('loginType') === 'nott'){
                loginPath = '/unt/login';
            }else if(window.localStorage.getItem('loginType') === 'tenant'){
                loginPath = '/ut/login';
            }else if(route.path.indexOf('/ut/') > -1){
                loginPath = '/ut/login';
            }
        }catch (e) {
            tool_app.log(e);
        }
        redirect(loginPath+(route.path ? '?redirectFrom='+route.path:''));
    }

    redirect();
}
