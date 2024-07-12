
function browser_check(){
    let arr = [];
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 )
    {
        arr.push('Opera');
    }
    else if(navigator.userAgent.indexOf("Edg") != -1 )
    {
        arr.push('Edge');
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("CriOS") != -1)
    {
        arr.push('Chrome');
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        arr.push('Safari');
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 )
    {
        arr.push('Firefox');
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
        arr.push('IE');
    }
    else
    {
        arr.push('unknown');
    }

    return arr;
}
 let availableBrowser = false;
 browser_check().forEach(function(value, index, array){
     if(value == "Chrome" || value=="Edge"){
         availableBrowser = true;
     }
     if(isMobileOrTablet() && navigator.userAgent.indexOf("KAKAOTALK") > -1){
         availableBrowser = false;
     }

     function isMobileOrTablet() {
         // navigator 객체의 user agent 문자열에서 모바일 및 테블릿 기기 특징을 확인
         const userAgent = navigator.userAgent;

         // 정규 표현식을 사용하여 모바일 및 테블릿 기기 여부를 판단
         const mobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

         return mobileOrTablet;
     }
 })

 if(!availableBrowser){
     let domain = window.location.href;
     // let subdomain = /^https?:\/\/(.+?)\./.exec(domain)[1];
     // let path = domain.match(/:\/\/[^/]+(\/[^?#]+)/i);

     if(navigator.userAgent.indexOf("KAKAOTALK") > -1){
         window.location.href = "/checkchromeAPP.html?path="+domain;
     }else{
         window.location.href = "/checkchromeAPP.html?path="+domain;
     }
 }
