<template>
      <div>
            <button class="btn btn-success" @click="nicepayStart">버튼</button>
            <form name="payForm" method="post" action="http://localhost:3000/authReq" accept-charset="euc-kr" style="display:none">
                  <table>
                        <tr>
                              <th>PayMethod</th>
                              <td><input type="text" name="PayMethod" value="CARD"></td>
                        </tr>
                        <tr>
                              <th>GoodsName</th>
                              <td><input type="text" name="GoodsName" value="나이스상품"></td>
                        </tr>
                        <tr>
                              <th>Amt</th>
                              <td><input type="text" name="Amt" v-model="amt"></td>
                        </tr>
                        <tr>
                              <th>MID</th>
                              <td><input type="text" name="MID" v-model="merchantID"></td>
                        </tr>
                        <tr>
                              <th>Moid</th>
                              <td><input type="text" name="Moid" v-model="moid"></td>
                        </tr>
                        <tr>
                              <th>BuyerName</th>
                              <td><input type="text" name="BuyerName" value="구매자"></td>
                        </tr>
                        <tr>
                              <th>BuyerEmail</th>
                              <td><input type="text" name="BuyerEmail" value="happy@day.com"></td>
                        </tr>
                        <tr>
                              <th>BuyerTel</th>
                              <td><input type="text" name="BuyerTel" value="00000000000"></td>
                        </tr>
                        <tr>
                              <th>ReturnURL [Mobile only]</th>
                              <td><input type="text" name="ReturnURL" value="http://localhost:3000/authReq">
                              </td>
                        </tr>
                        <tr>
                              <th>Virtual Account Expiration Date(YYYYMMDD)</th>
                              <td><input type="text" name="VbankExpDate" value=""></td>
                        </tr>

                        <input type="hidden" name="NpLang" value="KO"/> <!-- EN:English, CN:Chinese, KO:Korean -->
                        <input type="hidden" name="GoodsCl" value="1"/> <!-- products(1), contents(0)) -->
                        <input type="hidden" name="TransType" value="0"/>   <!-- USE escrow false(0)/true(1) -->
                        <input type="hidden" name="CharSet" value="utf-8"/>   <!-- Return CharSet -->
                        <input type="hidden" name="ReqReserved" value=""/>   <!-- mall custom field -->

                        <!-- DO NOT CHANGE -->
                        <input type="hidden" name="EdiDate" v-model="EdiDate"/>         <!-- YYYYMMDDHHMISS -->
                        <input type="hidden" name="SignData" v-model="SignData" />
                        <!-- EncryptData -->
                  </table>
                  <a href="#" class="btn_blue" onClick="nicepayStart();">REQUEST</a>
            </form>
      </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import format from 'date-format';
import axios from "axios";
import qs from 'qs';


//테스트 정보
const merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";
const merchantID = "nicepay00m";

//rs에서 준 테스트 정보
// const merchantKey = "kycaSzY5z+nxjlh/KUc/tUMBVWoAXl9yU+IuTZKW2ZN1CAZpzL5g1KngKtNt18qY3Nk//HCcBuZOpAlzIWecng==";
// const merchantID = "kmpark002m";


var amt = '104';
var returnURL = 'http://localhost:3000/authReq';
var goodsName = "나이스상품";
var moid = 'nice_api_test_3.0';
var buyerName = '구매자';
var buyerEmail = 'happy@day.com';
var buyerTel = '00000000000';
var ediDate = format.asString('yyyyMMddhhmmss', new Date());
var signData = getSignData(ediDate + merchantID + amt + merchantKey).toString();

function getSignData(str) {
      var encrypted = CryptoJS.SHA256(str);
      return encrypted;
}
window.nicepayStart = function(){
      goPay(document.payForm);
}

// //[PC Only]When pc payment window is closed, nicepay-pgweb.js call back nicepaySubmit() function <<'nicepaySubmit()' DO NOT CHANGE>>
// window.nicepaySubmit = function(){
//       // let form = document.payForm;
//       // tool_app.log(form)
//       // var authResultCode = form.AuthResultCode.value;
//       // var authResultMsg = form.AuthResultMsg.value;
//       // var txTid = form.TxTid.value;
//       // var authToken = form.AuthToken.value;
//       // var payMethod = form.PayMethod.value;
//       // var mid = form.MID.value;
//       // var moid = form.Moid.value;
//       // var amt = form.Amt.value;
//       // var reqReserved = form.ReqReserved.value;
//       // var nextAppURL = form.NextAppURL.value; //승인 API URL
//       // var netCancelURL = form.NetCancelURL.value;  //API 응답이 없는 경우 망취소 API 호출
//       // //var authSignature = req.body.Signature; //Nicepay에서 내려준 응답값의 무결성 검증 Data
//       // //인증 응답 Signature = hex(sha256(AuthToken + MID + Amt + MerchantKey)
//       // //var authComparisonSignature = getSignData(req.body.AuthToken + req.body.MID + req.body.Amt + merchantKey).toString();
//       // var signData = getSignData(authToken + mid + amt + ediDate + merchantKey).toString();
//       //
//       // alert(nextAppURL)
//       // /*
// 		// ****************************************************************************************
// 		// * Signature : 요청 데이터에 대한 무결성 검증을 위해 전달하는 파라미터로 허위 결제 요청 등 결제 및 보안 관련 이슈가 발생할 만한 요소를 방지하기 위해 연동 시 사용하시기 바라며
// 		// * 위변조 검증 미사용으로 인해 발생하는 이슈는 당사의 책임이 없음 참고하시기 바랍니다.
// 		// ****************************************************************************************
// 		// */
//       //
//       // // Configure the request
//       // var options = {
//       //       url: nextAppURL,
//       //       method: 'POST',
//       //       headers: {
//       //             'Content-Type': 'application/x-www-form-urlencoded'
//       //       },
//       //       data : qs.stringify({ 'TID': txTid,
//       //             'AuthToken': authToken,
//       //             'Amt': amt,
//       //             'MID': mid,
//       //             'SignData': signData,
//       //             'EdiDate': ediDate,
//       //       })
//       // }
//       // tool_app.log('options')
//       // tool_app.log(options)
//       // axios(options).then(function(response){
//       //       console.log('response')
//       //       console.log(response);
//       // }).catch(function(error){
//       //       console.log(error);
//       // });
//
//       document.payForm.submit();
// }

//[PC Only]payment window close function <<'nicepayClose()' DO NOT CHANGE>>
window.nicepayClose = function(){
      alert("결제가 취소 되었습니다");
}
export default {
    name: "pgtest",
      layout : 'auth',
      head: {
            script: [
                  { src: 'https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js', body: true }
            ]
      },
      created(){
            // loadScript('https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js', () => {
            //       console.log('Script loaded!')
            // })
// {src: 'https://pay.nicepay.co.kr/v1/js/'},
            // {src: 'https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js'}
      },
    data() {


          return {
                EdiDate : ediDate,
                SignData : signData,
                merchantID : merchantID,
                moid : moid,
                amt : amt,
          }
    },
    methods: {
        nicepayStart() {

            /*
            GoodsName	40 byte 필수 결제상품명 (euc-kr)
				Amt	12 byte 필수 금액 (Only number)
				MID	10 byte 필수 상점아이디 ex)nicepay00m
				EdiDate	30 byte 필수 요청 시간 (YYYYMMDDHHMISS)
				Moid	64 byte 필수 상품주문번호
				SignData	500 byte 필수 hex(sha256(EdiDate + MID + Amt + MerchantKey)) , 위변조 검증 데이터
				PayMethod	10 byte 필수
				CARD : 신용카드
				BANK : 계좌이체
				VBANK : 가상계좌
				CELLPHONE : 휴대폰결제
				ReturnURL	500 byte 모바일 필수 요청 응답 URL (절대 경로)
				BuyerName	30 byte 구매자명 (euc-kr)
				BuyerTel	20 byte 구매자연락처 (Only number)
				ReqReserved	500 byte 가맹점 여분 필드
				BuyerEmail	60 byte 구매자 메일주소
				CharSet	12 byte 인증 응답 인코딩 (euc-kr / utf-8)
				VbankExpDate	12 byte 가상계좌 추가 파라미터 가상계좌입금만료일 (YYYYMMDDHHMM)
				GoodsCl	1 byte 휴대폰 소액결제 추가 파라미터 0:컨텐츠, 1:실물
				ConnWithIframe	1 byte iframe 기반 연동 시 추가 파라미터 Y:iframe 기반 NICEPAY 인증 호출
				미입력 시 일반 form 객체 전달 (iframe 기반 연동 시에만 해당 옵션 사용)
             */

            //  window.nicepayStart();
            goPay(document.payForm);

        },


        serverAuth() {
            // let wp_iframe = document.querySelector('#wp_iframe');
            // // let lastIframe = document.querySelector('#pg_iframe');
            // //
            // // if(lastIframe){
            // //   lastIframe.re
            // // }
            //
            // let iframe = document.createElement("iframe");
            //
            // iframe.id='pg_iframe';
            // iframe.style.width = '100%';
            // iframe.style.height = '100%';
            // wp_iframe.innerHTML = '';
            // wp_iframe.appendChild(iframe);
            // iframe.src = 'http://localhost:7978/#/ut/shop/pgiframe';

            AUTHNICE.requestPay({
                clientId: 'S2_8d7cc758ea2c44d2821e6729c4b91e0a',
                method: 'card',
                orderId: this.random(),
                amount: 1004,
                goodsName: '나이스페이-상품',
                returnUrl: 'http://localhost:7978/#/ut/shop/pgreturn',
                fnError: function (result) {
                    alert('고객용메시지 : ' + result.msg + '\n개발자확인용 : ' + result.errorMsg + '')
                }
            });
        },
        random() {
            let length = 8;
            return Math.random().toString(16).substr(2, length);
        }
    }
}
</script>

<style>

</style>
