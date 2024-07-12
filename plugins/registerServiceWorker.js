if ('serviceWorker' in navigator) {
    console.log('서비스 워커 지원됨');
    navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('서비스 워커 등록 성공:', registration.scope);

        window.$registration = registration;

        // setInterval(() => {
        //     console.log('interval update')
        //     registration.update();
        // });

        registration.onupdatefound = () => {
            console.log('새 서비스 워커 발견됨');
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
                console.log('서비스 워커 상태 변경:', installingWorker.state);
                if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        console.log('새 컨텐츠 사용 가능');
                        if (confirm('새로운 업데이트가 있습니다. 페이지를 새로고침 하시겠습니까?')) {
                            console.log('사용자가 새로고침 수락');
                            window.location.reload();
                        } else {
                            console.log('사용자가 새로고침 거부');
                        }
                    } else {
                        console.log('컨텐츠가 오프라인 사용을 위해 캐시됨');
                    }
                }
            };
        };
    }).catch(error => {
        console.error('서비스 워커 등록 실패:', error);
    });

    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('서비스 워커 컨트롤러 변경');
        if (refreshing) {
            console.log('이미 새로고침 중');
            return;
        }
        refreshing = true;
        console.log('페이지 새로고침');
        window.location.reload();
    });
} else {
    console.log('서비스 워커 지원되지 않음');
}
