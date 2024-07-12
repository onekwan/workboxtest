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
            api_data: {
                "username": "",
                "name": "",
                "phone": "",
                "password": ""
            },
              confirm_password: '',
            submitted: false,
            authError: null,
            tryingToRegister: false,
            isAuthError: false,
            selectedDefault: 'admin',
            login_flag: false
        };
    },
    validations: {
        api_data: {
            username: {
                required
            },
            name: {
                required
            },
            phone: {
                required
            },
            password: {
                required
            }
        },
          confirm_password: {
            required
        }
    },
    created() {
        let vm = this;
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
        async tryToRegister() {
            let vm = this;
            if (vm.tryingToRegister) return false;

            vm.submitted = true;
            vm.tryingToRegister = true;
            // stop here if form is invalid
            this.$v.$touch();

            if (this.$v.$invalid) {
                vm.tryingToRegister = false;
                return;
            } else {
                try {
                    let payload = this.api_data;

                      if (this.api_data.password !== this.confirm_password) {
                            tool_app.dialog_alert("비밀번호 확인이 일치하지 않습니다.");
                            vm.tryingToRegister = false;
                            vm.isAuthError = false;
                            return;
                      }


                    let res = await mainapi.invokeAPI('/api/v1/users/non-resident',payload,"POST");

                    if (res.data.code !== $const.ApiSuccessCode.POST) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg);
                        vm.tryingToRegister = false;
                        vm.isAuthError = true;
                        return false;
                    } else {

                        vm.tryingToRegister = false;
                        vm.isAuthError = false;
                        tool_app.dialog_success('회원가입이 완료되었습니다.<br/> 로그인 해주세요.')
                        vm.$router.push({
                              path: "/unt/login"
                        });
                    }
                } catch (e) {

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
                                          <div class="auth_loading" v-show="tryingToRegister">
                                                <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
                                          </div>

                                          <div class="card-body p-4">
                                                <div class="p-2">
                                                      <h2 class="text-center font-size-24">일반 회원 가입</h2>


                                                      <label class="mt-3 mb-2 required">아이디</label>
                                                      <input type="text" class="form-control" v-model="api_data.username" :class="{ 'is-invalid': submitted && $v.api_data.username.$error }"/>
                                                      <div
                                                            v-if="submitted && $v.api_data.username.$error"
                                                            class="invalid-feedback"
                                                      >
                                                            <span v-if="!$v.api_data.username.required">아이디를 입력해주세요.</span>
                                                      </div>




                                                      <b-form-group id="input-group-2"
                                                                    label="비밀번호"
                                                                    label-for="input-2"
                                                                    class="mb-3">
                                                            <b-form-input
                                                                    id="input-2"
                                                                    v-model="api_data.password"
                                                                    type="password"
                                                                    placeholder="비밀번호"
                                                                    :class="{
																  'is-invalid': submitted && $v.api_data.password.$error
																}"
                                                            ></b-form-input>
                                                            <div
                                                                    v-if="submitted && !$v.api_data.password.required"
                                                                    class="invalid-feedback"
                                                            >
                                                                  비밀번호를 입력해주세요.
                                                            </div>
                                                      </b-form-group>

                                                      <b-form-group id="input-group-2"
                                                                    label="비밀번호 확인"
                                                                    label-for="input-2"
                                                                    class="mb-3">
                                                            <b-form-input
                                                                  id="input-2"
                                                                  v-model="confirm_password"
                                                                  type="password"
                                                                  placeholder="비밀번호 확인"
                                                                  :class="{
																  'is-invalid': submitted && $v.confirm_password.$error
																}"
                                                            ></b-form-input>
                                                            <div
                                                                  v-if="submitted && !$v.confirm_password.required"
                                                                  class="invalid-feedback"
                                                            >
                                                                  비밀번호 확인을 입력해주세요.
                                                            </div>
                                                      </b-form-group>

                                                      <b-form-group id="input-group-2"
                                                                    label="이름"
                                                                    label-for="input-2"
                                                                    class="mb-3">
                                                            <b-form-input
                                                                    id="input-2"
                                                                    v-model="api_data.name"
                                                                    type="text"
                                                                    placeholder="이름"
                                                                    :class="{
																  'is-invalid': submitted && $v.api_data.name.$error
																}"
                                                            ></b-form-input>
                                                            <div
                                                                    v-if="submitted && !$v.api_data.name.required"
                                                                    class="invalid-feedback"
                                                            >
                                                                  이름을 입력해주세요.
                                                            </div>
                                                      </b-form-group>
                                                      <b-form-group id="input-group-2"
                                                                    label="전화번호"
                                                                    label-for="input-2"
                                                                    class="mb-3">
                                                            <b-form-input
                                                                    id="input-2"
                                                                    v-model="api_data.phone"
                                                                    type="text"
                                                                    placeholder="전화번호"
                                                                    :class="{'is-invalid': submitted && $v.api_data.phone.$error}"
                                                                    v-mask="'############################'"
                                                            ></b-form-input>
                                                            <div
                                                                    v-if="submitted && !$v.api_data.phone.required"
                                                                    class="invalid-feedback"
                                                            >
                                                                  전화번호를 입력해주세요.
                                                            </div>
                                                      </b-form-group>
                                                      <div class="mt-3 text-end">
                                                            <b-button type="button" variant="primary" class="w-sm"
                                                                      @click="tryToRegister"
                                                            >회원가입 하기
                                                            </b-button>
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

<style>


</style>
