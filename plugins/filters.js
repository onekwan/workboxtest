import Vue from 'vue'

Vue.filter('comma', val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ','))


Vue.filter('local_time',function(val){
    let res = "";

    res = moment(tool_app.format_utcString(val)).format("YYYY-MM-DD HH:mm:ss");
    if(res.toLowerCase() === "invalid date"){
        return "";
    }
    return res;
})

Vue.filter('local_day',function(val){
    let res = "";

    res = moment(tool_app.format_utcString(val)).format("YYYY-MM-DD");
    if(res.toLowerCase() === "invalid date"){
        return "";
    }
    return res;
})

Vue.filter('local_day_dash',function(val){
    let res = "";

    res = moment(tool_app.format_utcString(val)).format("YYYY-MM-DD");
    if(res.toLowerCase() === "invalid date"){
        return "";
    }
    return res;
})

Vue.filter('local_yearMonth',function(val){
    let res = "";

    res = moment(tool_app.format_utcString(val)).format("YYYY-MM");
    if(res.toLowerCase() === "invalid date"){
        return "";
    }
    return res;
})

// **현재 시간** 으로부터 지정한 일 이내인지 확인하는 함수
// ex) 과거 날짜가 7월 10일 지정한 날짜가 10일 오늘이 7월 18일이라면 true
Vue.filter('isInnerSpecifiedDay', (pastDate, specifiedDay) => {
  const diff = moment().diff(pastDate, "days");
  return diff <= Number(specifiedDay);
});

// 지정한 날짜가 시작과 끝 사이에 포함되는지 확인하는 함수
// 커스텀 레인지 때문에 작성
Vue.filter('isIncludeSpecifiedDay', (startDate, endDate, specifiedDate) => {

  if(!specifiedDate) return true;

  let parseDate = moment(tool_app.format_utcString(specifiedDate)).format("YYYY-MM-DD HH:mm:ss");

  return moment(parseDate).isSameOrAfter(moment(startDate).startOf('days').format("YYYY-MM-DD HH:mm:ss"))
    && moment(parseDate).isSameOrBefore(moment(endDate).endOf('days').format("YYYY-MM-DD HH:mm:ss"));

});

Vue.filter('flag_checkbox_multi', (val, field, checkbox_arr) => {
    let flag = false;

    for(let i = 0;i<checkbox_arr.length;i++){
        let item = checkbox_arr[i];
        if(val[field] !== undefined){
            flag = val[field].toLowerCase().indexOf(item.toLowerCase()) > -1;
        }
        if(flag == true){
            break;
        }
    }
    return flag;
});

Vue.filter('flag_checkbox_for_payment', (val, field, checkbox_arr, cancel) => {
    let flag = false;

    for(let i = 0;i<checkbox_arr.length;i++){
        let item = checkbox_arr[i];
        let target = val[field] ? val[field] : '';

        flag = target.toLowerCase().indexOf(item.toLowerCase()) > -1;
        if(flag == true){
            break;
        }
    }

    if(cancel){
        if(flag && val.payment_cancel_local){
            flag = true;
        }else{
            flag = false;
        }
    }

    return flag;
});


Vue.filter('flag_select', (val, field, select_value) => {
    let flag = false;

    if(!select_value){
        return true;
    }else{
        if(val[field] === select_value){
            flag = true;
        }
    }

    return flag;
})

Vue.filter('flag_duration_in_out', (val, start_date, end_date, in_date, out_date, type) => {
    let flag = true;

    let st_d = start_date ? start_date.getTime() : 0;
    let in_d = in_date ? moment(in_date) : "";
    let out_d = out_date ? moment(out_date) : "";
    let end_d = end_date ? end_date.getTime() : 9999999999999;//임의의 큰숫자

    if(type === "indate"){
        if(in_d >= st_d && in_d <= end_d){
            flag = true;
        }else{
            flag = false;
        }
    }else if(type === "outdate"){
        if(out_d >= st_d && out_d <= end_d){
            flag = true;
        }else{
            flag = false;
        }
    }else{
        if((in_d >= st_d && in_d <= end_d) || (out_d >= st_d && out_d <= end_d)){
            flag = true;
        }else{
            flag = false;
        }
    }

    return flag;
})

Vue.filter('flag_text',(val, text, input)=>{
    if(text === undefined) return false;
    let flag = text.indexOf(input) > -1;
    return flag;
})

Vue.filter('flag_text_fields',(el, input, fields)=>{
    let flag = false;
    for(let i =0;i<fields.length;i++){
        let key = fields[i].key ? fields[i].key : fields[i];
        let checkText = el[key] ? ""+el[key] : "";
        if(checkText.toLowerCase().indexOf((input+"").toLowerCase()) > -1){
            flag =true;
            break;
        }
    }
    return flag;
})


Vue.filter('three_comma',(val)=>{
    if(val===null){
        return '-';
    }
    return isNaN(val) ? '' : String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
})


Vue.filter('isActiveNisExist',(arr)=>{
    let filtered = arr.filter(function(val){
        return val.IsActive===true && val.IsExist===true;
    })
    return filtered;
})

Vue.filter('isActive',(arr)=>{
    let filtered = arr.filter(function(val){
        return val.IsActive===true;
    })
    return filtered;
})

Vue.filter('IsExist',(arr)=>{
    let filtered = arr.filter(function(val){
        return val.IsExist===true;
    })
    return filtered;
})

Vue.filter('emptyCheck',(txt)=>{
    if(txt===null) return '-';
    return txt ? txt : '-';
})

Vue.filter('toTextClientLink',(value)=>{
    return value ? `<a href="/#/parkinglot_setting/clients/${value.id}">${value.name}</a>` : '-';
})

Vue.filter('toTextMainZone',(value)=>{
    return value ? `아이디 : ${value.id}, 이름 : ${value.name}` : '-'
})


Vue.filter('toTextIdName',(value)=>{
    return value ? `${value.name ? value.name : '-'}(${value.id ? value.id : '-'})` : '-'
})

Vue.filter('toGetSiteIdName',(value)=>{
    if(value.siteName===null && value.siteId===null){
        return '-';
    }
    return value ? `${value.siteName ? value.siteName : '-'}(${value.siteId ? value.siteId : '-'})` : '-'
})

Vue.filter('toGetName',(value)=>{
    return value ? `${value.name ? value.name : '-'}` : '-';
})

Vue.filter('toGetPropExID',(value)=>{
    let txt = '';
    for(let prop in value){
        if(prop==='id') continue;
        txt += `${value[prop]}, `
    }
    txt = txt.slice(0, -2);
    return txt;
})

Vue.filter('DateFormatDash',(value)=>{
    if(value){
        return value.slice(0,4) + '-' + value.slice(4,6) + '-' + value.slice(6,8);
    }else{
        return '-';
    }
})

Vue.filter('TimeFormatColon',(value)=>{
    if(value){
        return value.slice(0,2) + ':' + value.slice(2,4) + ':' + value.slice(4,6);
    }else{
        return '-';
    }
})


Vue.filter('toOrderInfo',(value)=>{
    // response [ { "id": "albtrs-20240416-101613-ew5a6ur6e", "type": "PASS", "qty": 1, "unitPrice": 1000, "price": 1000 } ]

    if(Array.isArray(value) && value.length > 0){
        let txt = '';
        value.forEach(function (tar){
            txt += `종류 : ${tar.type ? $const.productType[tar.type] : '-'}(${tar.id}), 수량 : ${tar.qty ? tool_app.three_num_comma(tar.qty) : '-'}개, 구매 가격 : ${tar.price ? tool_app.three_num_comma(tar.price) : '-'} 원`;
        })
        return txt;
    }else{
        return value;
    }


})

Vue.filter('ArrayToTextItemsName',(value)=>{
    let txt = '';
    if(value){
        if(Array.isArray(value)){
            if(value.length ===0 ) return '-';
            value.forEach((item, index) => {
                txt += `${item.name ? item.name : '-'} (${item.id ? item.id : '-'})`;
                if(index !== value.length - 1){
                    txt += ', ';
                }
            })
            return txt
        }else{
            return '배열이 아닙니다.'
        }
    }else{
        return '-'
    }
})


Vue.filter('toTextBoolean',(value)=>{
    return value ? '○' : 'X';
})

Vue.filter('toTextItemsName',(value)=>{
    let txt = '';
    if(value){
        if(Array.isArray(value)){
            value.forEach((item, index) => {
                txt += item.name;
                if(index !== value.length - 1){
                    txt += ', ';
                }
            })
            return txt;
        }else{
            return '배열이 아닙니다.'
        }

    }else{
        return '-'
    }
})


Vue.filter('toTextTimeTable',(value)=>{
    let txt = '';
    if(value){
        if(Array.isArray(value)){
            value.forEach((item, index) => {
                txt += `${item.dayOfWeek ? item.dayOfWeek : item.startDate} : ${item.start} ~ ${item.end}`;
                if(index !== value.length - 1){
                    txt += ', ';
                }
            })
        }
        return txt
    }else{
        return '-'
    }
})

Vue.filter('ArrayToText',(value)=>{
    let txt = '';
    if(value){
        if(Array.isArray(value)){
            txt = value.join(',')
        }
        return txt
    }else{
        return '-'
    }
})

Vue.filter('DetailSimpleDate',(value)=>{
    if(value){
        if(moment(value).isValid()){
            return moment(value).format('YYYY-MM-DD');
        }else {
            if (value === '' || value === null || value === undefined) {
                return '-';
            } else{
                return value;
            }
        }
    }
})

Vue.filter('prettyJSON',(value)=>{
    let str = '';
    if(typeof value === "string"){
        str = value;
    }else{
        str = JSON.stringify(value);
    }

    return tool_app.prettyJson(str);
})
