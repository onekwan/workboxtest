import Vue from 'vue';

export default ({app,store}, inject) => {
    Vue.prototype.pagingQueryMaker = (route, newQuery, reset) => {
        // tool_app.log('pagingQueryMaker1')
        // tool_app.log(route.query);
        let res_query;
        for(let prop in newQuery){
            if(prop.indexOf('dateobj') > -1) {
                newQuery[prop] = moment(newQuery[prop]).format();
            }
        }

        if(reset){
            res_query = newQuery;
        }else{
            res_query = Object.assign({},route.query, newQuery);
        }
        // tool_app.log('pagingQueryMaker2')
        // tool_app.log(res_query);
        for(let prop in res_query){
            if(!res_query[prop]){
                delete res_query[prop]
            }
        }
        // tool_app.log('pagingQueryMaker3')
        // tool_app.log(res_query);

        try{

            let same = true;
            let newQueryCnt = 0;
            let routeQueryCnt = 0;
            for(let prop in newQuery){
                if(newQuery[prop] !== null && newQuery[prop] !== undefined && newQuery[prop] !== ''){
                    newQueryCnt++;
                }

            }
            for(let prop in route.query){
                routeQueryCnt++;
            }


            if(newQueryCnt===routeQueryCnt){

                for(let prop in newQuery){
                    if((newQuery[prop]+'') != (route.query[prop]+'')) {
                        same = false;
                    }
                }
            }else{
                same = false;
            }
            if(same){

            }else{
                app.router.replace({path : route.path, query: res_query })
            }
        }catch(e){

        }

    }

    Vue.prototype.setFilter = (vue) => {
        for(let prop in vue.$route.query){
            // tool_app.log('setFilter')
            // tool_app.log(vue.$route.query[prop]);
            if(isNaN(vue.$route.query[prop])){
                if(prop.indexOf('dateobj') > -1){
                    vue.tableCondition[prop] = new Date(vue.$route.query[prop]);
                }else{
                    vue.tableCondition[prop] = vue.$route.query[prop];
                }
            }else{
                if(vue.$route.query[prop].length > 1 && vue.$route.query[prop][0] ==='0'){
                    vue.tableCondition[prop] = vue.$route.query[prop];
                }else{
                    vue.tableCondition[prop] = parseInt(vue.$route.query[prop]);
                }

            }
        }
        vue.origin_tableCondition = tool_app.deepCopy(vue.tableCondition);
    }
    Vue.prototype.timeMinToHourFormat = function(time){
        return tool_app.timeMinToHourFormat(time);
    }
    Vue.prototype.isArray = function(target){
        return Array.isArray(target);
    }

    Vue.prototype.formatDate = function(target){
        return moment(target).format('YYYY-MM-DD');
    }

    Vue.prototype.getPathImage = function(target){
        let divider = '/api/v1';
        let temp = target.split(divider);
        return divider + temp[1];
    }

    Vue.prototype.linkOpen = function(path, target){
        try{
            window.open(path+target.id, "_blank");
        }catch (e) {

        }finally {
            return false;
        }
    }




    Vue.prototype.setSelectBoxOptions = function(needOptionsArr){
       if(!Array.isArray(needOptionsArr)){
           return false;
       }


       needOptionsArr.forEach(function(target){
           let url = '/api/v1/' + target.path;
           let payload = {
               page: 0,
               size: 2000,
               sort: 'created,DESC'
           }
           for(let prop in target.payload){
               payload[prop] = target.payload[prop];
           }
           mainapi.invokeAPI_GET(url, payload).then((res) => {
               if (res.data.code !== $const.ApiSuccessCode.GET) {
                   tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
               }
               let data = res.data.data;
               if(target.path==='users' && payload.companyType==="NONE"){
                   store.commit('selectBoxOptions/SET_OPTIONS', {type: 'no_resident', data: data.items});
               }else if(target.path==='users' && payload.companyType==="OPERATOR"){
                   store.commit('selectBoxOptions/SET_OPTIONS', {type: 'user_operator', data: data.items});
               }else if(target.path==='users' && payload.companyType==="MAINTAINER"){
                   store.commit('selectBoxOptions/SET_OPTIONS', {type: 'user_maintainers', data: data.items});
               }else{
                   store.commit('selectBoxOptions/SET_OPTIONS', {type: target.path, data: data.items});
               }

           }).catch(function(){

           });
       })
    }

    Vue.prototype.isUserAdmin = function(){
        let companyType = store.getters["auth/getCompanyType"];
        if (companyType === "DEVELOPER" || companyType === "OPERATOR" || companyType === "MAINTAINER") {
            return true;
        }else{
            return false;
        }
    }



}
