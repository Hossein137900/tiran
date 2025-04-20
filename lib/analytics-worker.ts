// lib/analytics-worker.ts

type AnalyticsPayload = {
  type: "init" | "click" | "activity";
  data: {
    path?: string;
    element?: string;
    coordinates?: { x: number; y: number };
    timestamp?: number;
  };
  timestamp?: number;
};
let db: IDBDatabase | null = null;
let dbReady: Promise<void>;

const initDB = () => {
  if (dbReady) return dbReady;

  dbReady = new Promise((resolve, reject) => {
    const request = self.indexedDB.open("analyticsDB", 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      database.createObjectStore("events", { autoIncrement: true });
    };
    request.onsuccess = () => {
      db = request.result;
      console.log("📦 IndexedDB initialized in worker");
      resolve();
    };
    request.onerror = () => {
      console.error("🚨 IndexedDB open error:", request.error);
      reject(request.error);
    };
  });

  return dbReady;
};

const saveToIndexedDB = (payload: AnalyticsPayload) => {
  return new Promise<void>((resolve, reject) => {
    if (!db) {
      console.log("🚨 Database not ready");
      reject(new Error("Database not initialized"));
      return;
    }

    const tx = db.transaction("events", "readwrite");
    const store = tx.objectStore("events");
    const request = store.add(payload);

    request.onsuccess = () => {
      console.log("💾 Saved to IndexedDB:", payload);
      resolve();
    };
    request.onerror = () => {
      console.log("🚨 IndexedDB save error:", request.error);
      reject(request.error);
    };
  });
};

self.onmessage = async (event) => {
  const { type, data } = event.data;
  await initDB();

  switch (type) {
    case "INIT":
      console.log("🚀 Worker Initialized:", data);
      await saveToIndexedDB({ type: "init", data });
      break;

    case "CLICK":
      console.log("🖱️ Click Recorded:", data);
      await saveToIndexedDB({ type: "click", data, timestamp: Date.now() });
      break;

    case "ACTIVITY":
      console.log("📊 Activity Recorded");
      await saveToIndexedDB({ type: "activity", data, timestamp: Date.now() });
      break;

    case "SEND_ANALYTICS":
      console.log("📤 Analytics ready to sync");
      break;
  }
};
