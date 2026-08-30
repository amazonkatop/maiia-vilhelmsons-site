/**
 * Translate English copy to Russian for bilingual site storage.
 * Prefer DeepL when DEEPL_API_KEY is set; otherwise MyMemory (free, no key).
 */

const MYMEMORY_MAX = 450;

function chunkText(text: string, maxLen: number): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= maxLen) return [trimmed];

  const parts: string[] = [];
  let remaining = trimmed;
  while (remaining.length > maxLen) {
    let cut = remaining.lastIndexOf(". ", maxLen);
    if (cut < maxLen * 0.4) cut = remaining.lastIndexOf(" ", maxLen);
    if (cut < maxLen * 0.4) cut = maxLen;
    parts.push(remaining.slice(0, cut + 1).trim());
    remaining = remaining.slice(cut + 1).trim();
  }
  if (remaining) parts.push(remaining);
  return parts;
}

async function translateWithDeepL(text: string, apiKey: string): Promise<string> {
  const endpoint = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      source_lang: "EN",
      target_lang: "RU",
    }),
  });
  if (!res.ok) {
    throw new Error(`DeepL translation failed (${res.status})`);
  }
  const data = (await res.json()) as {
    translations?: Array<{ text?: string }>;
  };
  const out = data.translations?.[0]?.text;
  if (!out) throw new Error("DeepL returned empty translation");
  return out;
}

async function translateChunkMyMemory(text: string): Promise<string> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", "en|ru");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`MyMemory translation failed (${res.status})`);
  }
  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
  };
  const out = data.responseData?.translatedText;
  if (!out || (data.responseStatus && data.responseStatus !== 200)) {
    throw new Error("MyMemory returned empty translation");
  }
  // MyMemory sometimes echoes the source when quota is exceeded
  if (out === text && /[а-яА-ЯёЁ]/.test(text) === false && text.length > 20) {
    // may be untranslated; still return so save doesn't fail hard
  }
  return out;
}

export async function translateEnToRu(text: string): Promise<string> {
  const value = text?.trim() ?? "";
  if (!value) return "";

  const deeplKey = process.env.DEEPL_API_KEY?.trim();
  if (deeplKey) {
    try {
      return await translateWithDeepL(value, deeplKey);
    } catch (err) {
      console.warn("[translate] DeepL failed, falling back to MyMemory:", err);
    }
  }

  const chunks = chunkText(value, MYMEMORY_MAX);
  const translated: string[] = [];
  for (const chunk of chunks) {
    translated.push(await translateChunkMyMemory(chunk));
    // gentle rate limit for free API
    if (chunks.length > 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return translated.join(" ");
}

/** Map of EN field → RU field pairs to fill from English. */
export async function fillRuFromEn(
  data: Record<string, unknown>,
  pairs: ReadonlyArray<readonly [string, string]>,
): Promise<Record<string, unknown>> {
  const next = { ...data };
  for (const [enKey, ruKey] of pairs) {
    const en = next[enKey];
    if (typeof en !== "string" || !en.trim()) continue;
    next[ruKey] = await translateEnToRu(en);
  }
  return next;
}
