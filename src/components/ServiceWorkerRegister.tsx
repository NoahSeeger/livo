"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) =>
          console.log(
            "Service Worker registration successful with scope: ",
            registration.scope
          )
        )
        .catch((err) =>
          console.log("Service Worker registration failed: ", err)
        );
    }
  }, []);

  return null; // This component doesn't render anything
}
