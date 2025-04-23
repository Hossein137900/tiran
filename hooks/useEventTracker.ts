// useEventTracker.ts
import { useEffect, useRef } from "react";
import { openDB, IDBPDatabase } from "idb";

export const useEventTracker = () => {
  const worker = useRef<Worker | null>(null);
  const dbRef = useRef<IDBPDatabase | null>(null);
  const sessionInfo = useRef<{ sessionId: string; page: string } | null>(null);

  useEffect(() => {
    const baseUrl = window.location.origin;

    const initDB = async () => {
      const db = await openDB("analyticsDB", 1, {
        upgrade(db) {
          db.createObjectStore("events", { autoIncrement: true });
        },
      });
      dbRef.current = db;
      console.log("📦 IndexedDB initialized in main thread");
    };

    initDB();

    worker.current = new Worker(
      new URL("../lib/analytics-worker.ts", import.meta.url)
    );
    console.log("🚀 Worker created");

    const sessionId =
      sessionStorage.getItem("sessionId") || crypto.randomUUID();
    sessionStorage.setItem("sessionId", sessionId);
    const page = window.location.pathname;

    sessionInfo.current = { sessionId, page };

    worker.current?.postMessage({
      type: "INIT",
      data: {
        sessionId,
        currentPath: page,
        pageLoadTime: Date.now(),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        baseUrl,
      },
    });

    // In syncToBackend function
    const syncToBackend = async () => {
      if (!dbRef.current) {
        console.log("🚨 IndexedDB not ready in main thread");
        return;
      }

      const tx = dbRef.current.transaction("events", "readwrite");
      const store = tx.objectStore("events");
      const allEvents = await store.getAll();
      console.log("📦 Retrieved from IndexedDB:", allEvents);

      if (allEvents.length === 0) {
        console.log("📭 No events to sync");
        return;
      }

      const flattenedEvents = allEvents.map((event) => {
        const baseEvent = {
          type: event.type,
          sessionId: sessionInfo.current?.sessionId || "",
          page: sessionInfo.current?.page || "",
          timestamp: event.timestamp || Date.now(),
        };
        if (event.type === "click") {
          return { ...baseEvent, x: event.data.x, y: event.data.y };
        } else if (event.type === "activity") {
          return { ...baseEvent };
        } else if (event.type === "init") {
          return {
            ...baseEvent,
            duration: Date.now() - event.data.pageLoadTime,
          }; // Update duration dynamically
        }
        return baseEvent;
      });

      try {
        console.log("🚀 Sending to backend:", flattenedEvents);
        const response = await fetch(`${baseUrl}/api/tracker`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flattenedEvents),
        });

        if (response.ok) {
          console.log(
            "✅ Synced to backend:",
            flattenedEvents.length,
            "events"
          );
          const clearTx = dbRef.current.transaction("events", "readwrite");
          const clearStore = clearTx.objectStore("events");
          await clearStore.clear();
          console.log("🧹 IndexedDB cleared");
        } else {
          console.error(
            "🚨 Sync failed:",
            response.status,
            await response.text()
          );
        }
      } catch (error) {
        console.error("🚨 Sync error:", error);
      }
    };

    const sendPeriodicAnalytics = () => {
      console.log("📊 Sending periodic analytics");
      worker.current?.postMessage({ type: "SEND_ANALYTICS" });
      syncToBackend();
    };

    const periodicSync = setInterval(sendPeriodicAnalytics, 300000);
    syncToBackend();

    const handleClick = (event: MouseEvent) => {
      const clickData = { x: event.clientX, y: event.clientY };
      worker.current?.postMessage({ type: "CLICK", data: clickData });
      console.log("🖱️ Click Event Sent:", clickData);
    };

    const handleActivity = () => {
      worker.current?.postMessage({
        type: "ACTIVITY",
        data: { activityType: "user_interaction" },
      });
      console.log("🔄 Activity Event Sent");
    };

    const throttledActivity = throttle(handleActivity, 5000);

    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", throttledActivity);
    window.addEventListener("mousemove", throttledActivity);
    console.log("✅ Event Listeners Attached");

    return () => {
      clearInterval(periodicSync);
      sendPeriodicAnalytics();
      worker.current?.terminate();
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", throttledActivity);
      window.removeEventListener("mousemove", throttledActivity);
      console.log("🧹 Event Listeners Removed");
    };
  }, []);

  return null;
};

function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
