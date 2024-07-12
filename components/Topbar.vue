<script>
import {mapState} from "vuex";

export default {
	 components: {

	 },
	 data() {
		  return {
				ENV_NAME: process.env.ENV_NAME,

		  };
	 },
	 mounted() {

	 },
	 destroyed() {

	 },
	 computed: mapState({
		  CurrentUser: state => state.auth.currentUser ? state.auth.currentUser : '',
	 }),

	 methods: {
		  async logoutUser() {

				try{
                let res = mainapi.invokeAPI('/api/v1/logout', {token: this.$store.getters['auth/getAccessToken']},'DELETE');

                // if(res.data.code !== $const.ApiSuccessCode.POST){
                //     throw res.data.msg;
                //     return false;
                // }

                this.$store.dispatch("auth/logOut");

                let loginPath = '';
                if(window.localStorage.getItem('loginType') === 'admin'){
                    loginPath = '/account/login';
                }else if(window.localStorage.getItem('loginType') === 'nott'){
                    loginPath = '/unt/login';
                }else if(window.localStorage.getItem('loginType') === 'tenant'){
                    loginPath = '/ut/login';
                }

                this.$router.push({
                    path: loginPath,
                });


            }catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert("로그 아웃에 실패하였습니다.<br/>" + tool_app.ErrorMsg(e));
            }finally {
                this.api_flag = false;
            }



		  },
		  toggleMenu() {
				this.$parent.toggleMenu();
		  },
		  onClick_dropDown() {
				if (this.$isMobile()) {
					 if (document.body.className.indexOf("sidebar-enable") >= 0) {
						  this.toggleMenu();
					 }
				}
		  }
	 },
};
</script>

<template>

	 <header id="page-topbar">
<!--		  <div class='parkingmove_iframe' id="parkingmove_iframe"-->
<!--				 style="width:0;height:0;opacity: 0;overflow: hidden"></div>-->
		  <div class="navbar-header">
				<div class="d-flex flex-row" style="align-items: center">
					 <!-- LOGO -->
					 <button @click="toggleMenu" type="button"
								class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
								id="vertical-menu-btn" style="vertical-align: middle">
						  <i class="fa fa-fw fa-bars"></i>
					 </button>
				</div>

				<div class="d-flex">


					 <b-dropdown class="d-inline-block" ref="dropdown-group-1" toggle-class="header-item" right
									 variant="white"
					 >
						  <template v-slot:button-content>
								<span class="user_ico" @click="onClick_dropDown">
									 <i class="fas fa-user"></i>
								</span>
								<span class="d-none d-xl-inline-block ms-1 fw-medium font-size-15">
									 {{
										  CurrentUser.name
									 }}님
								</span>
								<i class="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
						  </template>
						  <!-- item-->



              <a href="javascript: void(0);" class="dropdown-item" v-if="$store.getters['auth/currentUser'] && $store.getters['auth/currentUser'].CompanyType === 'TENANT'">
                <Modal_TenantDiscountsInfo type="header"/>
              </a>

						  <a class="dropdown-item" @click.prevent="$router.push('/account/mypage')" href="#">
								<i class="fas fa-user-circle font-size-18 align-middle text-muted me-1"></i>
								<span class="align-middle">내 정보</span>
						  </a>


						  <a class="dropdown-item" @click="logoutUser" href="javascript: void(0);">
								<i class="fas fa-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
								<span class="align-middle">로그아웃</span>
						  </a>
					 </b-dropdown>
				</div>
		  </div>
	 </header>
</template>
