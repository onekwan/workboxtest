<script>

export default {
	 data() {
		  return {
				version: process.env.version,
				ENV_NAME : process.env.ENV_NAME,
				companyName : '(주) 파킹어때'
		  }
	 },
	 mounted() {

	 }
};
</script>

<template>
	 <footer class="footer">
		  <div class="container-fluid">
				<div class="row">
					 <div class="col-12">
						  <b-row>
								<b-col cols="6" class="d-none d-md-grid">
									 <h6>{{companyName}}</h6>
								</b-col>
								<b-col cols="12" md="6" class="text-right">
<!--									 <NuxtLink :to="'/terms/privacy/1'" target="_blank" class="text-reset">개인정보처리방침</NuxtLink>-->
									 <a href="#" target="_blank" class="text-reset">개인정보처리방침</a>
									  |
									 <NuxtLink :to="'#'" target="_blank" class="text-reset">이용약관</NuxtLink>
								</b-col>
								<b-col cols="12" md="6" class="d-md-none">
									 &nbsp;
								</b-col>
								<b-col cols="12" md="6" class="d-md-none">
									 <h6>{{companyName}}</h6>
								</b-col>
						  </b-row>
						  <p>
								대표자 : 장원영 <span class="d-none d-sm-inline">|</span> <br class="d-sm-none"/>
								사업자 등록번호 : 111-22-33333 <br/>
								주소 : 경기도 성남시 분당구 판교역로 152, 13층(백현동,알파돔 타워) <br/>
								주차장 이용 문의 : 1111-2222
						  </p>
						  <b-row>
								<b-col cols="12" sm="6">
									 © 2022 Kakao mobility.
								</b-col>
								<b-col cols="12" sm="6" class="text-right">
									 <span class="text-muted">ver {{ version }}</span>
								</b-col>
						  </b-row>
					 </div>
				</div>
		  </div>
	 </footer>
</template>
