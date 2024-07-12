


export const state = () => ({
    fee: {},
});


export const mutations = {
    SET_FEE(state, newValue) {

        let data = newValue.data.data;
        tool_app.log('mutations SET_FEE')

        let latestBill = {};
        if(data.latestBill){
            latestBill = JSON.parse(data.latestBill);
            for(let prop in this.latestBill){
                latestBill[prop] = parseInt(latestBill[prop]);
                if(isNaN(latestBill[prop])){
                    latestBill[prop] = 0;
                }
            }
        }
        state.fee = latestBill;
    }
}

export const getters = {

}

let feeCheckInterval = null;
async function feeCheck(visitId,feeCheckCnt) {
    tool_app.log("------------feeCheck "+feeCheckCnt + " ------------")
    return new Promise(async function(resolve, reject) {
        try {
            let res = await mainapi.invokeAPI_GET_noalert(`/api/v1/visits/${visitId}/calc-bill`, {})

            if (res.data.code !== $const.ApiSuccessCode.GET) {
               // tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg);
                reject();
            }
            resolve(res);

            //"latestBill": "{\"standardFee\":11500.0,\"finalFee\":10500.0,\"discountedFee\":10500.0,\"passedFee\":11500.0,\"adjustFee\":0}"
        } catch (e) {
            reject();
          //  tool_app.dialog_alert(e);
        }
    })
}

export const actions = {
    polingFeeCheck({commit}, visitId) {
        let feeCheckCnt = 0;
        if(feeCheckInterval){
            clearInterval(feeCheckInterval)
        }
        feeCheckInterval = setInterval(async function(){
            feeCheckCnt++;
            if(feeCheckCnt >= 10){
                clearInterval(feeCheckInterval);
                feeCheckCnt = 0;
            }
            try{
                let res = await feeCheck(visitId,feeCheckCnt);
                commit("SET_FEE", res);
            }catch (e) {
                tool_app.log(e)
            }

        },1000)
    },
    clearFeeCheck() {
        if(feeCheckInterval){
            clearInterval(feeCheckInterval)
        }
    }
}
