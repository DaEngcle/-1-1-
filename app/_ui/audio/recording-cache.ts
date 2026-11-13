"use client";

// 문장 녹음을 잠깐 보관한다: 입모양 발음 가이드를 보고 돌아와도 방금 한 녹음이 남아 있게.
// 앱 안에서 오가면 메모리에서, 아이폰이 화면을 새로 불러와도 IndexedDB에서 꺼낸다. 하루 지나면 버린다.

const DB = "dingle-recordings";
const STORE = "rec";
const TTL = 24 * 60 * 60 * 1000;
const mem = new Map<string, Blob>();

function open(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  const db = await open();
  if (!db) return undefined;
  return new Promise((resolve) => {
    try {
      const t = db.transaction(STORE, mode);
      const req = run(t.objectStore(STORE));
      t.oncomplete = () => {
        resolve(req ? req.result : undefined);
        db.close();
      };
      t.onerror = t.onabort = () => {
        resolve(undefined);
        db.close();
      };
    } catch {
      resolve(undefined);
      db.close();
    }
  });
}

export function saveRecording(key: string, blob: Blob) {
  mem.set(key, blob);
  void tx("readwrite", (s) => {
    s.put({ blob, at: Date.now() }, key);
  });
}

export async function loadRecording(key: string): Promise<Blob | null> {
  const hit = mem.get(key);
  if (hit) return hit;
  const row = (await tx("readonly", (s) => s.get(key))) as { blob: Blob; at: number } | undefined;
  if (!row?.blob) return null;
  if (Date.now() - row.at > TTL) {
    clearRecording(key);
    return null;
  }
  mem.set(key, row.blob);
  return row.blob;
}

export function clearRecording(key: string) {
  mem.delete(key);
  void tx("readwrite", (s) => {
    s.delete(key);
  });
}
