/**
 * Meta (Facebook) Pixel – Bootstrap. Bewusst als TS-Modul statt als
 * `%VITE_X%`-Platzhalter direkt in index.html: Vites HTML-Ersetzung lässt
 * einen nicht gesetzten Platzhalter als rohen String ("%VITE_META_PIXEL_ID%")
 * stehen statt ihn zu leeren – das würde `if (!id)` unterlaufen und einen
 * kaputten Init-Aufruf mit dem Platzhalter-String selbst als "ID" auslösen.
 * `import.meta.env.X` wird von Vite dagegen zuverlässig zu einem echten
 * String oder `undefined` aufgelöst.
 *
 * Ohne gesetzte VITE_META_PIXEL_ID ist dies ein No-op (siehe
 * docs/meta-pixel-setup.md).
 */
export function initMetaPixel(): void {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (!pixelId || window.fbq) return;

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string, n: any, t: any, s: any) {
    if (f.fbq) return;
    n = f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js", undefined, undefined, undefined);
  /* eslint-enable */

  window.fbq!("init", pixelId);
  window.fbq!("track", "PageView");
}
