/**
 * openTawkChat — Open the Tawk.to widget and send visitor context.
 *
 * Uses ONLY officially documented Tawk.to JS API methods:
 *   https://developer.tawk.to/jsapi/
 *
 * Verified methods used:
 *   Tawk_API.isChatHidden()         — returns true if widget is hidden
 *   Tawk_API.isChatMinimized()      — returns true if widget is minimized
 *   Tawk_API.isChatMaximized()      — returns true if widget is already open
 *   Tawk_API.showWidget()           — makes the widget visible (un-hides)
 *   Tawk_API.maximize()             — expands the widget to full chat view
 *   Tawk_API.setAttributes(obj, cb) — sends custom visitor metadata (up to 50 key-value pairs)
 *   Tawk_API.addTags(arr, cb)       — tags the session (up to 10 tags)
 *   Tawk_API.addEvent(name, meta, cb) — logs a custom event
 *
 * NOT used (not in official API):
 *   sendMessage(), prefillMessage(), DOM manipulation of chat input
 *
 * NOTE: The `message` parameter is accepted for backward compatibility but
 *       cannot be used to pre-fill the chat input — no official API exists
 *       for this. Visitor attributes + tags are the correct alternative.
 */

export interface TawkChatData {
  Product?: string;
  Plan?: string;
  Duration?: string;
  Connections?: string | number;
  Price?: string;
  Source?: string;
  [key: string]: string | number | undefined;
}

export function openTawkChat(message?: string, data?: TawkChatData) {
  const tawk = (window as any).Tawk_API;

  // ── Step 1: Widget readiness check ──────────────────────────────────────
  if (!tawk) {
    console.log("[Tawk] ❌ Tawk_API not found on window — widget not loaded yet.");
    return;
  }

  console.log("[Tawk] ✅ Tawk_API found on window.");

  if (message) {
    console.log(
      "[Tawk] ℹ️ message parameter received but cannot be pre-filled — " +
      "no official Tawk.to API exists for this. Using setAttributes + addTags instead."
    );
  }

  // ── Step 2: Set visitor attributes (plan context) ───────────────────────
  if (data && Object.keys(data).length > 0) {
    if (typeof tawk.setAttributes === "function") {
      const attrs: Record<string, string> = {};
      if (data.Product)     attrs["Product"]     = String(data.Product);
      if (data.Plan)        attrs["Plan"]         = String(data.Plan);
      if (data.Duration)    attrs["Duration"]     = String(data.Duration);
      if (data.Connections) attrs["Connections"]  = String(data.Connections);
      if (data.Price)       attrs["Price"]        = String(data.Price);
      if (data.Source)      attrs["Source"]       = String(data.Source);

      console.log("[Tawk] 📋 Calling setAttributes with:", attrs);

      tawk.setAttributes(attrs, (err: any) => {
        if (err) {
          console.log("[Tawk] ⚠️ setAttributes error:", err);
        } else {
          console.log("[Tawk] ✅ setAttributes success.");
        }
      });
    } else {
      console.log("[Tawk] ⚠️ setAttributes is not a function — skipping.");
    }
  }

  // ── Step 3: Add session tags ─────────────────────────────────────────────
  if (typeof tawk.addTags === "function") {
    const tags: string[] = ["Buy Now", "Pricing Page"];
    if (data?.Plan)  tags.push(`Plan: ${data.Plan}`);
    if (data?.Price) tags.push(`Price: ${data.Price}`);

    // Tawk.to allows max 10 tags; slice to be safe
    const safeTags = tags.slice(0, 10);
    console.log("[Tawk] 🏷️ Calling addTags with:", safeTags);

    tawk.addTags(safeTags, (err: any) => {
      if (err) {
        console.log("[Tawk] ⚠️ addTags error:", err);
      } else {
        console.log("[Tawk] ✅ addTags success.");
      }
    });
  } else {
    console.log("[Tawk] ⚠️ addTags is not a function — skipping.");
  }

  // ── Step 4: Log a custom event ───────────────────────────────────────────
  if (typeof tawk.addEvent === "function") {
    const eventMeta: Record<string, string> = {
      action: "Buy Now Clicked",
      source: data?.Source ?? "Pricing Page",
    };
    if (data?.Plan)  eventMeta["plan"]  = String(data.Plan);
    if (data?.Price) eventMeta["price"] = String(data.Price);

    console.log("[Tawk] 📡 Calling addEvent 'buy_now_clicked' with:", eventMeta);

    tawk.addEvent("buy_now_clicked", eventMeta, (err: any) => {
      if (err) {
        console.log("[Tawk] ⚠️ addEvent error:", err);
      } else {
        console.log("[Tawk] ✅ addEvent success.");
      }
    });
  } else {
    console.log("[Tawk] ⚠️ addEvent is not a function — skipping.");
  }

  // ── Step 5: Open / maximize the widget ──────────────────────────────────
  try {
    const isHidden    = typeof tawk.isChatHidden    === "function" && tawk.isChatHidden();
    const isMinimized = typeof tawk.isChatMinimized === "function" && tawk.isChatMinimized();
    const isMaximized = typeof tawk.isChatMaximized === "function" && tawk.isChatMaximized();

    console.log(
      "[Tawk] 📊 Widget state — hidden:", isHidden,
      "| minimized:", isMinimized,
      "| maximized:", isMaximized
    );

    if (isMaximized) {
      console.log("[Tawk] ✅ Widget is already maximized — nothing to do.");
      return;
    }

    if (isHidden) {
      console.log("[Tawk] 👁️ Widget is hidden — calling showWidget()...");
      if (typeof tawk.showWidget === "function") {
        tawk.showWidget();
        console.log("[Tawk] ✅ showWidget() called.");
      } else {
        console.log("[Tawk] ❌ showWidget is not a function — cannot un-hide widget.");
        return;
      }
    }

    console.log("[Tawk] 🚀 Calling maximize()...");
    if (typeof tawk.maximize === "function") {
      tawk.maximize();
      console.log("[Tawk] ✅ maximize() called.");
    } else {
      console.log("[Tawk] ❌ maximize is not a function — cannot open widget.");
    }
  } catch (err) {
    console.log("[Tawk] ❌ Error while opening widget:", err);
  }
}
