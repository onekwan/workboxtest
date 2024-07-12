<script>
import {required, email} from "vuelidate/lib/validators";
import axios from "axios";

import {
	 saveToken,
	 saveUser,
	 currentUserInit,
	 menuListInit,
	 saveIsAdmin,
	 saveAccessParkingLotList,
	 getJWTCookie,
	 eraseJWTCookie
} from '../../plugins/main/jwt';

export default {
	 layout: "auth",
	 data() {
		  return {
				user_id: "",
				user_password: "",
				submitted: false,
				authError: null,
				tryingToLogIn: false,
				isAuthError: false,
				selectedDefault : 'admin',
				login_flag : false,
				cs_phoneNumber : null
		  };
	 },
	 validations: {
		  user_id: {
				required
		  },
		  user_password: {
				required
		  }
	 },
	 created() {
		  let vm=this;
		  this.$store.dispatch("auth/logOut");
	 },
	 mounted() {

	 },
	 computed: {
		  notification() {
				return this.$store ? this.$store.state.notification : null;
		  },
		  notificationAutoCloseDuration() {
				return this.$store && this.$store.state.notification ? 5 : 0;
		  }
	 },
	 methods: {
		  // Try to log the user in with the username
		  // and password they provided.
		  async tryToLogIn() {
				let vm = this;
				if(vm.tryingToLogIn) return false;

				vm.submitted = true;
				vm.tryingToLogIn = true;
				// stop here if form is invalid
				this.$v.$touch();

				if (this.$v.$invalid) {
					 vm.tryingToLogIn = false;
					 return;
				} else {
					 try{
						  let payload = {
								username : vm.user_id,
								password : vm.user_password
						  }


						  let res = await mainapi.invokeAPI_login(payload);

						  if (res.data.code !== 200000) {
								tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg);
								vm.tryingToLogIn = false;
								vm.isAuthError = true;
								return false;
						  }else{

								let data = res.data.data;
								let token = data.accessToken;
								delete data.accessToken;
								let user = {
									 ...data
								};
								let obj = {
									 token: token,
									 user: user,
									 menuList: ''
								}



								vm.$store.dispatch("auth/logIn", obj);
								vm.tryingToLogIn = false;
								vm.isAuthError = false;

                        window.localStorage.setItem('loginType', 'admin');

								vm.$router.push(
										vm.$route.query.redirectFrom || {
											 path: "/"
										}
								);
						  }
					 }catch (e) {
                    vm.tryingToLogIn = false;

                    tool_app.dialog_alert('로그인에 실패하였습니다.'+tool_app.getErrorMsg(e))
							tool_app.log('로그인에 실패하였습니다.')
					 }
				}
		  }
	 }
};
</script>

<template>
	 <div>
		  <div class="account-pages my-5 pt-sm-5">
				<div class="container">
					 <div class="mt-5 row align-items-center justify-content-center">

						  <div class="col-md-9 col-lg-7 col-xl-8 login_box_width">
								<div class="card">
										<div class="auth_loading" v-show="tryingToLogIn">
                                    <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
										</div>
									 <div class="card-body p-4">
                                  <div class="col-lg-12">
                                        <div class="text-center">
                                              <h1 class="font-size-24 justify-content-center align-content-center" style="height: 50px">알바트로스 관리자 로그인</h1>

														  <nuxt-link to="/account/move">무브 페이지로 이동</nuxt-link>

														  <p>cd 잘되나 테스트~~~</p>
														  <ol>
																<li class="text-left">배포 11:54 2024-07-12<span style="color:red">실패</span></li>
																<li class="text-left">배포 11:58 변경된 html<span style="color:red">실패</span></li>
																<li class="text-left">배포 12:02 urlPattern 변경</li>
																<li class="text-left">배포 12:05 urlPattern 변경 된 것 테스트<span style="color:red">실패</span></li>
																<li class="text-left">배포 14:12 캐쉬 네임 버전</li>
														  </ol>
                                        </div>
                                  </div>
<!--										  <div class="text-center mt-2">-->
<!--												<b-spinner v-show="tryingToLogIn" variant="secondary" role="status" class="modal_spinner"></b-spinner>-->
<!--												<h5 class="text-primary">관리자 로그인</h5>-->
<!--												<div v-if="false">-->
<!--													 <b-form-radio-->
<!--															 v-model="selectedDefault"-->
<!--															 class="mb-3"-->
<!--															 value="admin"-->
<!--															 plain-->
<!--													 >관리자 로그인-->
<!--													 </b-form-radio>-->
<!--													 <b-form-radio-->
<!--															 v-model="selectedDefault"-->
<!--															 class="mb-3"-->
<!--															 value="tenant"-->
<!--															 plain-->
<!--													 >입주사 로그인-->
<!--													 </b-form-radio>-->
<!--												</div>-->
<!--										  </div>-->
										  <div class="p-2 mt-4">
<!--												<b-alert-->
<!--														v-model="isAuthError"-->
<!--														variant="danger"-->
<!--														class="mt-3"-->
<!--														dismissible-->
<!--												>{{ authError }}-->
<!--												</b-alert>-->

												<b-form-group
														id="input-group-1"
														label="아이디"
														label-for="input-1"
														class="mb-3"
												>
													 <b-form-input
															 id="input-1"
															 v-model="user_id"
															 type="text"
															 placeholder="아이디"
															 :class="{ 'is-invalid': submitted && $v.user_id.$error }"
															 @keydown.enter="tryToLogIn"
													 ></b-form-input>
													 <div
															 v-if="submitted && $v.user_id.$error"
															 class="invalid-feedback"
													 >
																<span v-if="!$v.user_id.required"
																>아이디를 입력해주세요.</span>
													 </div>
												</b-form-group>

												<b-form-group id="input-group-2"
																  label="비밀번호"
																  label-for="input-2"
																  class="mb-3">
													 <div class="float-end" v-if="false">
														  <nuxt-link
																  to="/account/forgot-password"
																  class="text-muted"
														  >비밀번호 찾기
														  </nuxt-link>
													 </div>
													 <b-form-input
															 id="input-2"
															 v-model="user_password"
															 type="password"
															 placeholder="비밀번호"
															 :class="{
																  'is-invalid': submitted && $v.user_password.$error
																}"
                                              @keydown.enter="tryToLogIn"
													 ></b-form-input>
													 <div
															 v-if="submitted && !$v.user_password.required"
															 class="invalid-feedback"
													 >
														  비밀번호를 입력해주세요.
													 </div>
												</b-form-group>
												<div class="mt-3 text-end">
													 <b-button type="button" variant="primary" class="w-sm" @click="tryToLogIn"
													 >로그인
													 </b-button>
												</div>
												<div class="mt-3 text-end">
<!--													 <nuxt-link to="/account/register_nott">비거주자 회원가입 하기</nuxt-link>-->
												</div>

												<div class="mt-5">
													 <h5>(주) 통합 어드민</h5>
<!--													 <div class="mb-2">-->
<!--													 대표자 : 김태성 <span class="d-none d-sm-inline">|</span> <br class="d-sm-none"/>-->
<!--													 사업자 등록번호 : 629-88-00018 <br/>-->
<!--													 주소 : 경기도 성남시 분당구 판교역로 152, 13층(백현동,알파돔 타워)-->
<!--														  <br/><br/>-->
<!--&lt;!&ndash;													 <div v-if="cs_phoneNumber" class="mb-2">&ndash;&gt;-->
<!--&lt;!&ndash;														  <span style="font-weight: bold">주차장 이용문의 : {{cs_phoneNumber}}</span>&ndash;&gt;-->
<!--&lt;!&ndash;													</div>&ndash;&gt;-->

<!--														  주차장 이용문의: 1811-8787-->
<!--													 </div>-->
													 © 2022 Kakao mobility.
												</div>

										  </div>
										  <!-- end card-body -->
									 </div>
									 <!-- end card -->
								</div>
								<!-- end row -->
						  </div>
						  <!-- end col -->
					 </div>
					 <!-- end row -->
				</div>
		  </div>
	 </div>
</template>

<style lang="scss" module></style>
