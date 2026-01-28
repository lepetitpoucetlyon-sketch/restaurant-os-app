"use client";

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch((registrationError) => {
                    console.error('SW registration failed: ', registrationError);
                });
            });
        }
    }, []);

    return null;
}
