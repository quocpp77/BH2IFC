window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker
                .register('./sw.js');
            console.log("sw registered");
        } catch (error) {
            console.log("sw register failed");
        }
    } else {
        console.log("sw not supported");
    }
}

// https://viblo.asia/p/gioi-thieu-ve-service-worker-Qbq5QLgXlD8