export const menuItems = [
  {
    id: 1,
    label: "입출차",
    icon: "fas fa-car",
    link: "/inout",
    subItems: [
      {
        id: 101,
        label: "입출차",
        link: "/inout/visits",
        parentId: 1
      },
      {
        id: 102,
        label: "미출차",
        link: "/inout/nocarout",
        parentId: 1
      },
      {
        id: 103,
        label: "미인식",
        link: "/inout/a",
        parentId: 1
      },
    ]
  },
  {
    id: 2,
    label: "정기권",
    icon: "fas fa-ticket-alt",
    link: "/passes",
    subItems: [
      {
        id: 201,
        label: "정기권",
        link: "/passes/list",
        parentId: 2
      },
      {
        id: 202,
        label: "정기권 유형",
        link: "/passes/form",
        parentId: 2
      },
      {
        id: 203,
        label: "정기권 속성 그룹",
        link: "/passes/groups",
        parentId: 2
      },
      {
        id: 204,
        label: "정기권 상품",
        link: "/passes/products",
        parentId: 2
      },
      {
        id: 205,
        label: "정기권 계정",
        link: "/passes/account",
        parentId: 2
      }
    ]
  },
  {
    id: 3,
    label: "할인",
    icon: "fas fa-percentage",
    link: "/discounts",
    subItems: [
      {
        id: 301,
        label: "할인",
        link: "/discounts/list",
        parentId: 3
      },
      {
        id: 301,
        label: "할인 유형",
        link: "/discounts/form",
        parentId: 3
      },
      {
        id: 301,
        label: "할인 속성 그룹",
        link: "/discounts/groups",
        parentId: 3
      },
      {
        id: 301,
        label: "할인 제한",
        link: "/discounts/limits",
        parentId: 3
      },
      {
        id: 301,
        label: "할인 상품",
        link: "/discounts/products",
        parentId: 3
      },
      {
        id: 301,
        label: "할인 계정",
        link: "/discounts/account",
        parentId: 3
      }
    ]
  },
  {
    id: 4,
    label: "입주사",
    icon: "fas fa-clipboard-list",
    link: "/tenants",
    subItems: [
      {
        id: 401,
        label: "입주사",
        link: "/tenants/list",
        parentId: 4
      },
      {
        id: 402,
        label: "입주사 사용자",
        link: "/tenants/resident",
        parentId: 4
      },
      {
        id: 403,
        label: "입주사 그룹",
        link: "/tenants/groups",
        parentId: 4
      },
      {
        id: 404,
        label: "비입주 사용자",
        link: "/tenants/noresident",
        parentId: 4
      },
      {
        id: 405,
        label: "정기권/할인 구매",
        link: "/tenants/orders",
        parentId: 4
      }
    ]
  },
  {
    id: 5,
    label: "통계",
    icon: "uil-chart-bar",
    link: "/statics",
    subItems: [
      {
        id: 501,
        label: "영업 일보",
        link: "/statics/a",
        parentId: 5
      },
      {
        id: 502,
        label: "결제",
        link: "/statics/payments",
        parentId: 5
      },
      {
        id: 503,
        label: "마감",
        link: "/statics/closings",
        parentId: 5
      }
    ]
  },
  {
    id: 6,
    label: "주차장 운영",
    icon: "fas fa-balance-scale",
    link: "/manage",
    subItems: [
      {
        id: 601,
        label: "요금제",
        link: "/manage/fee_plans",
        parentId: 6
      },
      {
        id: 602,
        label: "휴일",
        link: "/manage/holidays",
        parentId: 6
      },
      {
        id: 603,
        label: "등록 차량",
        link: "/manage/qualified_cars",
        parentId: 6
      },
      {
        id: 604,
        label: "등록 차량 유형",
        link: "/manage/qualifications",
        parentId: 6
      },
      {
        id: 605,
        label: "외부 서비스",
        link: "/manage/cooperations",
        parentId: 6
      }
    ]
  },
  {
    id: 7,
    label: "주차장 설정",
    icon: "fas fa-parking",
    link: "/parkinglot_setting",
    subItems: [
      {
        id: 701,
        label: "고객사",
        link: "/parkinglot_setting/clients",
        parentId: 7
      },
      {
        id: 702,
        label: "고객사 사용자",
        link: "/parkinglot_setting/users",
        parentId: 7
      },
      {
        id: 703,
        label: "사업장",
        link: "/parkinglot_setting/sites",
        parentId: 7
      },
      {
        id: 704,
        label: "주차장",
        link: "/parkinglot_setting/zones",
        parentId: 7
      },
      {
        id: 705,
        label: "주차장 그룹",
        link: "/parkinglot_setting/zones_groups",
        parentId: 7
      },
      {
        id: 706,
        label: "설비",
        link: "/parkinglot_setting/machines",
        parentId: 7
      },
      {
        id: 707,
        label: "설비 그룹",
        link: "/parkinglot_setting/machine_groups",
        parentId: 7
      },
      {
        id: 708,
        label: "설비 제어 내역",
        link: "/parkinglot_setting/a",
        parentId: 7
      }
    ]
  },
  {
    id: 8,
    label: "관리사",
    icon: "uil-home-alt",
    link: "/managers",
    subItems: [
      {
        id: 801,
        label: "관리사",
        link: "/managers/list",
        parentId: 8
      },
      {
        id: 802,
        label: "관리사 사용자",
        link: "/managers/users",
        parentId: 8
      }
    ]
  }
];




export const tenant = [
  {
    id: 1,
    label: "상품",
    icon: "fas fa-cart-plus",
    link: "/ut/shop",
    subItems: [
      {
        id: 101,
        label: "상품 구매",
        link: "/ut/shop",
        parentId: 1
      },
      {
        id: 102,
        label: "주문 내역",
        link: "/ut/shop/orders_tenant",
        parentId: 1
      },
      {
        id: 101,
        label: "결제 내역",
        link: "/ut/shop/payments_tenant",
        parentId: 1
      }
    ]
  },
  {
    id: 2,
    label: "할인 등록",
    icon: "fas fa-ticket-alt",
    link: "/ut/discounts/enroll"
  }
]


export const non_resident = [
  {
    id: 1,
    label: "상품",
    icon: "fas fa-cart-plus",
    link: "/ut/shop",
    subItems: [
      {
        id: 101,
        label: "상품 구매",
        link: "/ut/shop",
        parentId: 1
      },
      {
        id: 102,
        label: "주문 내역",
        link: "/ut/shop/orders_tenant",
        parentId: 1
      },
      {
        id: 101,
        label: "결제 내역",
        link: "/ut/shop/payments_tenant",
        parentId: 1
      }
    ]
  },
  // {
  //   id: 2,
  //   label: "정기권 관리",
  //   icon: "fas fa-ticket-alt",
  //   link: "/ut/u_passes",
  //   subItems: [
  //     {
  //       id: 201,
  //       label: "정기권 보유 현황",
  //       link: "/ut/u_passes/list",
  //       parentId: 2
  //     }
  //   ]
  // }
]


export default {
  menuItems
}
