export type SessionDraft = {
  problem: string;
  belief: string;
  emotion: string;
  body_location: string;
  cost: string;
  secondary_gain: string;
  emotion_goal: string;
  becomes_possible: string;
  resolution: string;
  becoming: string;
};

export const emptyDraft: SessionDraft = {
  problem: "",
  belief: "",
  emotion: "",
  body_location: "",
  cost: "",
  secondary_gain: "",
  emotion_goal: "",
  becomes_possible: "",
  resolution: "",
  becoming: "",
};

export const DRAFT_KEY = "sedna:draft";
export const HISTORY_KEY = "sedna:history";

export function loadDraft(): SessionDraft {
  if (typeof window === "undefined") return emptyDraft;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyDraft;
    return { ...emptyDraft, ...JSON.parse(raw) };
  } catch {
    return emptyDraft;
  }
}

export function saveDraft(draft: SessionDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_KEY);
}

export type SavedSession = SessionDraft & {
  id: string;
  created_at: string;
};

export function appendToHistory(draft: SessionDraft): SavedSession {
  const entry: SavedSession = {
    ...draft,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };
  if (typeof window === "undefined") return entry;
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const list: SavedSession[] = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // ignore
  }
  return entry;
}

/**
 * Persists a completed session to the database for the authenticated user.
 * Returns the inserted row's id on success, null otherwise (caller can fall
 * back to localStorage history).
 */
export async function persistSessionToServer(
  draft: SessionDraft
): Promise<{ id: string } | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id: string };
    return data;
  } catch {
    return null;
  }
}
