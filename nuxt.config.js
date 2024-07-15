const { version } = require('./package.json');

export default {
    // loading: "~/components/loading.vue",
    /*
     ** Nuxt rendering mode
     ** See https://nuxtjs.org/api/configuration-mode
     */
    ssr: false,
    /*
     ** Nuxt target
     ** See https://nuxtjs.org/api/configuration-target
     */
    //target: "server",
    target: "static",
    /*
     ** Headers of the page
     ** See https://nuxtjs.org/api/configuration-head
     */
    head: {
        title: '알바트로스 서비스',
        meta: [
            {charset: "utf-8"},
            {
                name: "viewport",
                content: "width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            },
            {name: 'author', content: 'bono, leo'},
            {
                hid: "description",
                name: "description",
                content: "알바트로스 서비스입니다."
            },
            {'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate'},
            {"http-equiv": "Pragma", content: "no-cache"},
            {"http-equiv": "Expires", content: "0"}
        ],
        link: [
            {rel: "icon", type: "image/x-icon", href: "/favicon.ico"},
            {rel: "stylesheet", type: "text/css", href: "/sweetalert2/sweetalert2.css"}
        ],
        script: [
            {src: "/js/browsercheck.03.js?v=08"},
            {src: "/sweetalert2/sweetalert2.all.js"},
            {src: "/js/moment.js"},
            {src: "/js/metismenujs.js"},
            {src: "/js/lodash.js"},
            {src: '/js/html5_qrcode.js'},
            // {src: 'https://pay.nicepay.co.kr/v1/js/'},
            // {src: 'https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js'}
        ]
    },
    router: {
        mode: 'hash',
        base: "/",
        // linkExactActiveClass: 'active'
        extendRoutes(routes, resolve) {
            //상세 페이지
            routes.push({
                name: 'visits_detail',
                path: '/inout/visits/:id',
                component: resolve(__dirname, 'pages/inout/visits/detail.vue')
            });
            routes.push({
                name: 'passes_products_detail',
                path: '/passes/products/:id',
                component: resolve(__dirname, 'pages/passes/products/detail.vue')
            });
            routes.push({
                name: 'discounts_products_detail',
                path: '/discounts/products/:id',
                component: resolve(__dirname, 'pages/discounts/products/detail.vue')
            });
            routes.push({
                name: 'pass_account_detail',
                path: '/passes/account/:id',
                component: resolve(__dirname, 'pages/passes/account/detail.vue')
            });

            routes.push({
                name: 'discount_pass_account_detail',
                path: '/discounts/account/:id',
                component: resolve(__dirname, 'pages/discounts/account/detail.vue')
            });

            //관리사 detail
            routes.push({
                name: 'managers_list_detail',
                path: '/managers/list/:id',
                component: resolve(__dirname, 'pages/managers/list/detail.vue')
            });
            //고객사 detail
            routes.push({
                name: 'parkinglot_setting_clients_detail',
                path: '/parkinglot_setting/clients/:id',
                component: resolve(__dirname, 'pages/parkinglot_setting/clients/detail.vue')
            });
            //입주사 detail
            routes.push({
                name: 'tenants_list_detail',
                path: '/tenants/list/:id',
                component: resolve(__dirname, 'pages/tenants/list/detail.vue')
            })
            //입주사그룹 detail
            routes.push({
                name: 'tenants_groups_detail',
                path: '/tenants/groups/:id',
                component: resolve(__dirname, 'pages/tenants/groups/detail.vue')
            });
            //주차사업장 상세 detail
            routes.push({
                name: 'parkinglot_setting_sites_detail',
                path: '/parkinglot_setting/sites/:id',
                component: resolve(__dirname, 'pages/parkinglot_setting/sites/detail.vue')
            });
            //주차장 상세 detail
            routes.push({
                name: 'parkinglot_setting_zones_detail',
                path: '/parkinglot_setting/zones/:id',
                component: resolve(__dirname, 'pages/parkinglot_setting/zones/detail.vue')
            });
            //주차장 그룹 상세 detail
            routes.push({
                name: 'parkinglot_setting_zones_groups_detail',
                path: '/parkinglot_setting/zones_groups/:id',
                component: resolve(__dirname, 'pages/parkinglot_setting/zones_groups/detail.vue')
            });
            //설비 상세 detail
            routes.push({
                name: 'parkinglot_setting_machines_detail',
                path: '/parkinglot_setting/machines/:id',
                component: resolve(__dirname, 'pages/parkinglot_setting/machines/detail.vue')
            });
            //설비 그룹 상세 detail
            routes.push({
                name: 'parkinglot_setting_machine_groups_detail',
                path: '/parkinglot_setting/machine_groups/:id',
                component: resolve(__dirname, 'pages/parkinglot_setting/machine_groups/detail.vue')
            });
            //정기권 상세 detail
            routes.push({
                name: 'passes_list_detail',
                path: '/passes/list/:id',
                component: resolve(__dirname, 'pages/passes/list/detail.vue')
            });
            //정기권 유형 상세 detail
            routes.push({
                name: 'passes_form_detail',
                path: '/passes/form/:id',
                component: resolve(__dirname, 'pages/passes/form/detail.vue')
            });
            //정기권 그룹 상세 detail
            routes.push({
                name: 'passes_groups_detail',
                path: '/passes/groups/:id',
                component: resolve(__dirname, 'pages/passes/groups/detail.vue')
            });
            //할인유형 상세 detail
            routes.push({
                name: 'discounts_form_detail',
                path: '/discounts/form/:id',
                component: resolve(__dirname, 'pages/discounts/form/detail.vue')
            });
            //할인속성 그룹 상세 detail
            routes.push({
                name: 'discounts_groups_detail',
                path: '/discounts/groups/:id',
                component: resolve(__dirname, 'pages/discounts/groups/detail.vue')
            });
            //주문 내역 (입주사와 어드민이 공동으로 vue 페이지 사용)
            routes.push({
                name: 'tenant_order_list',
                path: '/ut/shop/orders_:type',
                component: resolve(__dirname, 'pages/tenants/orders/index.vue')
            });
            routes.push({
                name: 'tenant_order_detail',
                path: '/ut/shop/orders_tenant/:id',
                component: resolve(__dirname, 'pages/tenants/orders/detail.vue')
            });
            routes.push({
                name: 'order_detail',
                path: '/tenants/orders/:id',
                component: resolve(__dirname, 'pages/tenants/orders/detail.vue')
            });
            //결제 내역 (입주사와 어드민이 공동으로 vue 페이지 사용)
            routes.push({
                name: 'tenant_payment_list',
                path: '/ut/shop/payments_:type',
                component: resolve(__dirname, 'pages/statics/payments/index.vue')
            });
            routes.push({
                name: 'tenant_payment_detail',
                path: '/ut/shop/payments_tenant/:id',
                component: resolve(__dirname, 'pages/statics/payments/detail.vue')
            });
            routes.push({
                name: 'payment_detail',
                path: '/statics/payments/:id',
                component: resolve(__dirname, 'pages/statics/payments/detail.vue')
            });

            //유저 페이지 공통 (관리자/ 고객사 사용자/ 비거주자/입주자)
            routes.push({
                name: 'client_users_list',
                path: '/parkinglot_setting/users',
                component: resolve(__dirname, 'pages/users/index.vue')
            });
            routes.push({
                name: 'client_users_detail',
                path: '/parkinglot_setting/users/:id',
                component: resolve(__dirname, 'pages/users/detail.vue')
            });
            routes.push({
                name: 'managers_users_list',
                path: '/managers/users',
                component: resolve(__dirname, 'pages/users/index.vue')
            });
            routes.push({
                name: 'managers_users_detail',
                path: '/managers/users/:id',
                component: resolve(__dirname, 'pages/users/detail.vue')
            });
            routes.push({
                name: 'tenants_resident_list',
                path: '/tenants/resident',
                component: resolve(__dirname, 'pages/users/index.vue')
            });
            routes.push({
                name: 'tenants_resident_detail',
                path: '/tenants/resident/:id',
                component: resolve(__dirname, 'pages/users/detail.vue')
            });
            routes.push({
                name: 'tenants_noresident_list',
                path: '/tenants/noresident',
                component: resolve(__dirname, 'pages/users/index.vue')
            });
            routes.push({
                name: 'tenants_noresident_detail',
                path: '/tenants/noresident/:id',
                component: resolve(__dirname, 'pages/users/detail.vue')
            });

            //할인 상세 detail
            routes.push({
                name: 'discount_list_detail',
                path: '/discounts/list/:id',
                component: resolve(__dirname, 'pages/discounts/list/detail.vue')
            })

            //결제 완료
            routes.push({
                name: 'discount_list_detail',
                path: '/ut/shop/complete/:id',
                component: resolve(__dirname, 'pages/ut/shop/complete.vue')
            })


            //미출차 페이지
            routes.push({
                name: 'nocarout_list',
                path: '/inout/nocarout',
                component: resolve(__dirname, 'pages/inout/visits/index.vue')
            })
        }
    },
    /*
     ** Global CSS
     */
    css: [
        "~/assets/scss/app.scss"
    ],
    /*
     ** Plugins to load before mounting the App
     ** https://nuxtjs.org/guide/plugins
     */
    plugins: [
        "~/plugins/main/const_variables.js",
        //'~/plugins/i18n.js',
        "~/plugins/simplebar.js",
        "~/plugins/vue-click-outside.js",
        "~/plugins/vue-apexcharts.js",
        "~/plugins/vuelidate.js",
        "~/plugins/vue-slidebar.js",
        "~/plugins/vue-lightbox.js",
        "~/plugins/vue-chartist.js",
        "~/plugins/vue-mask.js",
        "~/plugins/vue-mobile-detection.js",
        "~/plugins/vue-googlemap.js",
        "~/plugins/filters.js",
        "~/plugins/main/tool_app.js",
        "~/plugins/main/mainapi.js",
        "~/plugins/vue_globalFunction.js",
        "~/plugins/vue-datepicker.js",
        "~/plugins/component-plugin.js",
        '~/plugins/registerServiceWorker.js'
    ],
    /*
     ** Auto import components
     ** See https://nuxtjs.org/api/configuration-components
     */
    components: true,
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://bootstrap-vue.js.org
        "bootstrap-vue/nuxt"
        // Doc: https://github.com/nuxt/content
        //"@nuxt/content"
    ],

    /*
     ** Content module configuration
     ** See https://content.nuxtjs.org/configuration
     */
    content: {},
    /*
     ** Build configuration
     ** See https://nuxtjs.org/api/configuration-build/
     */
    build: {
        extractCSS: true,
        vendor: ['axios'],
        filenames: {
            css: "[name].css",
            app: "app.js",
            chunk: "app_chunk[name].js"
        },
        optimization: {
            splitChunks: {
                chunks: 'async'
            }
        },
        splitChunks: {
            pages: false,
            vendor: false,
            commons: false,
            runtime: false,
            layouts: false
        }
    },
    env: {
        auth: process.env.VUE_APP_DEFAULT_AUTH,
        apikey: process.env.VUE_APP_APIKEY,
        authdomain: process.env.VUE_APP_AUTHDOMAIN,
        databaseurl: process.env.VUE_APP_DATABASEURL,
        projectid: process.env.VUE_APP_PROJECTId,
        storgebucket: process.env.VUE_APP_STORAGEBUCKET,
        message: process.env.VUE_APP_MESSAGINGSENDERID,
        appid: process.env.VUE_APP_APPId,
        measurement: process.env.VUE_APP_MEASUREMENTID,
        ENV_NAME: process.env.ENV_NAME,
        version : process.env.ENV_NAME ==='prod' ? process.env.npm_package_prod_version : process.env.npm_package_dev_version
    }
};
