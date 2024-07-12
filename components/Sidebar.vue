<script>


import {
    mapState, mapGetters
} from "vuex";

import {
    menuItems, non_resident,tenant
} from "./menu";

export default {
    data() {
        return {
            menuItems: null,
              userType : null,
              companyType : null,
              titleUser : true
        };
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        width: {
            type: String,
            required: true,
        },
    },
    created() {
        if (this.$isMobile()) {
            document.body.classList.add("isMobile");
        }
        this.userType = this.$store.state.auth.currentUser.type;
        this.companyType = this.$store.getters["auth/getCompanyType"];
        if (this.companyType === null && this.userType === "NONE") {
            this.menuItems = non_resident;
        } else if (this.companyType === "DEVELOPER" || this.companyType === "OPERATOR" || this.companyType === "MAINTAINER") {
            this.menuItems = menuItems;
            this.titleUser = false;
        }else if (this.companyType === "TENANT") {
              this.menuItems = tenant;
        }
    },
    watch: {
        type: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    switch (newVal) {
                        case "dark":
                            document.body.setAttribute("data-sidebar", "dark");
                            document.body.removeAttribute("data-topbar");
                            document.body.removeAttribute("data-sidebar-size");
                            break;
                        case "light":
                            document.body.removeAttribute("data-sidebar");
                            document.body.removeAttribute("data-sidebar-size");
                            document.body.classList.remove("vertical-collpsed");
                            break;
                        case "compact":
                            document.body.setAttribute("data-sidebar-size", "small");
                            document.body.setAttribute("data-sidebar", "dark");
                            document.body.classList.remove("vertical-collpsed");
                            document.body.removeAttribute("data-topbar", "dark");
                            break;
                        case "icon":
                            document.body.setAttribute("data-keep-enlarged", "true");
                            document.body.classList.add("vertical-collpsed");
                            document.body.setAttribute("data-sidebar", "dark");
                            document.body.removeAttribute("data-topbar", "dark");
                            break;
                        case "colored":
                            document.body.setAttribute("data-sidebar", "colored");
                            document.body.removeAttribute("data-keep-enlarged");
                            document.body.classList.remove("vertical-collpsed");
                            document.body.removeAttribute("data-sidebar-size");
                            break;
                        default:
                            document.body.setAttribute("data-sidebar", "dark");
                            break;
                    }
                }
            },
        },
        width: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    switch (newVal) {
                        case "boxed":
                            document.body.setAttribute("data-layout-size", "boxed");
                            break;
                        case "fluid":
                            document.body.setAttribute("data-layout-mode", "fluid");
                            document.body.removeAttribute("data-layout-size");
                            break;
                        default:
                            document.body.setAttribute("data-layout-mode", "fluid");
                            break;
                    }
                }
            },
        },
    },
    mounted: function () {
        let vm = this;
        // eslint-disable-next-line no-unused-vars
        var menuRef = new MetisMenu("#side-menu", {
            toggle: false
        });
        this._activateMenuDropdown();

        this.$router.afterEach((routeTo, routeFrom) => {
            this._activateMenuDropdown();
        });
    },
    methods: {
        /**
         * Toggle menu
         */
        toggleMenu() {

            this.$parent.toggleMenu();
        },
        /**
         * Returns true or false if given menu item has child or not
         * @param item menuItem
         */
        hasItems(item) {
            return item.subItems !== undefined ? item.subItems.length > 0 : false;
        },
        /**
         * remove active and mm-active class
         */
        _removeAllClass(className) {
            const els = document.getElementsByClassName(className);
            // while (els[0]) {
            // 	 els[0].classList.remove(className);
            // }

            const els2 = document.getElementsByClassName('active side-nav-link-ref');// 2depth 메뉴 활성화


            if (!this.$isMobile()) {
                const els4 = document.getElementsByClassName('nuxt-link-active side-nav-link-ref')// 2depth 메뉴 활성화
                const els3 = document.getElementsByClassName('mm-active');//1depth 메뉴 활성화
                for (let i = 0; i < els3.length; i++) {
                    els3[i].classList.remove('mm-active');
                }

                for (let i = 0; i < els4.length; i++) {
                    els4[i].classList.remove('nuxt-link-active');
                }
            }


            for (let i = 0; i < els2.length; i++) {
                els2[i].classList.remove('active');
            }


            for (let i = 0; i < els.length; i++) {
                els[i].classList.remove(className);
            }


        },
        _activateMenuDropdown() {
            this._removeAllClass("mm-active");
            //this._removeAllClass("mm-show");

            var links = document.getElementsByClassName("side-nav-link-ref");
            var matchingMenuItem = null;
            const paths = [];


            for (let i = 0; i < links.length; i++) {
                paths.push("#" + links[i].dataset.path);
            }

            let itemIndex = -1;
            paths.forEach(function (value, index, arr) {
                if (window.location.hash.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                    itemIndex = index;
                }
            })
            //itemIndex = paths.indexOf(window.location.hash);

            if (itemIndex === -1) {
                // const strIndex = window.location.hash.lastIndexOf("/");
                // const item = window.location.hash.substr(0, strIndex).toString();
                // matchingMenuItem = links[paths.indexOf(item)];
                matchingMenuItem = links[this.Menu_beforeIDX];
            } else {
                matchingMenuItem = links[itemIndex];
                this.Menu_beforeIDX = itemIndex
            }


            if (matchingMenuItem) {
                matchingMenuItem.classList.add("active");
                let parent = matchingMenuItem.parentElement;

                if (parent) {
                    parent.classList.add("mm-active");
                    const parent2 = parent.parentElement.closest("ul");
                    if (parent2 && parent2.id !== "side-menu") {
                        parent2.classList.add("mm-show");

                        const parent3 = parent2.parentElement;
                        if (parent3) {
                            parent3.classList.add("mm-active");
                            parent3.classList.add("mm-open");
                            var childAnchor = parent3.querySelector(".has-arrow");
                            var childDropdown = parent3.querySelector(".has-dropdown");
                            if (childAnchor) childAnchor.classList.add("mm-active");
                            if (childDropdown) childDropdown.classList.add("mm-active");

                            const parent4 = parent3.parentElement;
                            if (parent4 && parent4.id !== "side-menu") {
                                parent4.classList.add("mm-show");
                                const parent5 = parent4.parentElement;
                                if (parent5 && parent5.id !== "side-menu") {
                                    parent5.classList.add("mm-active");
                                    const childanchor = parent5.querySelector(".is-parent");
                                    if (childanchor && parent5.id !== "side-menu") {
                                        childanchor.classList.add("mm-active");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        closeMenuMobile() {
            if (this.$isMobile()) {
                this._removeAllClass();
                this.toggleMenu();
            }
        }
    },
};
</script>

<template>
	 <!-- ========== Left Sidebar Start ========== -->
      <div class="vertical-menu">
            <!-- LOGO -->
            <div class="navbar-brand-box">
                  <nuxt-link to="/" class="logo logo-dark">
            <span class="logo-sm">
                <img src="~/assets/svg/t_logo.svg" alt height="22"/>
            </span>
                        <span class="logo-lg">
                <img src="~/assets/svg/t_logo.svg" alt height="20"/>
            </span>
                  </nuxt-link>

                  <div to="/" class="logo logo-light">
					 <span class="logo-sm">
						  <img src="~/assets/svg/t_logo.svg" alt height="22"/>
					 </span>
                        <div class="logo-lg">
                              <nuxt-link to="/" class="logo logo-light sidebar_logo_custom">
                                    <span v-if="!titleUser">
                                          알바트로스 통합 관제
                                    </span>
                                    <span v-else>
                                          알바트로스 서비스
                                    </span>
                              </nuxt-link>
                              <select v-if="false" class="form-select" aria-label="Default select example">
                                    <option selected>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                              </select>
                        </div>
                  </div>
            </div>

            <!--		  <button type="button" @click="toggleMenu" class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn">-->
            <!--				<i class="fa fa-fw fa-bars"></i>-->
            <!--		  </button>-->

            <div data-simplebar class="sidebar-menu-scroll">
                  <!--- Sidemenu -->
                  <div id="sidebar-menu">
                        <!-- Left Menu Start -->
                        <ul class="metismenu list-unstyled" id="side-menu">
                              <template v-for="item in menuItems">
                                    <li class="menu-title" v-if="item.isTitle" :key="item.id">{{ item.label }}</li>
                                    <li :key="item.id">
                                          <nuxt-link :to="item.link" v-if="!hasItems(item)" :data-path="item.link"
                                                     class="side-nav-link-ref" @click.native="closeMenuMobile">
                                                <i class='menu_i' :class="`${item.icon}`" v-if="item.icon"></i>
                                                <span>{{ item.label }}</span>
                                                <span :class="
                    `badge badge-pill badge-${item.badge.variant} float-end`
                  " v-if="item.badge">{{ item.badge.text }}</span>
                                          </nuxt-link>

                                          <a v-if="hasItems(item)" href="javascript:void(0);" class="is-parent" :class="{
                  'has-arrow': !item.badge,
                  'has-dropdown': item.badge
                }">
                                                <i class='menu_i' :class="`${item.icon}`" v-if="item.icon"></i>
                                                <span>{{ item.label }}</span>
                                                <span :class="
                    `badge badge-pill badge-${item.badge.variant} float-end`
                  " v-if="item.badge">{{ item.badge.text }}</span>
                                          </a>
                                          <ul v-if="hasItems(item)" class="sub-menu" aria-expanded="false">
                                                <template v-for="(subitem, index) of item.subItems">
                                                      <li :key="index">
                                                            <nuxt-link :to="subitem.link" v-if="!hasItems(subitem)"
                                                                       :data-path="subitem.link"
                                                                       class="side-nav-link-ref"
                                                                       :class="{'compression_word' : subitem.label.length>12}"
                                                                       @click.native="closeMenuMobile"
                                                            >
                                                                  {{ subitem.label }}
                                                            </nuxt-link>
                                                            <a v-if="hasItems(subitem)"
                                                               class="side-nav-link-a-ref has-arrow"
                                                               href="javascript:void(0);">{{ subitem.label }}</a>
                                                            <ul v-if="hasItems(subitem)" class="sub-menu mm-collapse"
                                                                aria-expanded="false">
                                                                  <li v-for="(subSubitem, index) of subitem.subItems"
                                                                      :key="index">
                                                                        <nuxt-link :to="subSubitem.link"
                                                                                   :data-path="subSubitem.link"
                                                                                   class="side-nav-link-ref">
                                                                              {{ subSubitem.label }}
                                                                        </nuxt-link>
                                                                  </li>
                                                            </ul>
                                                      </li>
                                                </template>
                                          </ul>
                                    </li>
                              </template>
                        </ul>
                        <!--					 <div class="mt-3" v-if="this.userType==='HEAD' || this.userType==='FACILITY'">-->
                        <!--						  <b-row>-->
                        <!--								<b-col offset="1" cols="10">-->
                        <!--									 <button class="btn btn-success w-100 flexBtn" @click="openNewTab('https://lpr-api-dev.kakaopark.net/apidoc/lpr.html')">API 문서</button>-->
                        <!--								</b-col>-->
                        <!--								<b-col offset="1" cols="10" class="mt-3">-->
                        <!--									 <button class="btn btn-warning w-100 flexBtn" @click="onClick_downKpse">KPSE 설치파일 다운로드</button>-->
                        <!--								</b-col>-->
                        <!--						  </b-row>-->
                        <!--					 </div>-->

                  </div>

                  <!-- Sidebar -->
            </div>

      </div>
	 <!-- Left Sidebar End -->
</template>


<style scoped>
@import url('https://unicons.iconscout.com/release/v3.0.0/css/line.css');

.sidebar_logo_custom {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
}

.sidebar-menu-scroll {
    margin-top: 66px;
}
</style>
