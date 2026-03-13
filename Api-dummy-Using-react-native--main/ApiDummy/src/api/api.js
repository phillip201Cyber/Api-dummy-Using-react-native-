// src/api/api.js

import { BASE_URL } from "./config";

export const fetchWithTimeout = async (url, options = {}, timeoutMs = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await res.json();
    return await res.text();
  } finally {
    clearTimeout(id);
  }
};

// ✅ Start with dummy data (so you can demo it works)
export async function scanDevicesMock() {
  return [{ id: "heltec-001", name: "Heltec LoRa V32", ip: "192.168.4.1" }];
}

// ✅ Example “real” endpoint (change path to your hub route later)
export async function getDevices() {
  // example: GET http://192.168.4.1/devices
  return fetchWithTimeout(`${BASE_URL}/devices`);
}
