const Excel = require('exceljs');

let tool_app = {
    appname: "kps-managers-fe",
    prod_appversion : '9.0.1',
    prod_appversioncode : 1,
    prod_autoUpdateVersion : '9.0.1',
    dev_appversion : '9.0.1',
    dev_appversioncode : 1,
    dev_autoUpdateVersion : '9.0.1',
    resJsonAutoVersion : '***',
    DebugParameter : undefined,
    mUrl: "",
    mIsMobile: false,
    sCurrentState: null,
    test: function () {
        this.log("********************************");
        this.log(arguments);
    },
    isDebug: function () {
        // if(document.domain.indexOf('localhost') < 0 && document.domain.indexOf('50.0.0.') < 0) {
        if (this.DebugParameter === undefined) {
            var lDebug = this.gup('debug');
            if (lDebug) {
                if (lDebug.toLowerCase() === 'true') {
                    this.DebugParameter = true;
                }
            }
        }
        if (this.DebugParameter === true) {
            return true;
        }
        if (document.domain.indexOf('localhost') >= 0) {
            return true;
        }
        if (document.domain.indexOf('127.0.0.1') >= 0) {
            return true;
        }
        // if (document.domain.indexOf('10.') >= 0) {
        //     return true;
        // }
        return false;
    },
    log: function () {
        let args = Array.prototype.slice.call(arguments);
        //args.unshift("url : " + window.location.hash)
        //if (this.isDebug()) {
        if (true) {
            window.logPrintPath ? args.unshift('page : ' + window.logPrintPath + ']') : '';
            console.log.apply(console, args);
        }
        // lazyVal.apply(lazyVal, args)
        /*if (typeof DD_LOGS !== 'undefined') { // Any scope
            // counter += 1;
            // return 'result';
            DD_LOGS.onReady(function () {
                DD_LOGS.logger.info((args));
                // DD_LOGS.logger.info.apply(DD_LOGS.logger, args);
            });
        }
        let txt = "";
        for(let i in args){
            txt += args[i];
        }*/
    },
    ex: function (msg) {
        try {
            // Sentry.captureException(msg);

            // if (uncaught === undefined || uncaught === null) {
            //     uncaught = false;
            // }
            // this.log('error occurred: \n', e);
            //
            // var data = {
            //     ErrorMessage: e.message,
            //     ErrorTimestamp: new Date().getTime(),
            //     ErrorStackTrace: e.stack,
            //     AppName: this.appname,
            //     AppVersionCode: this.appversioncode,
            //     AppVersionName: this.appversion,
            //     Platform: "web",
            //     IsCritical: uncaught
            // };
            // if (msg !== undefined && msg !== null) {
            //     data.ErrorMessage += msg;
            // }
            // var settings = {
            //     "url": "https://exapi.myvaletbiz.com/ms-20201223/error",
            //     "method": "POST",
            //     "headers": {
            //         "x-api-key": "RZzabxjCVd9L1wRpGDctm3Hs5DwiBdxQaek6FxuL",
            //         "Content-Type": "application/json",
            //     },
            //     data: JSON.stringify(data),
            // };
            //
            // $.ajax(settings).done(function (response) {
            //     console.log(response);
            // });

        } catch (e) {
            console.log(e);
        }
    },
    three_num_comma : function(val){
        return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    isNumberBlank: function (val) {
        if (val === undefined || val === null) {
            return true;
        }
        if (isNaN(val)) {
            return true;
        }
        if ($.isNumeric(val) === false) {
            return true;
        }
        if (val <= 0) {
            return true;
        }
        return false;
    },
    isStringBlank: function (val) {
        if (val === undefined || val === null) {
            return true;
        }
        if (val.trim().length <= 0) {
            return true;
        }
        return false;
    },
    isListBlank: function (val) {
        if (val === undefined || val === null) {
            return true;
        }
        if (val.length <= 0) {
            return true;
        }
        return false;
    },
    isAndroid: function () {
        // var lPlatform = tool_app.gup('platform');
        // tool_app.log('platform:'+lPlatform);
        // if(lPlatform && lPlatform.toLowerCase() == 'android') {
        try {
            var lPlatform = this.gup('platform');
            // tool_app.log('isAndroid 1 platform:'+lPlatform);
            if (lPlatform) {
                // tool_app.log('isAndroid 2 '+lPlatform.toLowerCase()+' '+'android');
                if (lPlatform.toLowerCase() === 'android') {
                    // tool_app.log('isAndroid 2 return true');
                    return true;
                }
            }
        } catch (e) {
            // tool_app.log(ex);
            this.ex(e);
        }
        // tool_app.log('isAndroid 9 return false');
        return false;
    },
    isiOS: function () {
        // var lPlatform = tool_app.gup('platform');
        // if(lPlatform && lPlatform.toLowerCase() == 'android') {
        try {
            var lPlatform = this.gup('platform');
            // tool_app.log('platform:'+lPlatform);
            if (lPlatform) {
                if (lPlatform.toLowerCase() === 'ios') {
                    return true;
                }
            }
        } catch (e) {
            // tool_app.log(ex);
            this.ex(e);
        }
        return false;
    },
    isMobile: function () {
        // var ret = false;
        this.log('isMobile 1');
        if (this.isAndroid()) {
            this.mIsMobile = true;
            return true;
        }
        this.log('isMobile 2');
        if (this.isiOS()) {
            this.mIsMobile = true;
            return true;
        }

        this.log('isMobile 3');
        var lIsMobile = this.gup('ismobile');
        this.log('lIsMobile:' + lIsMobile);
        if (lIsMobile) {
            if (lIsMobile === 'true') {
                this.mIsMobile = true;
                return true;
            }
        }
        this.log('isMobile false');
        this.mIsMobile = false;
        return false;
    },
    isShowBottomTabOnMobile: function () {
        var showbottomtab = this.gup('showbottomtab');
        if (showbottomtab) {
            if (showbottomtab === 'false') {
                return false;
            }
        }
        return true;
    },
    getCurrentParkingLotUUID: function () {
        try {
            if (this.isMobile()) {
                return Number(this.gup('parkinglotuuid'));
            }
        } catch (e) {
            this.ex(e);
        }
        return 0;
    },
    init: function (event) {
        this.bridge = event.bridge;
        this.log('isInitialized 1 ' + this.bridge.isInitialized());
        if (this.bridge.isInitialized() == false) {
            this.bridge.init(function (message, responseCallback) {
                this.log('fromApp 1 message:' + message + ' responseCallback:' + responseCallback);
                var api = JSON.parse(message);
                this.log('fromApp 2 message:' + message + ' responseCallback:' + responseCallback);
                this.wvjbOnAPI(api, responseCallback);
                this.log('fromApp 3 message:' + message + ' responseCallback:' + responseCallback);
            });
            this.bridge.registerHandler(this.wvjbHandlerName, function (message, responseCallback) {
                // log('ObjC called testJavascriptHandler with', data)
                // var responseData = { 'Javascript Says':'Right back atcha!' }
                // log('JS responding with', responseData)
                // responseCallback(responseData)
                this.log('registerHandler fromApp 1 message:' + message + ' responseCallback:' + responseCallback);
                var api = JSON.parse(message);
                this.log('registerHandler fromApp 2 message:' + message + ' responseCallback:' + responseCallback);
                this.wvjbOnAPI(api, responseCallback);
                this.log('registerHandler fromApp 3 message:' + message + ' responseCallback:' + responseCallback);
            });
            this.log('isInitialized 2 ' + this.bridge.isInitialized());
        }

        // mc.sendInitializingState(35, 50, '맵틀을 로딩하고 있습니다.');

        // _this.onInitialized();
    },
    minToDesc: function (min) {
        let desc = ((min / 60) >= 1 ? Math.floor((min / 60)) + '시간' : '');
        if (Math.floor(min % 60) > 0) {
            if (this.isStringBlank(desc) === false) {
                desc += ' ';
            }
            desc += Math.floor(min % 60) + '분';
        }
        if (this.isStringBlank(desc.trim())) {
            desc = '0분';
        }
        return desc;
    },
    gup: function (name, url) {
        if (!url) url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    },
    getType: function () {
        var type = 'mobile';
        try {
            var url = location.href;
            // tool_app.log('getType 1: url:'+url);
            // var regex = new RegExp("\\.*/(*).html\\");
            var regex = new RegExp("([a-z]+)\.html");
            // var regex = /([a-z]+)\.html/;
            var results = regex.exec(url);
            // tool_app.log('getType 2: results[1]:'+results[1]);
            if (results[1] === 'index') {
                type = 'mobile'
            } else {
                type = results[1];
            }
        } catch (e) {
            type = 'mobile'
        }
        // console.log('getType: '+type);
        return type;
    },
    getQueryParams: function (qs) {
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;


        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    },
    getUrlParameter: function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    },
    swal_dialog: undefined,
    dialog_info: function (message, handler) {
        if (this.isStringBlank(message)) {
            return;
        }
        this.dialog(message, this.dialogtype.info, handler);
    },
    dialog_warning: function (message, handler) {
        if (this.isStringBlank(message)) {
            return;
        }
        this.dialog(message, this.dialogtype.warning, handler);
    },
    dialog_alert: function (message, handler) {
        if (this.isStringBlank(message)) {
            return;
        }
        this.dialog(message, this.dialogtype.error, handler);
    },
    dialog_success: function (message, handler) {
        if (this.isStringBlank(message)) {
            return;
        }
        this.dialog(message, this.dialogtype.success, handler);
    },
    dialogtype: {
        primary: 'primary',
        info: 'info',
        success: 'success',
        warning: 'warning',
        danger: 'danger',
        error: 'error',
    },
    dialog: function (message, type, handler) {
        if (this.isStringBlank(message)) {
            return;
        }
        this.swal_dialog = true;
        let toolApp = this;
        window.setTimeout(function () {
            swal.fire(
                {
                    title: '',
                    icon: type,
                    html: message,
                    position: "center",
                    showCancelButton: false,
                    confirmButtonText: "확인",
                    allowOutsideClick: false,
                    heightAuto: false,
                    timerProgressBar: true,
                    showClass: {
                        popup: 'swal-custom',
                        backdrop: 'swal-custom-back',
                        icon: 'swal-custom-icon'
                    },
                    willClose: () => {
                        // if (handler) {
                        //     handler();
                        // }
                    }
                    // ,showClass: {
                    //     popup: 'animate__animated animate__fadeIn'
                    // },
                    // hideClass: {
                    //     popup: 'animate__animated animate__fadeOut'
                    // }

                }
            ).then(function (result) {
                /* Read more about isConfirmed, isDenied below */
                // tool_app.log(result)
                // if (result.value) {
                //
                // }

                toolApp.swal_dialog = false;
                setTimeout(function (res) {
                    if (handler) {
                        handler(result.value);
                    }
                }, 100);
            });
        }, 10);
    },
    confirm: function (message) {
        return swal.fire(
            {
                title: '',
                icon: 'warning',
                html: message,
                position: "top",
                confirmButtonText: "확인",
                allowOutsideClick: false,
                heightAuto: false,
                showClass: {
                    popup: 'swal-custom',
                    backdrop: 'swal-custom-back',
                    icon: 'swal-custom-icon'
                },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#343a40',
                cancelButtonText: '취소'
            }
        )


    },
    dialog_apiresopnse: function (api, handler) {
        let toolApp = this;
        this.log('dialog_apiresopnse api:' + api);
        this.log('dialog_apiresopnse handler:' + handler);
        this.log('dialog_apiresopnse api.rMessage:' + api.rMessage + ' api.rStatusCode:' + api.rStatusCode);

        swal.close();
        window.setTimeout(function () {
            toolApp.dialog(api.rMessage, (api.rStatusCode === 200) ? 'success' : 'error', function () {
                toolApp.log('dialog_apiresopnse 9 ');
                handler();
            })
        }, 10);

    },
    dialog_confirm: function (message, handler, cancelhandler) {
        if (this.isStringBlank(message)) {
            message = '정말 진행하시겠습니까?';
        }
        swal(
            {
                title: '',
                type: 'info',
                text: message,
                // html: true,
                showCancelButton: true,
                cancelButtonText: '취소',
                showConfirmButton: true,
                confirmButtonText: '진행',
                allowOutsideClick: false,
            },
            function (isConfirm) {
                if (isConfirm) {
                    handler();
                } else {
                    if (cancelhandler !== undefined && cancelhandler !== null) {
                        cancelhandler();
                    }
                    // swal("Cancelled", "Your imaginary file is safe :)", "error");
                }
            }
        );
    },
    dialog_loading: function (message) {
        // tool_app.log('dialog_loading:'+message);
        if (this.isStringBlank(message)) {
            message = 'processing...';
        }
        swal(
            {
                title: '',
                text:
                    '<i class="fa fa-4x fa-sun-o fa-spin text-danger"></i><br/>' +
                    message + '<br/><br/><br/>' +
                    '이 로딩 화면이 지속되면 관리자에게 문의 부탁드립니다.',
                html: true,
                showConfirmButton: true,
                confirmButtonText: "페이지 새로고침",
                allowOutsideClick: false,
            },
            function (isConfirm) {
                if (isConfirm) {
                    // swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    location.reload(true);
                } else {
                    // swal("Cancelled", "Your imaginary file is safe :)", "error");
                }
            }
        );
    },
    dialog_close: function () {
        swal.close();
    },
    getCarNumber_Pure: function (pCarNumber) {
        // return pCarNumber;
        if (pCarNumber) {
            var ret;
            if (pCarNumber && pCarNumber.startsWith("전국")) {
                ret = pCarNumber.substring(2);
            } else {
                ret = pCarNumber;
            }
            return ret.replace(/_/gi, ' ').replace(/ +/gi, ' ').trim();
        }
        return "";
    },
    getCarNumber_Splitted: function (pCarNumber) {
        var s = pCarNumber;
        var ss = new Array(4);
        for (var i = 0; i < 3; i++) {
            ss[i] = s.substring(0, Math.max(0, s.indexOf('_')));
            s = s.substring(s.indexOf('_') + 1);
        }
        ss[3] = s;
        return ss;
    },
    carnumber_getSplitted: function (pCarNumber) {
        var ls = [];
        if (this.isStringBlank(pCarNumber)) {
            pCarNumber = "___";
        }
        try {
            ls = this.getCarNumber_Splitted(pCarNumber);
            if (ls.length != 4) {
                // throw new IllegalArgumentException("Dialog_Keyboard_CarNumber getSplitted mText_CarNumber:"+ pCarNumber);
            }
        } catch (e) {
            // Tool_Java.uex(e);
            pCarNumber = "___";
            ls = this.getCarNumber_Splitted(pCarNumber);
            this.ex(e);
        }
        for (var i = 0; i < ls.length; i++) {
            ls[i] = ls[i].trim();
        }
        return ls;
    },
    getCarnNmber_Last4Digit: function (pCarNumber) {
        return this.carnumber_getSplitted(pCarNumber)[3];
    },
    getCurrentTime: function () {
        var d = new Date();
        // tool_app.log('d.getTimezoneOffset:'+d.getTimezoneOffset());
        // return d.getTime() + d.getTimezoneOffset();
        return d.getTime();
    },
    calculatePrice: function (pItem, pDateTime_Created, pDateTime_Price_Calculated) {
        // tool_app.log('calculatePrice tool_app.getCurrentTime():'+tool_app.getCurrentTime()+' pDateTime_Created:'+pDateTime_Created);
        this.log('calculatePrice ' + new Date(pDateTime_Price_Calculated) + ', ' + new Date(pDateTime_Created));
        var lElapsedTimeInMinutes = Math.floor((pDateTime_Price_Calculated - pDateTime_Created) / (60 * 1000));
        this.log('calculatePrice lElapsedTimeInMinutes:' + lElapsedTimeInMinutes);
        if (lElapsedTimeInMinutes < 0) {
            lElapsedTimeInMinutes = 0;
        }

        this.log('calculatePrice pItem:' + JSON.stringify(pItem));
        this.log('calculatePrice pItem.Initial_Price:' + pItem.Initial_Price);
        // lPrice: 최종 정산 금액.
        var lPrice = pItem.Initial_Price;
        // 경과 시간에서 기본 금액 시간을 뺌.
        lElapsedTimeInMinutes -= pItem.Initial_ParkingTime_InMinutes;
        // 추가 시간에 의한 요금 과금.
        if (lElapsedTimeInMinutes > 0 && pItem.Additional_ParkingTime_InMinutes > 0) {    // 기본 시간을 초과 했고, 추가 요금 체계가 있는 경우
            lPrice += (Math.floor((lElapsedTimeInMinutes - 1) / pItem.Additional_ParkingTime_InMinutes) + 1) * pItem.Additional_Price;
        } else if (lElapsedTimeInMinutes > 0 && pItem.Additional_ParkingTime_InMinutes <= 0) {    // 기본 시간을 초과 했지만, 추가 요금 체계가 없는 경우
            // 뭔가 경고를 줘야 하지 않나?
        }
        this.log('calculatePrice lPrice:' + lPrice);
        return lPrice;
    },
    getParkingProcessName: function (pState) {
        switch (pState) {
            case 'S10_CarIn_Request':
                return "입차요청";
            case 'S20_CarIn_Assigned':
                return "입차중";
            case 'S30_CarIn_Completed':
                return "입차완료";
            case 'S40_CarOut_Request':
                return "출차요청";
            case 'S50_CarOut_Assigned':
                return "출차중";
            case 'S60_CarOut_Completed':
                return "출차완료";
            case 'S70_CarReturn_Request':
                return "회차요청";
            case 'S80_CarReturn_Assigned':
                return "회차중";
            case 'S90_CarReturn_Completed':
                return "회차완료";
        }
        return "에러";
    },
    phoneFomatter: function (num, type) {
        var formatNum = '';

        if (num.length === 11) {
            if (type == 0) {
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
            } else {
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        } else if (num.length == 8) {
            formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
        } else {
            if (num.indexOf('02') == 0) {
                if (type == 0) {
                    formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
                } else {
                    formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                }
            } else {
                if (type == 0) {
                    formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
                } else {
                    formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                }
            }
        }
        return formatNum;
    },
    isInInterval: function (org, interval) {
        var cur = new Date().getTime();
        if (org < cur - interval || cur + interval < org) {
            return false;
        }
        return true;
    },
    getStringLength: function (str) {
        var retCode = 0;
        var strLength = 0;

        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i)
            var ch = str.substr(i, 1).toUpperCase()

            code = parseInt(code)

            if ((ch < "0" || ch > "9") && (ch < "A" || ch > "Z") && ((code > 255) || (code < 0)))
                strLength = strLength + 2;
            else
                strLength = strLength + 1;
        }
        return strLength;
    },
    numberWithCommas: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    format_hourmin: function (pMin) {
        let time = "";
        if (pMin >= 60) {
            time += Math.floor(pMin / 60) + "시간";
        }
        if (pMin % 60 > 0) {
            if (time.length > 0) {
                time += " " + Math.floor(pMin % 60) + "분";
            } else {
                time += Math.floor(pMin % 60) + "분";
            }
        }
        return time;
    },
    /* page.js 추가 */
    needToAuthenticate: true,
    lg: function () {
        let args = Array.prototype.slice.call(arguments);
        args.unshift(this.getStateName() + ']');
        this.log.apply(this, args);
    },
    log_page: function () {
        let args = Array.prototype.slice.call(arguments);
        args.unshift(this.getStateName() + ']');
        this.log.apply(this, args);
    },
    getUrl: function () {
        return this.mUrl;
        // return _this.mUrl.replace(/\/{.*}/,'');
    },
    getStateName: function () {
        let ret = String(this.mUrl.substr(1));

        // if(arguments.length > 0) {
        //     for (var i = 0; i < arguments.length; i++) {
        //         // alert(arguments[i]);
        //         _this.log('getStateName '+i+'] '+arguments[i]);
        //
        //         ret = ret.replace(/{.*}/, arguments[i]);
        //     }
        // } else {
        ret = ret.replace(/\/{.*}/, '').replace(/\/:.*/, '');
        // }

        return ret;
    },
    getControllerName: function () {
        return 'Controller_' + this.mUrl.replace(/\//, '');
    },
    getViewFileName: function () {
        return this.mUrl.replace(/\/{.*}/, '').substr(1).replace(/\//gi, '_').replace(/_:.*/, '') + '.html';
    },
    getTemplateUrl: function () {
        // return 'pages'+_this.mUrl.replace(/\/{.*}/,'').replace(/\/:.*/,'')+'/'+_this.getViewFileName();
        return 'pages' + this.mUrl.replace(/\/{.*}/, '').replace(/\/:.*/, '') + '/' + cz.getViewFileName();
    },
    isCookieKey_LBFailed: function () {
        return false;
        // var lbfailed = this.$cookies.get(CookieKey_LBFailed);
        // if (lbfailed == undefined || lbfailed == null || lbfailed.startsWith('true') == false) {
        //     return false;
        // }
        // return true;
    },
    setCookie: function (cookie_name, value, days) {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + days); // 설정 일수만큼 현재시간에 만료값으로 지정
        let cookie_value = escape(value) + ((days == null) ? '' : '; expires=' + exdate.toUTCString());
        document.cookie = cookie_name + '=' + cookie_value;
    },
    getCookie: function (cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    format_local_time: function (string) {
        let res = "";
        res = moment(string).format("YYYY/MM/DD HH:mm:ss");
        return res;
    },
    set_search_duration: function (day, n_day) {
        let _day = day ? day : 3;
        let before_date = moment().subtract('days', _day).startOf('day');
        let today = new Date();
        let endDate = null;
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        endDate = today;
        if(n_day){
            let nextDay = moment().add('days', n_day).endOf('day');
            endDate = nextDay;
        }

        return {start_date: before_date.toDate(), end_date: endDate};
    },
    set_duration_monthty01: function () {
        //현재 기준일, 지난달 1일 부터 현재까지의 기간 셋팅
        let before_date = moment().subtract('months', 1).set('date', 1).startOf('day');
        let today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);

        return {start_date: before_date.toDate(), end_date: today};
    },
    set_duration_monthty02: function () {
        //현재 기준일, 지난달 1일 부터 현재까지의 기간 셋팅
        let before_date = moment().subtract('months', 1).add('days', 1).startOf('day');
        let today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);

        return {start_date: before_date.toDate(), end_date: today};
    },
    validation_carFullNumber: function (CarNum) {
        CarNum = CarNum.replaceAll(/\s/g, '');
        // public static boolean carnumber_IsFullNumber(String pCarNumber) {
        //     try {
        //         String[] ls = carnumber_getSplitted(pCarNumber);
        //
        //         if(ls[0].contains("임시")) {
        //             return ls[3].length() >= 6;
        //         }
        //         else if (ls[0].contains("외교")
        //             || ls[0].contains("영사")
        //             || ls[0].contains("준영")
        //             || ls[0].contains("준외")
        //             || ls[0].contains("국기")
        //             || ls[0].contains("협정")
        //             || ls[0].contains("대표")) {
        //             return ls[1].length() >= 3 && ls[3].length() >= 3;
        //         }
        //         else {
        //             return ls[1].length() >= 2 && ls[2].length() >= 1 && ls[3].length() >= 4;
        //         }
        //     } catch (Throwable e) {
        //         Tool_Java.uex(e);
        //     }
        //     return false;
        // }


        //차량 맨앞에 글자 못넣기 하기로 바뀜
        // try {
        //     let ls = CarNum.match(/([가-힣]+)?([0-9]+)([가-힣]+)([0-9]+)/i);
        //     if(ls[1]==="임시") {
        //         return ls[4].length >= 6;
        //     }
        //     else if (ls[1] ==="외교"
        //         || ls[1]==="영사"
        //         || ls[1]==="준영"
        //         || ls[1]==="준외"
        //         || ls[1]==="국기"
        //         || ls[1]==="협정"
        //         || ls[1]==="대표") {
        //         return ls[2].length >= 3 && ls[4].length >= 3;
        //     }
        //     else {
        //         //return ls[2].length >= 2 && ls[3].length >= 1 && ls[4].length >= 4;
        //         return ls[2].length >= 2 && ls[2].length <= 3 && ls[3].length == 1 && ls[4].length == 4;
        //     }
        //  } catch (e) {
        //
        //  }
        try {
            let ls = CarNum.match(/([가-힣]+)?([0-9]+)([가-힣]+)([0-9]+)/i);
            let ls2 = CarNum.match(/([가-힣]+)([0-9]+)/i);
            if (ls2[1] === '임시') {
                return true;
            }
            if (ls[0] !== ls.input) return false;
            if (ls[1] === undefined || ls[1] === '') {
                return ls[2].length >= 2 && ls[2].length <= 3 && ls[3].length == 1 && ls[4].length == 4;
            } else {
                return false;
            }
        } catch (e) {

        }
        return false;
    },
    is_space: function (str) {
        return str.indexOf(" ") > -1;
    },
    unValidation_ID: function (str) {
        //한글 가능한 아이디. ㄴ ㅁ 같은 자소 문자는 안됨. 스페이스 안됨. 특수기호 불가
        let flag = false;
        let id_regExp = /[0-9a-zA-Z가-힣]/;

        if (this.is_space(str)) return true;

        if (str[0] === '#') return true; //혹시 몰라 이중 점검 # 막기

        for (let i = 0; i < str.length; i++) {
            if (id_regExp.test(str[i]) === false) {
                //오류 처리
                flag = true;
                break;
            }
        }

        return flag;
    },
    unValidation_password: function (str) {
        //비밀 번호 영어, 숫자, 특수기호 가능
        // let num = pass_val.search(/[0-9]/g);
        // let eng = pass_val.search(/[a-z]/ig);
        // let spe = pass_val.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

        //패스워드 정해진값 이에의 값인지 체크.
        let regExp2 = /[0-9a-zA-Z`~!@@#$%^&*|₩₩₩'₩";:₩/?]/;
        let flag = false;
        for (let i = 0; i < str.length; i++) {
            if (regExp2.test(str[i]) === false) {
                flag = true;
                break;
            }
        }

        return flag;
    },
    unValidation_NAME: function (str) {
      //한글 가능한 이름. ㄴ ㅁ 같은 자소 문자는 안됨. 특수기호 불가. 최소 2자이상
      let flag = false;
      let id_regExp = /[0-9a-zA-Z가-힣 ]/;

      if (str[0] === '#') return true; //혹시 몰라 이중 점검 # 막기

      if (str.length < 2) return true;

      for (let i = 0; i < str.length; i++) {
        if (id_regExp.test(str[i]) === false) {
          //오류 처리
          flag = true;
          break;
        }
      }

      return flag;
    },
    format_utcString: function (val) {
        return val + "+00:00";
    },
    deepCopy: function (obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (e) {
            this.log(e);
            return null;
        }
    },
    isChrome: function () {
        // please note,
        // that IE11 now returns undefined again for window.chrome
        // and new Opera 30 outputs true for window.chrome
        // but needs to check if window.opr is not undefined
        // and new IE Edge outputs to true now for window.chrome
        // and if not iOS Chrome check
        // so use the below updated condition
        var isChromium = window.chrome;
        var winNav = window.navigator;
        var vendorName = winNav.vendor;
        var isOpera = typeof window.opr !== "undefined";
        var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
        var isIOSChrome = winNav.userAgent.match("CriOS");

        if (isIOSChrome) {
            return true;
        } else if (
            isChromium !== null &&
            typeof isChromium !== "undefined" &&
            vendorName === "Google Inc." &&
            isOpera === false &&
            isIEedge === false
        ) {
            return true;
        } else {
            return false;
        }
    },
    downloadExcel: function (data) {

        // colum 필요 / item 핑요

        const wb = new Excel.Workbook();

        let ws = wb.addWorksheet((Array.isArray(data.sheetname) && data.sheetname[0]) ? data.sheetname[0] : 'sheet');

        function getExcelColIndex(num) {
            let Binary = 26;
            let share = parseInt(num / Binary);
            let remainder = num % Binary;
            //앞파벳 A-Z , 65-90 총26자
            let _match = String.fromCharCode(65 + remainder);
            return '' + (share > 0 ? getExcelColIndex(share) : '') + _match;
        }

        data.cols.forEach(function (val, index) {
            let col_index = getExcelColIndex(index) + '1';
            let col = ws.getCell(col_index);
            col.value = val;
            col.alignment = {vertical: 'middle', horizontal: 'center'};
            col.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fff1f1f1'}
            }
            col.border = {
                top: {style: 'thin', color: {argb: 'FF000000'}},
                left: {style: 'thin', color: {argb: 'FF000000'}},
                bottom: {style: 'thin', color: {argb: 'FF000000'}},
                right: {style: 'thin', color: {argb: 'FF000000'}}
            };
            ws.getColumn((index + 1)).width = 20;
            //cols_style 속성으로 속성 변경하게 만들기
        });

        data.items.forEach(function (colarr, rindex) {
            colarr.forEach(function (val, cindex) {
                let col_index = getExcelColIndex(cindex) + (rindex + 2);
                let col = ws.getCell(col_index);
                col.value = val;
                col.alignment = {vertical: 'middle', horizontal: 'center'};
                col.border = {
                    top: {style: 'thin', color: {argb: 'FF000000'}},
                    left: {style: 'thin', color: {argb: 'FF000000'}},
                    bottom: {style: 'thin', color: {argb: 'FF000000'}},
                    right: {style: 'thin', color: {argb: 'FF000000'}}
                };
            })

        })



        wb.xlsx.writeBuffer({
            base64: true
        })
            .then(async function (xls64) {
                // build anchor tag and attach file (works in chrome)
                var a = document.createElement("a");
                let request_excel = new Blob([xls64], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

                let res_excel = null;
                if(data.encryption){
                    res_excel = await mainapi.invokeAPI_excelFile(request_excel,data.filename);
                    if(res_excel===false){
                        tool_app.dialog_alert('다운로드에 실패 하였습니다.<br/> 개발자에게 문의해주세요.')
                        return false;
                    }
                }else{
                    res_excel = request_excel;
                }


                let bb = new Blob(
                    [res_excel],
                    {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                );


                var url = URL.createObjectURL(bb);
                a.href = url;
                a.download = (data.filename ? data.filename : 'export') + ".xlsx";
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                },
                0);

                if(data.encryption){
                    return new Promise(function(resolve,reject){
                        resolve(true);
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
                console.log(error.message);
            });
    },
    webdcstorekey: 'webdiscount',
    setWebdiscountHistory(desc) {
        let origin = window.localStorage.getItem(this.webdcstorekey);
        if (origin) {
            origin = JSON.parse(origin);
        } else {
            origin = {
                descriptionList: []
            }
        }

        let duplicated = -1;
        for (let i = 0; i < origin.descriptionList.length; i++) {
            if (origin.descriptionList[i] === desc) {
                duplicated = i;
                break;
            }
        }
        if (duplicated < 0) {
            origin.descriptionList.unshift(desc);
            origin.descriptionList.length = Math.min(origin.descriptionList.length, 6);
        } else {
            origin.descriptionList.splice(duplicated, 1);
            origin.descriptionList.unshift(desc);
        }


        window.localStorage.setItem(this.webdcstorekey, JSON.stringify(origin));
    },
    getWebdiscountHistory() {
        let res = window.localStorage.getItem(this.webdcstorekey);

        return res ? JSON.parse(res) : null;
    },
    compareArrayEqualElement(arr1, arr2) {
        let res = false;
        landsection:
            for (let i = 0; i < arr1.length; i++) {
                for (let j = 0; j < arr2.length; j++) {
                    if (arr1[i] === arr2[j]) {
                        res = true;
                        break landsection;
                    }
                }
            }
        return res;
    },
    formattingTimeRegular(temp) {
        let day = parseInt(temp / $const.TIME.DAY);
        temp = temp - ($const.TIME.DAY * day);
        let hour = parseInt(temp / $const.TIME.HOUR);
        temp = temp - ($const.TIME.HOUR * hour);
        let min = parseInt(temp / $const.TIME.MIN);
        temp = temp - ($const.TIME.MIN * min);
        let sec = parseInt(temp / $const.TIME.SEC);

        let str = '';
        if (day) str += day + '일 ';

        if (hour || day) str += hour + '시간 ';

        if (min || hour) str += min + "분 ";

        str += sec + "초";

        return str;
    },
    formattingTimeRegular02(temp) {
        //0분 0초 안나오게
        let day = parseInt(temp / $const.TIME.DAY);
        temp = temp - ($const.TIME.DAY * day);
        let hour = parseInt(temp / $const.TIME.HOUR);
        temp = temp - ($const.TIME.HOUR * hour);
        let min = parseInt(temp / $const.TIME.MIN);
        temp = temp - ($const.TIME.MIN * min);
        let sec = parseInt(temp / $const.TIME.SEC);

        let str = '';
        if (day) str += day + '일 ';

        if (hour) str += hour + '시간 ';

        if (min) str += min + "분 ";

        if (sec) str += sec + "초";

        return str;
    },
    timeMinToHourFormat(temp) {
        let hour = parseInt(temp / 60);
        temp = temp - (60 * hour);
        let min = temp;

        let str = '';

        if (hour) str += hour + '시간';

        if (min) str += min + "분";

        return str;
    },
    capitalizeFirstLetter(string) {
        let str = string.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    urlWrappingAtag(text) {
        return text.replaceAll(/(?:(https?\:\/\/[^\s]+))/gm, '<a target="_blank" href="$1">$1</a>');
    },
    enterToBrTag(text) {
        return text.replaceAll(/\n/g, '<br/>');
    },
    spaceToNbsp(text) {
        return text.replaceAll(/ /g, '&nbsp;');
    },
    checkDurationOneMonth(st, et) {
        let _st = moment(st);

        let oneMonth = moment(et).subtract(1, 'months').add(1, 'days').startOf('day').format();
        if (_st.diff(oneMonth) < 0) {
            tool_app.dialog_alert('한달이상의 기간을 설정할 수 없습니다.');
            return false;
        } else {
            return true;
        }
    },
    checkDurationTwoMonth(st, et) {
        let _st = moment(st);

        let twoMonth = moment(et).subtract(2, 'months').add(1, 'days').startOf('day').format();
        if (_st.diff(twoMonth) < 0) {
            tool_app.dialog_alert('두달이상의 기간을 설정할 수 없습니다.');
            return false;
        } else {
            return true;
        }
    },
    checkDurationTwoWeeks(st, et) {
        let _st = moment(st);
        let _et = moment(et);

        let weeks = moment().subtract(2, 'weeks');

        if (weeks.diff(_st) >= 0 || weeks.diff(_et) >= 0) {

            return false;
        } else {
            return true;
        }
    },
    async MakeExcelList(getList) {
        let listRowLimit = 50000;
        return new Promise(async function (resolve, reject) {
            try {
                let {totalcount, list} = await getList(true, 1);
                let resList = [...list]
                let totalCalls = parseInt(totalcount / listRowLimit) + 1;

                for (let i = 2; i <= totalCalls; i++) {
                    let {totalcount, list} = await getList(true, i);
                    resList = [...resList, ...list];
                }
                resolve(resList)
            } catch (e) {
                reject(false)
            }
        })
    },
    enableNaN(num, ifNaNValue) {
        let inv = ifNaNValue ? ifNaNValue : 0;
        return isNaN(num) ? inv : parseInt(num);
    },
    logLine() {
        console.log('*************************************************************')
        console.log('*************************************************************')
    },
    checkios() {
        return [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod'
            ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    },
    getDomain(url) {
        const pattern = /(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi;
        let domain = url.match(pattern);
        domain = domain[0];
        return domain;
    },
    checkWebsiteVersionTime: 0,
    checkWebsiteVersion(type) {
        let self = this;
        return new Promise((resolve, reject) => {
            let perHours = 2 * $const.TIME.HOUR; //2시간 마다 체크


            if (type === 'login' || self.checkWebsiteVersionTime === 0 ||
                (self.checkWebsiteVersionTime > 0 && new Date().getTime() - self.checkWebsiteVersionTime > perHours)
            ) {
                self.checkWebsiteVersionTime = new Date().getTime();
            } else {
                return;
            }


            fetch('/currentVersion.json', {cache: "no-store"}).then((response) => response.json())
                .then((json) => {
                    let _webVersionNum, _jsonVersionNum;
                    self.log('update_check');
                    tool_app.log(process.env.ENV_NAME);
                    if (type === 'all') {
                        // _webVersionNum = self[process.env.ENV_NAME+'_appversion'].replaceAll('.','');
                        // _jsonVersionNum = json[process.env.ENV_NAME+'_appversion'].replaceAll('.','');
                        // 정책 정해지면 하기
                        // 슈퍼어드민 주차장 이동을 통해 접근하는 경우가 많아서 필요 없을 듯 하다.
                        _webVersionNum = _jsonVersionNum = 1;
                    } else {
                        _webVersionNum = self[process.env.ENV_NAME + '_autoUpdateVersion'].replaceAll('.', '');
                        _jsonVersionNum = json[process.env.ENV_NAME + '_autoUpdateVersion'].replaceAll('.', '');
                        self.resJsonAutoVersion = _jsonVersionNum;
                    }

                    self.log(_webVersionNum);
                    self.log(_jsonVersionNum);

                    _webVersionNum = parseInt(_webVersionNum);
                    _jsonVersionNum = parseInt(_jsonVersionNum);
                    if (_webVersionNum < _jsonVersionNum) {
                        resolve();
                    } else {

                    }
                }).catch(function (e) {
                self.log(e);
            });
        });
    },
    isWeekend() {
        let today = new Date();
        let dayOfWeek = today.getDay();
        return (dayOfWeek === 6 || dayOfWeek === 0); // 6 = 토요일, 0 = 일요일
    },
    sortHanGulASC(arr, prop) {
        let res = arr.sort(function (a, b) {
            let nameA = a[prop].toLowerCase();
            let nameB = b[prop].toLowerCase();
            if (nameA < nameB) return -1;
            else if (nameA > nameB) return 1;
            return 0;
        });
        return res;
    },
    TAB: '    ',
    prettyJson(jsonText) {
        let _self = this;
        if (!jsonText) {
            return jsonText;
        }

        var prettyJson = new Array();
        var depth = 0;
        var currChar;
        var prevChar;
        var doubleQuoteIn = false;

        for (var i = 0; i < jsonText.length; i++) {
            currChar = jsonText.charAt(i);

            if (currChar == '\"') {
                if (prevChar != '\\') {
                    doubleQuoteIn = !doubleQuoteIn;
                }
            }

            switch (currChar) {
                case '{':
                    prettyJson.push(currChar);
                    if (!doubleQuoteIn) {
                        prettyJson.push('\n');
                        _self.insertTab(prettyJson, ++depth);
                    }
                    break;
                case '}':
                    if (!doubleQuoteIn) {
                        prettyJson.push('\n');
                        _self.insertTab(prettyJson, --depth);
                    }
                    prettyJson.push(currChar);
                    break;
                case ',':
                    prettyJson.push(currChar);
                    if (!doubleQuoteIn) {
                        prettyJson.push('\n');
                        _self.insertTab(prettyJson, depth);
                    }
                    break;
                default:
                    prettyJson.push(currChar);
                    break;
            }

            prevChar = currChar;
        }
        return prettyJson.join('');
    },
    insertTab(prettyJson, depth) {
        let _self = this;
        for (var i = 0; i < depth; i++) {
            prettyJson.push(_self.TAB);
        }
    },
    checkIphone() {
        let isiPhone = /iPhone/.test(navigator.userAgent);
        return isiPhone;
    },
    validatePassword(pw, options) {
        // default options (allows any password)
        var o = {
            lower: 0,
            upper: 0,
            alpha: 0, /* lower + upper */
            numeric: 0,
            special: 0,
            length: [0, Infinity],
            custom: [ /* regexes and/or functions */],
            badWords: [],
            badSequenceLength: 0,
            noQwertySequences: false,
            noSequential: false
        };

        let totalCharType = options.total;

        delete options.total;

        for (var property in options)
            o[property] = options[property];


        var re = {
                lower: /[a-z]/g,
                upper: /[A-Z]/g,
                alpha: /[A-Z]/gi,
                numeric: /[0-9]/g,
                special: /[!@#$%^&*]/g
            },
            rule, i;

        // enforce min/max length
        if (pw.length < o.length[0] || pw.length > o.length[1])
            return false;

        // enforce lower/upper/alpha/numeric/special rules
        for (rule in re) {
            if ((pw.match(re[rule]) || []).length < o[rule])
                return false;
        }

        //세가지 종류 이상의 문자 구성으로 8자리 이상의 길이
        if(totalCharType > 0){
            let lower_cnt = (pw.match(re['lower']) || []).length > 0 ? 1 : 0;
            let upper_cnt = (pw.match(re['upper']) || []).length > 0 ? 1 : 0;
            let numeric_cnt = (pw.match(re['numeric']) || []).length > 0 ? 1 : 0;
            let special_cnt = (pw.match(re['special']) || []).length > 0 ? 1 : 0;

            tool_app.log(lower_cnt + upper_cnt + numeric_cnt + special_cnt)
            if(lower_cnt + upper_cnt + numeric_cnt + special_cnt < totalCharType) return false;
        }

        // enforce word ban (case insensitive)
        for (i = 0; i < o.badWords.length; i++) {
            if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1)
                return false;
        }

        // enforce the no sequential, identical characters rule
        if (o.noSequential && /([\S\s])\1/.test(pw))
            return false;

        // enforce alphanumeric/qwerty sequence ban rules
        if (o.badSequenceLength) {
            var lower = "abcdefghijklmnopqrstuvwxyz",
                upper = lower.toUpperCase(),
                numbers = "0123456789",
                qwerty = "qwertyuiopasdfghjklzxcvbnm",
                start = o.badSequenceLength - 1,
                seq = "_" + pw.slice(0, start);
            for (i = start; i < pw.length; i++) {
                seq = seq.slice(1) + pw.charAt(i);
                if (
                    lower.indexOf(seq) > -1 ||
                    upper.indexOf(seq) > -1 ||
                    numbers.indexOf(seq) > -1 ||
                    seq.slice(0,2) == (seq.slice(2) + seq.slice(2)) ||
                    (o.noQwertySequences && qwerty.indexOf(seq) > -1)
                ) {
                    return false;
                }
            }
        }

        // enforce custom regex/function rules
        for (i = 0; i < o.custom.length; i++) {
            rule = o.custom[i];
            if (rule instanceof RegExp) {
                if (!rule.test(pw))
                    return false;
            } else if (rule instanceof Function) {
                if (!rule(pw))
                    return false;
            }
        }

        // great success!
        return true;
    },
    wrapperValidPassword(password){
        return this.validatePassword(password,{
            length:   [8, 16],
            total : 3, //최대 3가지 문자 커스텀 속성
            // lower:    1,
            // upper:    1,
            // numeric:  1,
            // special:  1,
            // badWords: [],
           // badSequenceLength: 3
        });
        //피해야할 단어 출처 https://www.boannews.com/media/view.asp?idx=111995

        // 적용된 기능
        // 세가지 종류 이상의 문자 구성으로 8자리 이상의 길이
        // 문자와 숫자의 연속사용은 금지
        // 자판의 연속배열중 일부 금지
        // 대중적으로 많이 사용하는 password 금지
        // badword 문구 노출 분기로 인해 코드 분리

    },
    checkIncludeBadword(password){
        let badWords =  ["password", "steven", "levithan",'kia','guest','qwerty','passw0rd','fuckyou','fuckoff','iloveyou','teamo',
            'PublishThisListPlease','root','wubao','admin','p@ssw0rd','jiamima','test','!qaz@wsx','alpine','1q2w3e4r','default','1qaz2wsx',
            'toor','user','asdf','redhat','cisco','1q2w3e4r5t','changeme','letmein','server','master','system','welcome','linux','manager',
            'administrator','superuser','ubuntu','zxcvbnm','vmware','asdfgh','pa55w0rd','centos','p@$$w0rd',
            'ichliebedich','sunshine','princess','love','1q2w3e','a1b2c3']

        for (let i = 0; i < badWords.length; i++) {
            if (password.toLowerCase().indexOf(badWords[i].toLowerCase()) > -1)
                return false;
        }

        return true;
    },
    makeArrayForCreateApi(str){
        if (typeof str !== "string") {
            return null;
        } else {
            let res = [];
            let _str = str;
            _str = str.trim().replaceAll(' ','');
            if(_str){
                res = _str.split(',');
            }else{
                res = null;
            }
            return res;
        }
    },
    emptyArrayNull(arr){
        try{
            if(arr === null) return null;
            return arr.length > 0 ? arr : null;
        }catch (e) {
            return null;
        }

    },
    ErrorMsg(tar){
        // string 타입일 경우 그대로 반환
        if (typeof tar === 'string') {
            return tar;
        }
        // 에러 객체일 경우 Message 프로퍼티 반환
        else if (tar instanceof Error) {
            return tar.message;
        }
        // 그 외의 객체일 경우 msg 프로퍼티 반환
        else if (typeof tar === 'object' && tar !== null) {
            return tar.msg;
        }
        // 위 조건에 해당하지 않는 경우(undefined 등), 알 수 없는 타입 처리
        else {
            return 'catch e Unknown type';
        }
    },
    payloadNumber(value){
        try{
            return parseInt(value);
        }catch (e) {
            return 0;
        }
    },
    descTimetable(arr){
        if(Array.isArray(arr) === false) return null;

        let res = [];
        for(let j=0;j<$const.WEEK_E.length;j++){
            for (let i = 0; i < arr.length; i++) {
                let obj = arr[i];
                if(obj.dayOfWeek === $const.WEEK_E[j] || obj.startDate === $const.WEEK_E[j]){
                    obj.week = $const.WEEK_E[j];
                    res.push({
                        dayOfWeek : $const.WEEK_EtoK[arr[i].dayOfWeek ? arr[i].dayOfWeek : arr[i].startDate],
                        start : arr[i].start,
                        end : arr[i].end,
                    })
                }
            }
        }
        return res;
    },
    covertDetailToEdit(prop, api_data,pageData){

        // deprecated 예정
        // 셀렉트 박스에서 검색방식으로 변경
        function getId(val){
            try{
                if(typeof val==='string'){
                    return val;
                }
                if(val.id){
                    return val.id;
                }
                if(val === null){
                    return '';
                }
            }catch (e) {
                return ''
            }
        }
        function getArr(val){
            try{
                if(Array.isArray(val)){
                    return val;
                }
                if(val===null){
                    return [];
                }
            }catch (e) {
                return []
            }
        }

        try{
            if (prop === 'enterMachineGroupIds') {
                api_data.enterMachineGroupIds = getArr(pageData.enterMachineGroup);
                return true;
            } else if (prop === 'zoneGroupIds') {
                tool_app.log(pageData.zoneGroup)
                api_data.zoneGroupIds = getArr(pageData.zoneGroup);
                return true;
            } else if (prop === 'zoneIds') {
                api_data.zoneIds = getArr(pageData.zoneGroup);
                return true;
            }else if (prop === 'passGroupId') {
                api_data.passGroupId = getId(pageData.passGroup)
                return true;
            } else if (prop === 'clientId') {
                api_data.clientId = getId(pageData.client)
                return true;
            } else if (prop === 'passFormId') {
                api_data.passFormId = getId(pageData.passForm)
                return true;
            } else if (prop === 'mainZoneId') {
                api_data.mainZoneId = getId(pageData.mainZone)
                return true;
            }else if (prop === 'details') {
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            }else if (prop === 'data') {
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            }else if (prop === 'keys') {
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            }else if(prop==='devices'){
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            } else if (prop === 'benefits') {
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            }else if (prop === 'siteId') {
                api_data.siteId = getId(pageData.site)
                return true;
            }else if (prop === 'zoneId') {
                api_data.zoneId = getId(pageData.zone)
                return true;
            }else if (prop === 'passId') {
                api_data.passId = getId(pageData.pass)
                return true;
            }else if (prop === 'tenantId') {
                api_data.tenantId = getId(pageData.tenant)
                return true;
            }else if (prop === 'operatorId') {
                api_data.operatorId = getId(pageData.operator)
                return true;
            }else if (prop === 'enterMachineId') {
                api_data.enterMachineId = getId(pageData.enterMachine)
                return true;
            }else if (prop === 'tenantGroupId') {
                api_data.tenantGroupId = getArr(pageData.tenantGroup)
                return true;
            }else if(prop === 'maintainerId'){
                api_data.maintainerId = getId(pageData.maintainer)
              return true;
            }else if(prop === 'discountFormId'){
                api_data.discountFormId = getId(pageData.discountForm)
                return true;
            }



        }catch (e) {
            return false;
        }
    },
    covertDetailToEdit02(prop, api_data,pageData){

        function getId(val){
            try{
                if(typeof val==='string'){
                    return val;
                }
                if(val.id){
                    return val.id;
                }
                if(val === null){
                    return '';
                }
            }catch (e) {
                return ''
            }
        }
        function getArr(val){
            try{
                if(Array.isArray(val)){
                    return val;
                }
                if(val===null){
                    return [];
                }
            }catch (e) {
                return []
            }
        }

        try{
            if (prop === 'details') {
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            }else if (prop === 'data') {
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            }else if (prop === 'keys') {
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            }else if(prop==='devices'){
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            } else if (prop === 'benefits') {
                if(typeof pageData[prop] !== 'string'){
                    api_data[prop] = JSON.stringify(pageData[prop]);
                }else{
                    api_data[prop] = pageData[prop];
                }
                return true;
            }
        }catch (e) {
            return false;
        }
    },
    makeJSONStringData(value){
        try{
            if(value === null || value === undefined || value===''){
                return JSON.stringify({});
            }else if(typeof value === 'string'){
                tool_app.log('object 1111')
                tool_app.log(value)
                let temp = JSON.parse(value);
                tool_app.log('object 2222')
                if(typeof temp === 'string'){
                    temp = JSON.parse(temp);
                }
                return JSON.stringify(temp);
                tool_app.log('object 33333');
            }
            tool_app.log('4444444444')
            return JSON.stringify(value);
        }catch (e) {
            return null;
        }
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    getApiData(obj){
        let res = this.deepCopy(obj);
        console.log('getApiData');
        console.log(res)
        for(let prop in res){
            if(typeof res[prop] === 'string'){
                res[prop] = res[prop].trim();
            }
        }
        return res;
    },
    vuelidate : {
        isGreaterThanZero : function(value){
            if(isNaN(value)) return false;
            return value > 0;
        }
    },
    getErrorMsg(errorObj){
        if(errorObj && errorObj.response && errorObj.response.data && errorObj.response.data.msg){
            return errorObj.response.data.msg;
        }else{
            return '';
        }
    }
}

window.tool_app = tool_app;
