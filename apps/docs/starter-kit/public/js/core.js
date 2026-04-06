function Q() {
  const e = [], t = /* @__PURE__ */ new Map();
  function r(l) {
    if (!l || !l.name)
      throw new Error("WEAVE plugin must have a name");
    if (e.find((m) => m.name === l.name)) {
      console.warn(`WEAVE plugin "${l.name}" already registered`);
      return;
    }
    e.push(l), t.set(l.name, /* @__PURE__ */ new Map());
  }
  function n() {
    return e;
  }
  function o(l) {
    return e.find((d) => d.name === l);
  }
  function s(l) {
    return t.has(l) || t.set(l, /* @__PURE__ */ new Map()), t.get(l);
  }
  function a(l, d) {
    return s(l).get(d);
  }
  function i(l, d, m) {
    s(l).set(d, m);
  }
  function f(l, d) {
    s(l).delete(d);
  }
  function u(l) {
    return Array.from(s(l).entries());
  }
  function g(l) {
    s(l).clear();
  }
  return {
    plugins: e,
    register: r,
    getPlugins: n,
    getPlugin: o,
    getStore: s,
    getInstance: a,
    setInstance: i,
    deleteInstance: f,
    getStoreEntries: u,
    clearStore: g
  };
}
function ee(e = !1) {
  const t = /* @__PURE__ */ new Set();
  function r(...i) {
    e && console.log("[WEAVE]", ...i);
  }
  function n(...i) {
    console.warn("[WEAVE]", ...i);
  }
  function o(i, ...f) {
    t.has(i) || (t.add(i), console.warn("[WEAVE]", ...f));
  }
  function s(...i) {
    console.error("[WEAVE]", ...i);
  }
  function a() {
    return e;
  }
  return {
    log: r,
    warn: n,
    warnOnce: o,
    error: s,
    isDebug: a
  };
}
const Y = {
  /**
   * window 존재 여부
   */
  hasWindow() {
    return typeof window < "u";
  },
  /**
   * document 존재 여부
   */
  hasDocument() {
    return typeof document < "u";
  },
  /**
   * GSAP 존재 여부
   */
  hasGSAP() {
    return typeof window < "u" && !!window.gsap;
  },
  /**
   * ScrollTrigger 존재 여부
   */
  hasScrollTrigger() {
    return typeof window < "u" && !!window.ScrollTrigger;
  },
  /**
   * IntersectionObserver 지원 여부
   */
  hasIntersectionObserver() {
    return typeof window < "u" && "IntersectionObserver" in window;
  },
  /**
   * MutationObserver 지원 여부
   */
  hasMutationObserver() {
    return typeof window < "u" && "MutationObserver" in window;
  },
  /**
   * element 존재 여부
   */
  isElement(e) {
    return e instanceof Element;
  },
  /**
   * element가 DOM에 포함되어 있는지
   */
  inDOM(e) {
    return this.isElement(e) ? document.body.contains(e) : !1;
  },
  /**
   * selector 존재 여부
   */
  hasSelector(e) {
    if (!e) return !1;
    try {
      return document.querySelector(e), !0;
    } catch {
      return !1;
    }
  }
};
function te() {
  let e = null;
  function t(n, o) {
    if (!Y.hasMutationObserver()) {
      console.warn("[WEAVE] MutationObserver not supported");
      return;
    }
    n && (e = new MutationObserver((s) => {
      let a = !1;
      for (const i of s)
        if (i.type === "childList") {
          if (i.addedNodes && i.addedNodes.length > 0) {
            for (const f of i.addedNodes)
              if (f.nodeType === 1) {
                a = !0;
                break;
              }
          }
          if (a) break;
        }
      a && typeof o == "function" && o();
    }), e.observe(n, {
      childList: !0,
      subtree: !0
    }));
  }
  function r() {
    e && (e.disconnect(), e = null);
  }
  return {
    observe: t,
    disconnect: r
  };
}
function re() {
  const e = [];
  function t(u) {
    if (typeof u == "function")
      return e.push(u), u;
  }
  function r(u, g, l, d) {
    if (!u || typeof u.addEventListener != "function")
      return () => {
      };
    u.addEventListener(g, l, d);
    const m = () => {
      u.removeEventListener(g, l, d);
    };
    return t(m), m;
  }
  function n(u, g, l) {
    if (!(u instanceof Element)) return null;
    const d = u.closest(g);
    return !d || l instanceof Element && !l.contains(d) ? null : d;
  }
  function o(u, g, l, d, m) {
    if (!u || typeof u.addEventListener != "function")
      return () => {
      };
    const y = (A) => {
      const v = n(A.target, l, u);
      v && d(A, v);
    };
    u.addEventListener(g, y, m);
    const h = () => {
      u.removeEventListener(g, y, m);
    };
    return t(h), h;
  }
  function s(u, g, l, d) {
    if (!u || typeof u.addEventListener != "function")
      return () => {
      };
    const m = Object.keys(l || {});
    if (!m.length) return () => {
    };
    const y = (A) => {
      for (const v of m) {
        const c = n(A.target, v, u);
        if (!c) continue;
        const p = l[v];
        typeof p == "function" && p(A, c);
        return;
      }
    };
    u.addEventListener(g, y, d);
    const h = () => {
      u.removeEventListener(g, y, d);
    };
    return t(h), h;
  }
  function a() {
    for (; e.length; ) {
      const u = e.pop();
      try {
        u();
      } catch (g) {
        console.error("[WEAVE] event cleanup error", g);
      }
    }
  }
  return {
    on: r,
    off: (u) => {
      typeof u == "function" && u();
    },
    listen: r,
    delegate: o,
    delegateMap: s,
    cleanup: a
  };
}
function bt(e = {}) {
  const {
    root: t = document,
    plugins: r = [],
    debug: n = !1,
    autoObserve: o = !1,
    exposeGlobal: s = !1
  } = e, a = ee(n), i = Q(), f = re(), u = te();
  let g = !1;
  const l = {
    root: t,
    registry: i,
    events: f,
    guards: Y,
    logger: a,
    config: {}
  };
  function d(c) {
    return !c || !c.name ? (a.error("Invalid plugin. plugin.name is required."), v) : (i.register(c), v);
  }
  function m(c = t) {
    if (c)
      return l.root = c, a.log("WEAVE mount start"), i.plugins.forEach((p) => {
        try {
          if (p.setup && p.setup(l), !p.scan) return;
          (p.scan(l) || []).forEach((w) => {
            y(p, w);
          });
        } catch (b) {
          a.error(`Plugin ${p.name} mount error`, b);
        }
      }), o && u.observe(c, h), g = !0, a.log("WEAVE mount complete"), v;
  }
  function y(c, p) {
    const b = i.getStore(c.name);
    if (!b.has(p))
      try {
        const w = c.mount ? c.mount(l, p) : null;
        b.set(p, w || !0), a.log(`${c.name} mounted`, p);
      } catch (w) {
        a.error(`Plugin ${c.name} element mount error`, w);
      }
  }
  function h() {
    g && (a.log("WEAVE refresh"), i.plugins.forEach((c) => {
      if (!c.scan) return;
      (c.scan(l) || []).forEach((b) => {
        y(c, b);
      });
    }));
  }
  function A() {
    a.log("WEAVE destroy"), i.plugins.forEach((c) => {
      const p = i.getStore(c.name);
      if (Array.from(p.entries()).forEach(([w, E]) => {
        if (c.unmount)
          try {
            c.unmount(l, w, E);
          } catch (S) {
            a.error(`Plugin ${c.name} unmount error`, S);
          }
        p.delete(w);
      }), c.teardown)
        try {
          c.teardown(l);
        } catch (w) {
          a.error(`Plugin ${c.name} teardown error`, w);
        }
    }), u.disconnect(), f.cleanup(), g = !1;
  }
  const v = {
    use: d,
    mount: m,
    refresh: h,
    destroy: A,
    registry: i
  };
  return r.forEach(d), s && (window.weave = v), v;
}
const ne = {
  selector: "[data-weave-copy], .weave_copy",
  defaultMessage: "Copied to clipboard.",
  useAlert: !1,
  trimText: !0,
  successClass: "is_copied",
  successLabel: "COPIED",
  successDuration: 1600,
  onSuccess: null,
  onError: null
};
function At(e = {}) {
  const t = {
    ...ne,
    ...e
  }, r = /* @__PURE__ */ new WeakMap();
  return {
    name: "copy",
    defaults: t,
    setup(n) {
      n.logger.log("copy plugin setup");
    },
    scan(n) {
      return Array.from(n.root.querySelectorAll(t.selector));
    },
    mount(n, o) {
      const s = async (i) => {
        i.preventDefault();
        const f = oe(o, t);
        if (!f) {
          n.logger.warn("copy text not found", o), typeof t.onError == "function" && t.onError({
            event: i,
            el: o,
            reason: "NO_TEXT"
          });
          return;
        }
        try {
          await ie(f);
          const u = ae(o, t);
          se(o, t) && u && window.alert(u), typeof t.onSuccess == "function" && t.onSuccess({
            event: i,
            el: o,
            text: f,
            message: u
          }), ue(o, t, r), q("weave:copy-success", {
            el: o,
            text: f,
            message: u
          }), n.logger.log("copy success", { el: o, text: f });
        } catch (u) {
          n.logger.error("copy failed", u), q("weave:copy-error", {
            el: o,
            text: f,
            error: u
          }), typeof t.onError == "function" && t.onError({
            event: i,
            el: o,
            reason: "COPY_FAILED",
            error: u
          });
        }
      };
      return {
        offClick: n.events.listen(o, "click", s)
      };
    },
    unmount(n, o, s) {
      var a;
      (a = s == null ? void 0 : s.offClick) == null || a.call(s), n.logger.log("copy plugin unmounted", o);
    },
    teardown(n) {
      n.logger.log("copy plugin teardown");
    }
  };
}
function oe(e, t) {
  const r = e.dataset.text || e.getAttribute("data-text");
  if (r)
    return t.trimText ? r.trim() : r;
  const n = e.dataset.target || e.getAttribute("data-target");
  if (!n) return "";
  const o = document.querySelector(n);
  if (!o) return "";
  const s = o.textContent || "";
  return t.trimText ? s.trim() : s;
}
function ae(e, t) {
  return e.dataset.copyMessage || e.getAttribute("data-copy-message") || t.defaultMessage;
}
function se(e, t) {
  const r = e.dataset.copyAlert || e.getAttribute("data-copy-alert");
  return r === "true" ? !0 : r === "false" ? !1 : t.useAlert;
}
async function ie(e) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText == "function") {
    await navigator.clipboard.writeText(e);
    return;
  }
  ce(e);
}
function ce(e) {
  const t = document.createElement("textarea");
  t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.top = "-9999px", t.style.left = "-9999px", document.body.appendChild(t), t.focus(), t.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(t);
  }
}
function ue(e, t, r) {
  if (!le(e)) return;
  const n = e.dataset.copySuccessClass || e.getAttribute("data-copy-success-class") || t.successClass, o = e.dataset.copySuccessLabel || e.getAttribute("data-copy-success-label") || t.successLabel, s = de(e, t);
  e.dataset.copyOriginalLabel || (e.dataset.copyOriginalLabel = fe(e));
  const a = r.get(e);
  a && window.clearTimeout(a), O(e, o), e.classList.add(n), e.setAttribute("aria-live", "polite");
  const i = window.setTimeout(() => {
    O(e, e.dataset.copyOriginalLabel || ""), e.classList.remove(n), r.delete(e);
  }, s);
  r.set(e, i);
}
function le(e) {
  return e ? e.tagName === "BUTTON" || e.tagName === "A" || e.getAttribute("role") === "button" : !1;
}
function fe(e) {
  return e.dataset.copyLabel ? e.dataset.copyLabel : (e.textContent || "").trim();
}
function O(e, t) {
  e.textContent = t;
}
function de(e, t) {
  const r = e.dataset.copySuccessDuration || e.getAttribute("data-copy-success-duration"), n = Number.parseInt(r, 10);
  return Number.isNaN(n) ? t.successDuration : n;
}
function q(e, t) {
  typeof window > "u" || typeof window.dispatchEvent != "function" || window.dispatchEvent(new CustomEvent(e, { detail: t }));
}
const D = {
  selector: "[data-weave-file-drop]",
  zoneAttribute: "data-weave-file-drop",
  inputSelector: 'input[type="file"]',
  listSelector: "[data-weave-file-drop-list]",
  overClass: "over",
  emptyMessage: "선택된 파일이 없습니다.",
  zones: {},
  onChange: null,
  onError: null
};
function St(e = {}) {
  const t = {
    ...D,
    ...e,
    zones: {
      ...D.zones,
      ...e.zones || {}
    }
  };
  return {
    name: "fileDrop",
    setup(r) {
      r.logger.log("fileDrop plugin setup");
    },
    scan(r) {
      return Array.from(r.root.querySelectorAll(t.selector));
    },
    mount(r, n) {
      const o = ge(n, t), s = me(t, o), a = pe(n, s);
      if (!a || a.type !== "file")
        return r.logger.warn('fileDrop input[type="file"] not found', n), null;
      we(a, s);
      const i = ye(n, s);
      $(i, [], s);
      let f = 0;
      const u = (c) => {
        n.classList.toggle(s.overClass, c);
      }, g = (c, p, b) => {
        const w = ve(c, s), E = Ce(a, w.validFiles);
        !E && p === "drop" && w.validFiles.length && r.logger.warn("fileDrop could not sync dropped files to input", n), $(i, w.items, s);
        const S = {
          el: n,
          input: a,
          listTarget: i,
          zoneKey: o,
          config: s,
          source: p,
          event: b,
          validFiles: w.items,
          errors: w.errors,
          inputSynced: E
        };
        w.items.length && (_(s.onChange, w.items, S), _(t.onChange, w.items, S)), w.errors.length && (_(s.onError, w.errors, S), _(t.onError, w.errors, S));
      }, l = r.events.listen(n, "dragenter", (c) => {
        T(c) && (c.preventDefault(), f += 1, u(!0));
      }), d = r.events.listen(n, "dragover", (c) => {
        T(c) && (c.preventDefault(), c.dataTransfer && (c.dataTransfer.dropEffect = "copy"), u(!0));
      }), m = r.events.listen(n, "dragleave", (c) => {
        T(c) && (c.preventDefault(), f = Math.max(0, f - 1), f === 0 && u(!1));
      }), y = r.events.listen(n, "drop", (c) => {
        var b;
        if (!T(c)) return;
        c.preventDefault(), f = 0, u(!1);
        const p = Array.from(((b = c.dataTransfer) == null ? void 0 : b.files) || []);
        g(p, "drop", c);
      }), h = r.events.listen(a, "change", (c) => {
        const p = Array.from(a.files || []);
        g(p, "input", c);
      }), A = r.events.listen(n, "click", (c) => {
        Te(c.target, a, n) && a.click();
      }), v = r.events.listen(n, "keydown", (c) => {
        c.target === n && (c.key !== "Enter" && c.key !== " " || (c.preventDefault(), a.click()));
      });
      return {
        cleanups: [
          l,
          d,
          m,
          y,
          h,
          A,
          v,
          () => {
            f = 0, u(!1);
          }
        ]
      };
    },
    unmount(r, n, o) {
      var s;
      (s = o == null ? void 0 : o.cleanups) == null || s.forEach((a) => a == null ? void 0 : a()), r.logger.log("fileDrop plugin unmounted", n);
    },
    teardown(r) {
      r.logger.log("fileDrop plugin teardown");
    }
  };
}
function ge(e, t) {
  return e.getAttribute(t.zoneAttribute) || e.dataset.weaveFileDrop || e.id || "";
}
function me(e, t) {
  var n;
  const r = t && ((n = e.zones) == null ? void 0 : n[t]) || {};
  return {
    ...e,
    ...r,
    zoneKey: t,
    accept: Ae(r.accept),
    maxSize: Se(r.maxSize),
    multiple: typeof r.multiple == "boolean" ? r.multiple : void 0,
    renderList: r.renderList === !0
  };
}
function pe(e, t) {
  return t.input instanceof HTMLInputElement ? t.input : typeof t.input == "string" ? document.querySelector(t.input) : e.querySelector(t.inputSelector || D.inputSelector);
}
function ye(e, t) {
  return t.listTarget instanceof HTMLElement ? t.listTarget : typeof t.listTarget == "string" ? document.querySelector(t.listTarget) : e.querySelector(t.listSelector || D.listSelector);
}
function we(e, t) {
  typeof t.multiple == "boolean" && (e.multiple = t.multiple), t.accept.length && (e.accept = t.accept.join(","));
}
function ve(e, t) {
  const r = Array.from(e || []), n = [], o = [], s = [];
  return r.forEach((a, i) => {
    if (!t.multiple && i > 0) {
      s.push(L("TOO_MANY_FILES", a, "하나의 파일만 업로드할 수 있습니다."));
      return;
    }
    const f = he(a, t);
    if (f) {
      s.push(f);
      return;
    }
    n.push(a), o.push(Ee(a));
  }), {
    validFiles: n,
    items: o,
    errors: s
  };
}
function he(e, t) {
  return e ? typeof t.maxSize == "number" && e.size > t.maxSize ? L(
    "FILE_TOO_LARGE",
    e,
    `허용 용량을 초과했습니다. 최대 ${z(t.maxSize)}까지 가능합니다.`
  ) : be(e, t.accept) ? null : L(
    "INVALID_FILE_TYPE",
    e,
    `허용되지 않는 파일 형식입니다. ${_e(t.accept)} 형식만 가능합니다.`
  ) : L("EMPTY_FILE", null, "파일 정보를 읽을 수 없습니다.");
}
function be(e, t) {
  if (!t.length) return !0;
  const r = x(e.name), n = (e.type || "").toLowerCase();
  return t.some((o) => {
    if (!o) return !1;
    if (o.startsWith("."))
      return r === o.slice(1).toLowerCase();
    if (o.includes("/")) {
      if (o.endsWith("/*")) {
        const s = o.slice(0, o.indexOf("/"));
        return n.startsWith(`${s}/`);
      }
      return n === o;
    }
    return r === o.toLowerCase();
  });
}
function Ae(e) {
  return Array.isArray(e) ? e.flatMap((t) => String(t).split(",")).map((t) => t.trim().toLowerCase()).filter(Boolean) : typeof e == "string" ? e.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) : [];
}
function Se(e) {
  if (typeof e == "number")
    return Number.isFinite(e) ? e : void 0;
}
function Ee(e) {
  const t = x(e.name);
  return {
    name: e.name,
    size: e.size,
    sizeLabel: z(e.size),
    type: e.type || "",
    extension: t,
    lastModified: e.lastModified,
    file: e
  };
}
function L(e, t, r) {
  return {
    code: e,
    message: r,
    fileName: (t == null ? void 0 : t.name) || "",
    size: (t == null ? void 0 : t.size) || 0,
    type: (t == null ? void 0 : t.type) || "",
    extension: t ? x(t.name) : ""
  };
}
function $(e, t, r) {
  if (!r.renderList || !e) return;
  if (e.innerHTML = "", !t.length) {
    const o = document.createElement("p");
    o.className = "weave_file_drop_empty", o.textContent = r.emptyMessage, e.appendChild(o);
    return;
  }
  const n = document.createElement("ul");
  n.className = "weave_file_drop_list", t.forEach((o) => {
    const s = document.createElement("li");
    s.className = "weave_file_drop_item";
    const a = document.createElement("strong");
    a.className = "weave_file_drop_name", a.textContent = o.name;
    const i = document.createElement("span");
    i.className = "weave_file_drop_meta", i.textContent = `${o.extension || "file"} · ${o.sizeLabel}`, s.appendChild(a), s.appendChild(i), n.appendChild(s);
  }), e.appendChild(n);
}
function Ce(e, t) {
  if (!(e instanceof HTMLInputElement) || e.type !== "file" || typeof DataTransfer > "u")
    return !1;
  try {
    const r = new DataTransfer();
    return t.forEach((n) => {
      r.items.add(n);
    }), e.files = r.files, !0;
  } catch {
    return !1;
  }
}
function Te(e, t, r) {
  return e instanceof Element ? e === t || !r.contains(e) ? !1 : !e.closest("button, a, input, label, select, textarea") : !0;
}
function T(e) {
  var r;
  const t = (r = e.dataTransfer) == null ? void 0 : r.types;
  return t ? Array.from(t).includes("Files") : !1;
}
function _(e, t, r) {
  typeof e == "function" && e(t, r);
}
function x(e = "") {
  const t = String(e).split(".");
  return t.length > 1 ? t.pop().toLowerCase() : "";
}
function _e(e) {
  return e.join(", ");
}
function z(e) {
  if (!Number.isFinite(e)) return "0 B";
  const t = ["B", "KB", "MB", "GB"];
  let r = e, n = 0;
  for (; r >= 1024 && n < t.length - 1; )
    r /= 1024, n += 1;
  const o = r >= 10 || n === 0 ? 0 : 1;
  return `${r.toFixed(o)} ${t[n]}`;
}
const Le = {
  selector: "[data-weave-link-button], .weave_link_button, .wv_link_btn",
  defaultDelay: 0
};
function Et(e = {}) {
  const t = {
    ...Le,
    ...e
  };
  return {
    name: "linkButton",
    setup(r) {
      r.logger.log("linkButton plugin setup");
    },
    scan(r) {
      return Array.from(r.root.querySelectorAll(t.selector));
    },
    mount(r, n) {
      let o = null;
      return {
        cleanups: [
          r.events.listen(n, "click", (a) => {
            a.preventDefault();
            const i = ke(n, t);
            if (!i.href) {
              r.logger.warn("linkButton href not found", n);
              return;
            }
            o && window.clearTimeout(o), o = window.setTimeout(() => {
              Me(i.href, i.openBlank), o = null;
            }, i.delay);
          }),
          () => {
            o && window.clearTimeout(o);
          }
        ]
      };
    },
    unmount(r, n, o) {
      var s;
      (s = o == null ? void 0 : o.cleanups) == null || s.forEach((a) => a == null ? void 0 : a()), r.logger.log("linkButton plugin unmounted", n);
    },
    teardown(r) {
      r.logger.log("linkButton plugin teardown");
    }
  };
}
function ke(e, t) {
  const r = e.dataset.weaveLinkHref || e.getAttribute("data-weave-link-href") || e.dataset.href || e.getAttribute("data-href") || "", n = Ie(
    e.dataset.weaveLinkDelay || e.getAttribute("data-weave-link-delay") || e.dataset.delay || e.getAttribute("data-delay"),
    t.defaultDelay
  ), o = De(
    e.dataset.weaveLinkBlank || e.getAttribute("data-weave-link-blank") || e.dataset.blank || e.getAttribute("data-blank")
  );
  return {
    href: r,
    delay: n,
    openBlank: o
  };
}
function Ie(e, t) {
  const r = Number.parseInt(e, 10);
  return Number.isNaN(r) ? t : r;
}
function De(e) {
  return e === "" || e === "true" || e === "1";
}
function Me(e, t) {
  if (t) {
    window.open(e, "_blank");
    return;
  }
  window.location.href = e;
}
const xe = {
  selector: "[data-weave-target-button], .weave_target_button, .wv_target_btn",
  defaultClass: "on",
  defaultAction: "toggle",
  syncSelf: !0,
  defaultSelfClass: "",
  onChange: null
};
function Ct(e = {}) {
  const t = {
    ...xe,
    ...e
  };
  return {
    name: "targetButton",
    setup(r) {
      r.logger.log("targetButton plugin setup");
    },
    scan(r) {
      return Array.from(r.root.querySelectorAll(t.selector));
    },
    mount(r, n) {
      return {
        cleanups: [r.events.listen(n, "click", (s) => {
          s.preventDefault();
          const a = Ne(n, t, r.logger);
          if (!a.target) {
            r.logger.warn("targetButton target not found in attributes", n);
            return;
          }
          const i = Oe(a.target);
          if (!i) {
            r.logger.warn(`targetButton target not found: ${a.target}`);
            return;
          }
          const f = qe(i, a.className, a.action);
          if (a.syncSelf) {
            const g = a.selfClass || a.className;
            $e(n, g, f);
          }
          const u = {
            el: n,
            target: i,
            targetSelector: a.target,
            className: a.className,
            action: a.action,
            active: f
          };
          typeof t.onChange == "function" && t.onChange(u), Pe(u), r.logger.log("targetButton changed", u);
        })]
      };
    },
    unmount(r, n, o) {
      var s;
      (s = o == null ? void 0 : o.cleanups) == null || s.forEach((a) => a == null ? void 0 : a()), r.logger.log("targetButton plugin unmounted", n);
    },
    teardown(r) {
      r.logger.log("targetButton plugin teardown");
    }
  };
}
function Ne(e, t, r) {
  const n = e.dataset.weaveTarget || e.getAttribute("data-weave-target") || "", o = e.dataset.weaveTargetClass || e.getAttribute("data-weave-target-class") || t.defaultClass, s = e.dataset.weaveTargetAction || e.getAttribute("data-weave-target-action") || t.defaultAction, a = Fe(
    e.dataset.weaveTargetSelf || e.getAttribute("data-weave-target-self"),
    t.syncSelf
  ), i = e.dataset.weaveTargetSelfClass || e.getAttribute("data-weave-target-self-class") || t.defaultSelfClass;
  return n ? {
    target: n,
    className: o,
    action: R(s, t.defaultAction),
    syncSelf: a,
    selfClass: i
  } : Be(e, t, r);
}
function Be(e, t, r) {
  const n = e.getAttribute("data-target");
  if (!n)
    return {
      target: "",
      className: t.defaultClass,
      action: t.defaultAction,
      syncSelf: t.syncSelf,
      selfClass: t.defaultSelfClass
    };
  try {
    const o = JSON.parse(n.replace(/'/g, '"'));
    return !Array.isArray(o) || o.length < 1 ? (r.warn("targetButton legacy data-target must be an array", e), {
      target: "",
      className: t.defaultClass,
      action: t.defaultAction,
      syncSelf: t.syncSelf,
      selfClass: t.defaultSelfClass
    }) : {
      target: o[0] || "",
      className: o[1] || t.defaultClass,
      action: R(o[2], t.defaultAction),
      syncSelf: t.syncSelf,
      selfClass: t.defaultSelfClass
    };
  } catch (o) {
    return r.error("targetButton legacy data-target parsing failed", o), {
      target: "",
      className: t.defaultClass,
      action: t.defaultAction,
      syncSelf: t.syncSelf,
      selfClass: t.defaultSelfClass
    };
  }
}
function Oe(e) {
  return e ? e.startsWith("#") ? document.querySelector(e) : document.getElementById(e) || document.querySelector(e) : null;
}
function R(e, t) {
  return e === "add" || e === "remove" || e === "toggle" ? e : t;
}
function qe(e, t, r) {
  const n = e.classList.contains(t);
  return r === "add" ? (n || e.classList.add(t), !0) : r === "remove" ? (n && e.classList.remove(t), !1) : (e.classList.toggle(t), !n);
}
function $e(e, t, r) {
  t && e.classList.toggle(t, r);
}
function Fe(e, t) {
  return e == null ? t : e === "" || e === "true" || e === "1" ? !0 : e === "false" || e === "0" ? !1 : t;
}
function Pe(e) {
  typeof window > "u" || typeof window.dispatchEvent != "function" || window.dispatchEvent(new CustomEvent("weave:target-button-change", { detail: e }));
}
const He = {
  selector: "[data-weave-tabs], .weave_tabs, .wv_tab",
  buttonSelector: "[data-weave-tabs-button], .weave_tabs_btn, .wv_tab_btn",
  panelSelector: "[data-weave-tabs-panel], .weave_tabs_panel, .wv_tab_panel",
  activeClass: "active",
  initialIndex: 0,
  syncAria: !0
};
function Tt(e = {}) {
  const t = {
    ...He,
    ...e
  };
  return {
    name: "tabs",
    setup(r) {
      r.logger.log("tabs plugin setup");
    },
    scan(r) {
      return Array.from(r.root.querySelectorAll(t.selector));
    },
    mount(r, n) {
      const o = We(n, t), s = Ue(n, t);
      if (!o.length || !s.length)
        return r.logger.warn("tabs structure is incomplete", n), null;
      const a = Ve(o, s, t);
      t.syncAria && Ye(n, o, s);
      const i = (u, g = !1) => {
        const l = K(u, 0, Math.min(o.length, s.length) - 1);
        o.forEach((d, m) => {
          const y = m === l;
          d.classList.toggle(t.activeClass, y), t.syncAria && (d.setAttribute("aria-selected", String(y)), d.setAttribute("tabindex", y ? "0" : "-1")), g && y && d.focus();
        }), s.forEach((d, m) => {
          const y = m === l;
          d.classList.toggle(t.activeClass, y), d.hidden = !y, t.syncAria && d.setAttribute("aria-hidden", String(!y));
        });
      };
      return i(a), {
        cleanups: o.flatMap((u, g) => {
          const l = r.events.listen(u, "click", (m) => {
            u.tagName === "A" && m.preventDefault(), i(g);
          }), d = r.events.listen(u, "keydown", (m) => {
            const y = o.indexOf(u), h = o.length - 1;
            switch (m.key) {
              case "ArrowLeft":
              case "ArrowUp":
                m.preventDefault(), i(y > 0 ? y - 1 : h, !0);
                break;
              case "ArrowRight":
              case "ArrowDown":
                m.preventDefault(), i(y < h ? y + 1 : 0, !0);
                break;
              case "Home":
                m.preventDefault(), i(0, !0);
                break;
              case "End":
                m.preventDefault(), i(h, !0);
                break;
            }
          });
          return [l, d];
        })
      };
    },
    unmount(r, n, o) {
      var s;
      (s = o == null ? void 0 : o.cleanups) == null || s.forEach((a) => a == null ? void 0 : a()), r.logger.log("tabs plugin unmounted", n);
    },
    teardown(r) {
      r.logger.log("tabs plugin teardown");
    }
  };
}
function We(e, t) {
  return Array.from(e.querySelectorAll(t.buttonSelector));
}
function Ue(e, t) {
  return Array.from(e.querySelectorAll(t.panelSelector));
}
function Ve(e, t, r) {
  const n = e.findIndex(
    (s) => s.classList.contains(r.activeClass) || s.getAttribute("aria-selected") === "true"
  );
  if (n >= 0) return n;
  const o = t.findIndex(
    (s) => s.classList.contains(r.activeClass)
  );
  return o >= 0 ? o : K(r.initialIndex, 0, Math.min(e.length, t.length) - 1);
}
function Ye(e, t, r) {
  e.setAttribute("role", "tablist"), t.forEach((n, o) => {
    const s = n.id || `weave-tab-button-${F()}`, a = r[o], i = a.id || `weave-tab-panel-${F()}`;
    n.id = s, a.id = i, n.setAttribute("role", "tab"), n.setAttribute("aria-controls", i), a.setAttribute("role", "tabpanel"), a.setAttribute("aria-labelledby", s);
  });
}
function K(e, t, r) {
  return Math.min(Math.max(e, t), r);
}
function F() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
const ze = {
  selector: "[data-weave-accordion], .weave_accordion, .wv_accordion",
  itemSelector: "[data-weave-accordion-item], .weave_accordion_item, li",
  buttonSelector: "[data-weave-accordion-button], .weave_accordion_btn, .wv_accordion_btn",
  panelSelector: "[data-weave-accordion-panel], .weave_accordion_panel, .wv_accordion_panel",
  activeClass: "active",
  defaultMode: "single",
  syncAria: !0
};
function _t(e = {}) {
  const t = {
    ...ze,
    ...e
  };
  return {
    name: "accordion",
    setup(r) {
      r.logger.log("accordion plugin setup");
    },
    scan(r) {
      return Array.from(r.root.querySelectorAll(t.selector));
    },
    mount(r, n) {
      const o = Re(n, t), s = [];
      let a = !1;
      if (!o.length)
        return r.logger.warn("accordion items not found", n), null;
      const i = Ge(n, t), f = (g, l) => {
        const d = k(g, t), m = P(g, t);
        g.classList.toggle(t.activeClass, l), d == null || d.classList.toggle(t.activeClass, l), m && (m.classList.toggle(t.activeClass, l), m.hidden = !l), t.syncAria && d && d.setAttribute("aria-expanded", String(l)), t.syncAria && m && m.setAttribute("aria-hidden", String(!l));
      }, u = (g) => {
        o.forEach((l) => {
          l !== g && f(l, !1);
        });
      };
      return o.forEach((g) => {
        const l = k(g, t), d = P(g, t);
        if (!l)
          return;
        t.syncAria && Ze(l, d);
        const m = je(g, l, t);
        let y = m;
        i === "single" && m && (a ? y = !1 : a = !0), f(g, y);
        const h = r.events.listen(l, "click", (v) => {
          l.tagName === "A" && v.preventDefault();
          const c = !g.classList.contains(t.activeClass);
          i === "single" && c && u(g), f(g, i === "single" ? c : !g.classList.contains(t.activeClass));
        }), A = r.events.listen(l, "keydown", (v) => {
          var w, E, S, B;
          const c = o.map((X) => k(X, t)).filter(Boolean), p = c.indexOf(l), b = c.length - 1;
          switch (v.key) {
            case "ArrowUp":
              v.preventDefault(), (w = c[p > 0 ? p - 1 : b]) == null || w.focus();
              break;
            case "ArrowDown":
              v.preventDefault(), (E = c[p < b ? p + 1 : 0]) == null || E.focus();
              break;
            case "Home":
              v.preventDefault(), (S = c[0]) == null || S.focus();
              break;
            case "End":
              v.preventDefault(), (B = c[b]) == null || B.focus();
              break;
          }
        });
        s.push(h, A);
      }), {
        cleanups: s
      };
    },
    unmount(r, n, o) {
      var s;
      (s = o == null ? void 0 : o.cleanups) == null || s.forEach((a) => a == null ? void 0 : a()), r.logger.log("accordion plugin unmounted", n);
    },
    teardown(r) {
      r.logger.log("accordion plugin teardown");
    }
  };
}
function Re(e, t) {
  return Array.from(e.children).filter(
    (r) => {
      var n;
      return (n = r.matches) == null ? void 0 : n.call(r, t.itemSelector);
    }
  );
}
function k(e, t) {
  return e.querySelector(t.buttonSelector);
}
function P(e, t) {
  return e.querySelector(t.panelSelector) || Ke(e, t);
}
function Ke(e, t) {
  var o;
  const r = k(e, t), n = r == null ? void 0 : r.nextElementSibling;
  return n && ((o = n.matches) != null && o.call(n, t.panelSelector) || n.classList.contains("accordion_panel")) ? n : null;
}
function Ge(e, t) {
  return (e.dataset.weaveAccordionMode || e.getAttribute("data-weave-accordion-mode") || e.dataset.mode || e.dataset.type || t.defaultMode) === "multi" ? "multi" : "single";
}
function je(e, t, r) {
  return e.classList.contains(r.activeClass) || t != null && t.classList.contains(r.activeClass) ? !0 : (t == null ? void 0 : t.getAttribute("aria-expanded")) === "true";
}
function Ze(e, t) {
  if (e.setAttribute("aria-expanded", e.getAttribute("aria-expanded") || "false"), !t) return;
  const r = e.id || `weave-accordion-button-${H()}`, n = t.id || `weave-accordion-panel-${H()}`;
  e.id = r, t.id = n, e.setAttribute("aria-controls", n), t.setAttribute("aria-labelledby", r);
}
function H() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
const Je = {
  selector: "[data-weave-modal], .weave_modal, .wv_modal",
  triggerSelector: "[data-weave-modal-open], .weave_modal_open, .wv_modal_btn[data-modal]",
  closeSelector: "[data-weave-modal-close], .weave_modal_close, .close_modal",
  overlaySelector: "[data-weave-modal-overlay], .weave_modal_overlay, .dim",
  activeClass: "active",
  bodyLockClass: "scrollLock",
  closeOnOverlayClick: !0,
  closeOnEscape: !0,
  closeOthersByDefault: !0
};
function Lt(e = {}) {
  const t = {
    ...Je,
    ...e
  }, r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  let o = !1;
  return {
    name: "modal",
    setup(s) {
      o || (o = !0, t.closeOnEscape && s.events.listen(document, "keydown", (a) => {
        a.key === "Escape" && I(s, t, r, n);
      }), t.closeOnOverlayClick && s.events.delegate(document, "click", t.overlaySelector, (a) => {
        a.preventDefault(), I(s, t, r, n);
      }), s.logger.log("modal plugin setup"));
    },
    scan(s) {
      return Array.from(
        s.root.querySelectorAll(`${t.selector}, ${t.triggerSelector}`)
      );
    },
    mount(s, a) {
      return W(a, t.selector) ? Xe(s, a, t, r, n) : W(a, t.triggerSelector) ? Qe(s, a, t, r, n) : null;
    },
    unmount(s, a, i) {
      var f;
      (f = i == null ? void 0 : i.cleanups) == null || f.forEach((u) => u == null ? void 0 : u()), (i == null ? void 0 : i.role) === "modal" && C(a, !1, t, r, n), s.logger.log("modal plugin unmounted", a);
    },
    teardown(s) {
      o = !1, I(s, t, r, n), s.logger.log("modal plugin teardown");
    }
  };
}
function Xe(e, t, r, n, o) {
  return G(t), C(t, !1, r, n, o), {
    role: "modal",
    cleanups: [e.events.listen(t, "click", (a) => {
      if (a.target.closest(r.closeSelector)) {
        a.preventDefault(), C(t, !1, r, n, o);
        return;
      }
      r.closeOnOverlayClick && a.target === t && nt(t) && (a.preventDefault(), C(t, !1, r, n, o));
    })]
  };
}
function Qe(e, t, r, n, o) {
  return {
    role: "trigger",
    cleanups: [e.events.listen(t, "click", (a) => {
      a.preventDefault();
      const i = tt(t), f = i ? document.getElementById(i) : null;
      if (!f) {
        e.logger.warn(`modal target not found: ${i || "(empty)"}`);
        return;
      }
      rt(t, f, r) && I(e, r, n, o, f), n.set(f, t), et(f, t, r, o);
    })]
  };
}
function I(e, t, r, n, o = null) {
  j(t).filter(
    (a) => a.classList.contains(t.activeClass)
  ).forEach((a) => {
    a !== o && C(a, !1, t, r, n);
  }), N(t), e.logger.log("modal close active");
}
function et(e, t, r, n) {
  G(e), e.classList.add(r.activeClass), e.hidden = !1, e.setAttribute("aria-hidden", "false"), at(e, t, n), N(r), requestAnimationFrame(() => {
    var o;
    (o = ot(e)) == null || o.focus();
  });
}
function C(e, t, r, n, o) {
  var s, a;
  e.classList.toggle(r.activeClass, t), e.hidden = !t, e.setAttribute("aria-hidden", String(!t)), st(e, o), (a = (s = n.get(e)) == null ? void 0 : s.focus) == null || a.call(s), N(r);
}
function N(e) {
  const t = j(e).some(
    (r) => r.classList.contains(e.activeClass)
  );
  document.body.classList.toggle(e.bodyLockClass, !!t);
}
function G(e) {
  e.setAttribute("role", e.getAttribute("role") || "dialog"), e.setAttribute("aria-modal", e.getAttribute("aria-modal") || "true"), e.setAttribute("aria-hidden", e.getAttribute("aria-hidden") || "true"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "-1"), e.classList.contains("active") || (e.hidden = !0);
}
function tt(e) {
  return e.dataset.weaveModalOpen || e.getAttribute("data-weave-modal-open") || e.dataset.modal || e.getAttribute("data-modal");
}
function rt(e, t, r) {
  return e.getAttribute("data-weave-modal-chain") === "false" || t.dataset.chain === "false" ? !1 : r.closeOthersByDefault;
}
function nt(e) {
  return !e.querySelector("[data-weave-modal-overlay]");
}
function ot(e) {
  return e.querySelector(
    '[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) || e;
}
function at(e, t, r) {
  const n = t.dataset.youtube || t.getAttribute("data-youtube");
  if (!n) return;
  const o = e.querySelector("iframe");
  o && (r.has(o) || r.set(o, o.getAttribute("src") || ""), o.setAttribute("src", `https://www.youtube.com/embed/${n}`), e.classList.add("is_youtube"));
}
function st(e, t) {
  const r = e.querySelector("iframe");
  if (!r) return;
  const n = t.get(r) || "";
  r.setAttribute("src", n), e.classList.remove("is_youtube");
}
function W(e, t) {
  return typeof (e == null ? void 0 : e.matches) == "function" && e.matches(t);
}
function j(e) {
  return Array.from(document.querySelectorAll(e.selector));
}
const it = {
  selector: "[data-weave-hide-today], .weave_hide_today, .hide_today_compo",
  buttonSelector: "[data-weave-hide-today-button], .weave_hide_today_btn, .hide_today_btn",
  checkboxSelector: "[data-weave-hide-today-checkbox], .weave_hide_today_chk, .hide_today_chk",
  storagePrefix: "weave-hide-today-",
  defaultExpireHours: 24
};
function kt(e = {}) {
  const t = {
    ...it,
    ...e
  };
  return {
    name: "hideToday",
    setup(r) {
      r.logger.log("hideToday plugin setup");
    },
    scan(r) {
      return Array.from(r.root.querySelectorAll(t.selector));
    },
    mount(r, n) {
      ct(n, t);
      const o = n.querySelector(t.buttonSelector);
      return o ? {
        cleanups: [r.events.listen(o, "click", () => {
          const a = Z(n, t);
          if (!a) {
            r.logger.warn("hideToday target not found", n);
            return;
          }
          if (J(a), ut(n, t)) {
            const i = lt(n, t);
            localStorage.setItem(
              M(a, t),
              String(Date.now() + i)
            );
          } else
            localStorage.removeItem(M(a, t));
        })]
      } : (r.logger.warn("hideToday button not found", n), null);
    },
    unmount(r, n, o) {
      var s;
      (s = o == null ? void 0 : o.cleanups) == null || s.forEach((a) => a == null ? void 0 : a()), r.logger.log("hideToday plugin unmounted", n);
    },
    teardown(r) {
      r.logger.log("hideToday plugin teardown");
    }
  };
}
function ct(e, t) {
  const r = Z(e, t);
  if (!r) return;
  const n = e.querySelector(t.checkboxSelector), o = localStorage.getItem(M(r, t));
  if (o && Date.now() < Number(o)) {
    J(r), n && (n.checked = !0);
    return;
  }
  localStorage.removeItem(M(r, t)), ft(r), n && (n.checked = !1);
}
function Z(e, t) {
  const r = e.querySelector(t.checkboxSelector);
  return e.dataset.weaveHideTarget || e.getAttribute("data-weave-hide-target") || (r == null ? void 0 : r.dataset.weaveHideTarget) || (r == null ? void 0 : r.getAttribute("data-weave-hide-target")) || (r == null ? void 0 : r.dataset.close) || (r == null ? void 0 : r.getAttribute("data-close")) || "";
}
function ut(e, t) {
  const r = e.querySelector(t.checkboxSelector);
  return !!(r != null && r.checked);
}
function lt(e, t) {
  const r = e.querySelector(t.checkboxSelector), n = (r == null ? void 0 : r.dataset.weaveHideExpireHours) || (r == null ? void 0 : r.getAttribute("data-weave-hide-expire-hours")) || (r == null ? void 0 : r.dataset.expireHours) || (r == null ? void 0 : r.getAttribute("data-expire-hours")) || String(t.defaultExpireHours), o = Number.parseInt(n, 10);
  return Math.max(1, Number.isNaN(o) ? t.defaultExpireHours : o) * 60 * 60 * 1e3;
}
function M(e, t) {
  return `${t.storagePrefix}${e}`;
}
function J(e) {
  const t = document.getElementById(e);
  t && (t.hidden = !0, t.setAttribute("aria-hidden", "true"));
}
function ft(e) {
  const t = document.getElementById(e);
  t && (t.hidden = !1, t.removeAttribute("aria-hidden"));
}
const dt = {
  selector: "[data-weave-scroll-target], .weave_scroll_to, .wv_scr_btn",
  defaultDuration: 500,
  defaultEasing: "swing",
  headerSelector: ".hd_offset"
};
function It(e = {}) {
  const t = {
    ...dt,
    ...e
  };
  return {
    name: "scrollTo",
    setup(r) {
      r.logger.log("scrollTo plugin setup");
    },
    scan(r) {
      return Array.from(r.root.querySelectorAll(t.selector));
    },
    mount(r, n) {
      return {
        cleanups: [r.events.listen(n, "click", (s) => {
          s.preventDefault();
          const a = gt(n, t), i = mt(a.target);
          if (!i) {
            r.logger.warn(`scroll target not found: ${a.target || "(empty)"}`);
            return;
          }
          const f = pt(a.container);
          if (!f) {
            r.logger.warn(`scroll container not found: ${a.container}`);
            return;
          }
          yt(f, i, a, t);
        })]
      };
    },
    unmount(r, n, o) {
      var s;
      (s = o == null ? void 0 : o.cleanups) == null || s.forEach((a) => a == null ? void 0 : a()), r.logger.log("scrollTo plugin unmounted", n);
    },
    teardown(r) {
      r.logger.log("scrollTo plugin teardown");
    }
  };
}
function gt(e, t) {
  const r = e.dataset.weaveScrollTarget || e.getAttribute("data-weave-scroll-target") || e.dataset.scrTarget || e.getAttribute("data-scr-target") || "", n = e.dataset.weaveScrollContainer || e.getAttribute("data-weave-scroll-container") || e.dataset.scrEl || e.getAttribute("data-scr-el") || "";
  return {
    target: r,
    container: n,
    centered: V(
      e.dataset.weaveScrollCenter || e.getAttribute("data-weave-scroll-center") || e.dataset.centered || e.getAttribute("data-centered")
    ),
    useHeaderOffset: V(
      e.dataset.weaveScrollOffset || e.getAttribute("data-weave-scroll-offset") || e.dataset.scrOffset || e.getAttribute("data-scr-offset")
    ),
    duration: ht(
      e.dataset.weaveScrollDuration || e.getAttribute("data-weave-scroll-duration") || e.dataset.scrSpeed || e.getAttribute("data-scr-speed"),
      t.defaultDuration
    ),
    easing: e.dataset.weaveScrollEasing || e.getAttribute("data-weave-scroll-easing") || e.dataset.scrEasing || e.getAttribute("data-scr-easing") || t.defaultEasing
  };
}
function mt(e) {
  return e ? e.startsWith("#") ? document.querySelector(e) : document.getElementById(e) || document.querySelector(e) : null;
}
function pt(e) {
  return !e || e === "window" ? window : e.startsWith("#") ? document.querySelector(e) : document.getElementById(e) || document.querySelector(e);
}
function yt(e, t, r, n) {
  const o = e === window, s = o ? window.pageYOffset : e.scrollTop, a = o ? window.innerHeight : e.clientHeight, i = o ? Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - a : e.scrollHeight - a, f = o ? window.pageYOffset : e.scrollTop, u = t.getBoundingClientRect(), g = o ? { top: 0 } : e.getBoundingClientRect(), l = o ? f + u.top : f + (u.top - g.top), d = r.useHeaderOffset ? wt(n) : 0;
  let m;
  if (r.centered) {
    const c = l + u.height / 2, p = d ? d + (a - d) / 2 : a / 2;
    m = c - p;
  } else
    m = l - d;
  const y = Math.max(0, Math.min(m, Math.max(i, 0))), h = Math.max(0, r.duration);
  if (h === 0) {
    U(e, y);
    return;
  }
  const A = performance.now(), v = (c) => {
    const p = Math.min((c - A) / h, 1), b = vt(p, r.easing), w = s + (y - s) * b;
    U(e, w), p < 1 && requestAnimationFrame(v);
  };
  requestAnimationFrame(v);
}
function wt(e) {
  const t = document.querySelector(e.headerSelector);
  return (t == null ? void 0 : t.offsetHeight) || 0;
}
function U(e, t) {
  if (e === window) {
    window.scrollTo(0, t);
    return;
  }
  e.scrollTop = t;
}
function vt(e, t) {
  return t === "linear" ? e : 0.5 - Math.cos(e * Math.PI) / 2;
}
function V(e) {
  return e === "" || e === "true" || e === "1";
}
function ht(e, t) {
  const r = Number.parseInt(e, 10);
  return Number.isNaN(r) ? t : r;
}
function Dt(e, t = 300) {
  let r = null;
  return function(...o) {
    const s = this;
    clearTimeout(r), r = window.setTimeout(() => {
      e.apply(s, o);
    }, t);
  };
}
function Mt(e, t = 300) {
  let r = !1;
  return function(...o) {
    if (r) return;
    const s = this;
    r = !0, e.apply(s, o), window.setTimeout(() => {
      r = !1;
    }, t);
  };
}
export {
  _t as accordionPlugin,
  At as copyPlugin,
  bt as createWeave,
  Dt as debounce,
  St as fileDropPlugin,
  kt as hideTodayPlugin,
  Et as linkButtonPlugin,
  Lt as modalPlugin,
  It as scrollToPlugin,
  Tt as tabsPlugin,
  Ct as targetButtonPlugin,
  Mt as throttle
};
