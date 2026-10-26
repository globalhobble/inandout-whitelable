"use client";

import { useSyncExternalStore } from "react";

/* ---------- Clock ----------
 * The current time, refreshed every minute. Returns null during server
 * rendering so the page doesn't show a time that's already out of date.
 */
let minute = Math.floor(Date.now() / 60_000);
const clockListeners = new Set<() => void>();
let clockTimer: ReturnType<typeof setInterval> | undefined;

function subscribeClock(cb: () => void) {
  clockListeners.add(cb);
  if (!clockTimer) {
    clockTimer = setInterval(() => {
      const m = Math.floor(Date.now() / 60_000);
      if (m !== minute) {
        minute = m;
        clockListeners.forEach((l) => l());
      }
    }, 5_000);
  }
  return () => {
    clockListeners.delete(cb);
    if (!clockListeners.size && clockTimer) {
      clearInterval(clockTimer);
      clockTimer = undefined;
    }
  };
}

export function useNow(): Date | null {
  const m = useSyncExternalStore(
    subscribeClock,
    () => (minute = Math.max(minute, Math.floor(Date.now() / 60_000))),
    () => null,
  );
  return m === null ? null : new Date();
}

/* ---------- Small saved preferences on this device ----------
 * A convenience only (e.g. whether the sidebar is collapsed). Anything that
 * matters is stored in the database, not here.
 */
const prefListeners = new Set<() => void>();

function readPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setPref(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the change still applies until the page reloads */
    memoryPrefs.set(key, value);
  }
  prefListeners.forEach((l) => l());
}

const memoryPrefs = new Map<string, string>();

export function usePref(key: string, fallback: string): string {
  return useSyncExternalStore(
    (cb) => {
      prefListeners.add(cb);
      return () => prefListeners.delete(cb);
    },
    () => memoryPrefs.get(key) ?? readPref(key) ?? fallback,
    () => fallback,
  );
}
