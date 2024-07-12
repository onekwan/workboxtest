<script>
export default {
    components: {},
    props: {
        title: {
            type: String,
            default: '',
        },
		  right : ""
    },
}
</script>

<template>
<!-- start page title -->
<div class="row">
    <div class="col-12">
        <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="mb-0">{{ title }}</h4>
				<div v-if="right" class="page-title-right">
					 <nuxt-link v-show="right.type==='gotorist'" :to="right.path">
						  <span class="btn_top_go_list">
								<i class="uil uil-list-ul"></i>
						  목록
						  </span>
					 </nuxt-link>
				</div>
        </div>
    </div>
</div>
<!-- end page title -->
</template>

<style>
.btn_top_go_list{
	 padding:3px 8px;
	 display: inline-block;
	 margin: 3px 17px 0 0;
	 font-size:14px;
	 border:1px solid #888;
	 color:#888;
}
</style>
