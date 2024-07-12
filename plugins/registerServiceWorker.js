if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
        registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // 새로운 컨텐츠가 사용 가능함을 사용자에게 알림
                        if (confirm('새로운 업데이트가 있습니다. 페이지를 새로고침 하시겠습니까?')) {
                            window.location.reload();
                        }
                    }
                }
            };
        };
    });

    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        alert('ddkdkdiekai')
        window.location.reload();
    });
}
