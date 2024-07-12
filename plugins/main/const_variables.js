if (!window.$const) {
    window.$const = {
        ApiSuccessCode: {
            GET: 200000,
            POST: 201000,
            PUT: 200700,
            PATCH: 200700,
            DELETE: 200900
        },
        TIME: {
            SEC: 1000,
            MIN: 60 * 1000,
            HOUR: 60 * 60 * 1000,
            DAY: 24 * 60 * 60 * 1000,
        },
        Timeline00: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        WEEK: ["월요일", "화요일", "수요일", "목요일", "금토일", "토요일", "일요일"],

        WEEK_3_e: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],

        WEEK_3etok: {"mon": '월', "tue": '화', "wed": '수', "thu": '목', "fri": '금', "sat": '토', "sun": '일'},

        week: ["월", "화", "수", "목", "금", "토", "일"],

        WEEK_E: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],

        WEEK_EtoK: {
            'MONDAY': '월요일',
            'TUESDAY': '화요일',
            'WEDNESDAY': '수요일',
            'THURSDAY': '목요일',
            'FRIDAY': '금요일',
            'SATURDAY': '토요일',
            'SUNDAY': '일요일'
        },

        week_sun: ["일", "월", "화", "수", "목", "금", "토"],

        whenExitOnNoOperation: {
            NORMAL: '결제하고 출차',
            FREE: '무료 출차',
            POSTPAY: '후불 출차'
        },

        machineType: {
            'GATE_IN': '입구',
            'GATE_OUT': '출구',
            'PAY_IN': '입구 무인 정산기',
            'PAY_OUT': '출구 무인 정산기',
            'PAY_ON': '사전(주차중) 무인 정산기',
            'CASHIER_IN': '입구 유인 정산기',
            'CASHIER_OUT': '출구 유인 정산기',
            'SINAGE': '전광판',
            'OFFICE': '관리소에서 VAN으로 결제',
            'WEB': '웹에서 PG로 결제'
        },

        machineStatus: {
            UNUSED: '사용 안함',
            NORMAL: '정상(대기)',
            DEFECT: '장애',
            OFFLINE: '연결 끊김',
            BOOT: '재실행 중',
            OPEN: '열림중',
            OPEN_FIX: '열림(고정)',
            CLOSE: '닫힘중',
            CLOSE_FIX: '닫힘(고정)',
            INSERT: '카드 인입중 ',
            PAY: '결제중',
            CANCEL: '취소중',
            EJECT: '카드 배출중',
            PRINT: '인쇄 중',
            NO_PAPER: '용지 부족(없음)'
        },

        passType: {
            ALWAYS: '무제한권',
            MONTHLY: '월정기권',
            DAILY: '일일권',
            TIMELY: '기간권'
        },

        passStatus: {
            READY: '적용 전',
            AVAILABLE: '사용 중',
            UNAVAILABLE: '사용 정지',
            EXPIRED: '사용 만료',
            DISCARD: '폐기'
        },

        passOrigin: {
            FREE: '무상 제공',
            DIRECT: '직접 구매',
            MALL: '상품 구매'
        },

        passAutoRefill: {
            MONTHLY: '매월 1일 자정 자동 충전. 이전 값은 삭제',
            MONTHLY2: '매월 1일 자정 자동 충전. 이전 값도 이월',
            NONE: '자동 충전 없음'
        },


        userType: {
            NONE: '타입 없음',
            MASTER: '마스터',
            STAFF1: '스태프 1',
            STAFF2: '스태프 2'
        },
        userType_create: {
            STAFF1: '스태프 1',
            STAFF2: '스태프 2'
        },

        managerType: {
            DEVELOPER: '개발사',
            OPERATOR: '운영사',
            MAINTAINER: '유지보수사'
        },

        companyType: {
            NONE: '타입 없음',
            DEVELOPER: '개발사',
            OPERATOR: '운영사',
            MAINTAINER: '유지보수사',
            CLIENT: '고객사',
            TENANT: '입주사'
        },

        clientStatus: {
            READY: '적용 전',
            STANDBY: '준비',
            OPERATING: '운영 중',
            DISCARD: '폐기'
        },

        productType: {
            'PASS': '정기권 상품',
            'DISCOUNT': '할인 상품'
        },

        payMethods: {
            CARD: '신용/체크카드',
            CASH: '현금',
            BANK: '계좌 이체',
            VBANK: '가상계좌 결제',
            KAKAOT: '카카오 T결제',
            UNPAYED: '미납'
        },

        payType: {
            VAN: '밴사',
            PG: 'PG사',
            KAKAOT: '카카오 T결제'
        },

        siteHealthStatus: {
            UNUSED: '사용 안 함',
            NORMAL: '정상',
            OFFLINE: '연결 끊김',
        },

        siteStatus: {
            READY : '적용 전',
            STANDBY : '준비',
            OPERATING : '운영중',
            DISCARD : '운영 중지'
        },

        zoneStatus: {
            READY : '적용 전',
            STANDBY : '준비',
            OPERATING : '운영중',
            DISCARD : '운영 중지'
        },


        visitType: {
            NORMAL: '일반',
            RESERVED: '예약',
            QUICK_OUT: '회차',
            DENIED: '입차 거부',
            EMERGENCY: '긴급 차량',
            COMMERCIAL: '영업용 차량'
        },

        visitStatus: {
            ENTERED: '입차',
            PRE_PAYED: '사전 무인 결제',
            OTHER_PAYED: '다른 서비스에서 결제',
            OTHER_PAYED2: '다른 서비스에서 추가 요금 발생',
            EXITED: '출차'
        },

        visitEnterType: {
            NORMAL: '일반',
            MANUAL: '수동. Eagle에서 이루어짐.',
            MANUAL2: '수동. Albatross에서 이루어짐.'
        },

        visitExitType: {
            NORMAL: '일반',
            MANUAL: '수동. Eagle에서 이루어짐.',
            MANUAL2: '수동. Albatross에서 이루어짐.'
        },

        imageType: {
            front: '입구 전면',
            rear: '입구 후면',
            left: '입구 좌측',
            right: '입구 우측',
            out: '출구'
        },

        passAccountType: {
            REFILL: '자동 충전',
            DEPOSIT: '적립',
            WITHDRAW: '인출',
            REVOKE: '회수',
            CANCEL: '취소'
        },

        discountType: {
            COUPON: '쿠폰형',
            POINTS: '포인트형',
        },

        discountSector: {
            PUBLIC: '공공',
            PRIVATE: '민간',
        },

        discountMethod: {
            TIME: '시간 할인',
            AMOUNT: '정액 할인',
            AMOUNT2: '시간 할인 후 정액 할인',
            RATE: '정률 할인',
            RATE2: '시간 할인 후 정률 할인',
            FIXED: '요금 고정',
            KEYS: '할인 내용을 `keys`에서 정의',
            NONE: '할인 하지 않고 표식으로서만 기능',
        },

        discountMatchingType: {
            'BARCODE': '바코드',
            'QRCODE': 'QR코드',
            'OCS': '환자번호(암호화)',
            'MEMBERSHIP': '회원번호(암호화)',
            'SPENDING': '구매액'
        },

        //방문 계정 상세
        visitAccountType: {
            RECENT: 'RECENT',
            SEALED: 'SEALED',
            DISCARDED: 'DISCARDED'
        },

        cooperationsType: {
            'EMART': '이마트',
            'KAKAOT': '카카오T',
            'KICC': 'KICC',
            'KOCES': 'KICES',
            'MY_VALET': '마이발렛',
            'NICE': '나이스페이먼츠',
            'SMARTRO': '스마트로'
        }
    }
}
