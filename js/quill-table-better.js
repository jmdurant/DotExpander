!(function (t, e) { typeof exports === "object" && typeof module === "object" ? module.exports = e(require("quill")) : typeof define === "function" && define.amd ? define(["quill"], e) : typeof exports === "object" ? exports.QuillTableBetter = e(require("quill")) : t.QuillTableBetter = e(t.Quill); }(self, (t => (function () {
    const e = {
            386(t) {
                const e = -1,
                    n = 1,
                    r = 0; function i(t, g, b, m, v) {
                    if (t === g) { return t ? [[r, t]] : []; } if (b != null) {
                        const w = (function (t, e, n) {
                            const r = typeof n === "number" ? { index: n, length: 0 } : n.oldRange,
                                i = typeof n === "number" ? null : n.newRange,
                                s = t.length,
                                o = e.length; if (r.length === 0 && (i === null || i.length === 0)) {
                                const l = r.index,
                                    a = t.slice(0, l),
                                    c = t.slice(l),
                                    u = i ? i.index : null,
                                    h = l + o - s; if ((u === null || u === h) && !(h < 0 || h > o)) { var d = e.slice(0, h); if ((g = e.slice(h)) === c) { var p = Math.min(l, h); if ((m = a.slice(0, p)) === (w = d.slice(0, p))) { return y(m, a.slice(p), d.slice(p), c); } } } if (u === null || u === l) {
                                    var f = l,
                                        g = (d = e.slice(0, f), e.slice(f)); if (d === a) { var b = Math.min(s - f, o - f); if ((v = c.slice(c.length - b)) === (x = g.slice(g.length - b))) { return y(a, c.slice(0, c.length - b), g.slice(0, g.length - b), v); } }
                                }
                            } if (r.length > 0 && i && i.length === 0) {
                                var m = t.slice(0, r.index),
                                    v = t.slice(r.index + r.length); if (!(o < (p = m.length) + (b = v.length))) {
                                    var w = e.slice(0, p),
                                        x = e.slice(o - b); if (m === w && v === x) { return y(m, t.slice(p, s - b), e.slice(p, o - b), v); }
                                }
                            } return null;
                        }(t, g, b)); if (w) { return w; }
                    } let x = o(t, g),
                        k = t.substring(0, x); x = a(t = t.substring(x), g = g.substring(x)); const C = t.substring(t.length - x),
                        _ = (function (t, l) {
                            let c; if (!t) { return [[n, l]]; } if (!l) { return [[e, t]]; } const u = t.length > l.length ? t : l,
                                h = t.length > l.length ? l : t,
                                d = u.indexOf(h); if (d !== -1) { return c = [[n, u.substring(0, d)], [r, h], [n, u.substring(d + h.length)]], t.length > l.length && (c[0][0] = c[2][0] = e), c; } if (h.length === 1) { return [[e, t], [n, l]]; } const p = (function (t, e) {
 const n = t.length > e.length ? t : e,
                                r = t.length > e.length ? e : t; if (n.length < 4 || 2 * r.length < n.length) { return null; } function i(t, e, n) {
 for (var r, i, s, l, c = t.substring(n, n + Math.floor(t.length / 4)), u = -1, h = ""; (u = e.indexOf(c, u + 1)) !== -1;) {
 const d = o(t.substring(n), e.substring(u)),
                                p = a(t.substring(0, n), e.substring(0, u)); h.length < p + d && (h = e.substring(u - p, u) + e.substring(u, u + d), r = t.substring(0, n - p), i = t.substring(n + d), s = e.substring(0, u - p), l = e.substring(u + d)); 
} return 2 * h.length >= t.length ? [r, i, s, l, h] : null; 
} let s,
                                l,
                                c,
                                u,
                                h,
                                d = i(n, r, Math.ceil(n.length / 4)),
                                p = i(n, r, Math.ceil(n.length / 2)); return d || p ? (s = p ? d && d[4].length > p[4].length ? d : p : d, t.length > e.length ? (l = s[0], c = s[1], u = s[2], h = s[3]) : (u = s[0], h = s[1], l = s[2], c = s[3]), [l, c, u, h, s[4]]) : null; 
}(t, l)); if (p) {
                                const f = p[0],
                                    g = p[1],
                                    b = p[2],
                                    m = p[3],
                                    v = p[4],
                                    y = i(f, b),
                                    w = i(g, m); return y.concat([[r, v]], w);
                            } return (function (t, r) { for (var i = t.length, o = r.length, l = Math.ceil((i + o) / 2), a = l, c = 2 * l, u = new Array(c), h = new Array(c), d = 0; d < c; d++) { u[d] = -1, h[d] = -1; }u[a + 1] = 0, h[a + 1] = 0; for (let p = i - o, f = p % 2 != 0, g = 0, b = 0, m = 0, v = 0, y = 0; y < l; y++) { for (let w = -y + g; w <= y - b; w += 2) { for (var x = a + w, k = (A = w === -y || w !== y && u[x - 1] < u[x + 1] ? u[x + 1] : u[x - 1] + 1) - w; A < i && k < o && t.charAt(A) === r.charAt(k);) { A++, k++; } if (u[x] = A, A > i) { b += 2; } else if (k > o) { g += 2; } else if (f && (T = a + p - w) >= 0 && T < c && h[T] !== -1 && A >= (_ = i - h[T])) { return s(t, r, A, k) } } for (let C = -y + m; C <= y - v; C += 2) { for (var _, T = a + C, N = (_ = C === -y || C !== y && h[T - 1] < h[T + 1] ? h[T + 1] : h[T - 1] + 1) - C; _ < i && N < o && t.charAt(i - _ - 1) === r.charAt(o - N - 1);) { _++, N++; } if (h[T] = _, _ > i) { v += 2; } else if (N > o) { m += 2; } else if (!f) { var A; if ((x = a + p - C) >= 0 && x < c && u[x] !== -1) { if (k = a + (A = u[x]) - x, A >= (_ = i - _)) {return s(t, r, A, k)}} } } } return [[e, t], [n, r]]; }(t, l));
                        }(t = t.substring(0, t.length - x), g = g.substring(0, g.length - x))); return k && _.unshift([r, k]), C && _.push([r, C]), f(_, v), m && (function (t) {
                        for (var i = !1, s = [], o = 0, g = null, b = 0, m = 0, v = 0, y = 0, w = 0; b < t.length;) { t[b][0] == r ? (s[o++] = b, m = y, v = w, y = 0, w = 0, g = t[b][1]) : (t[b][0] == n ? y += t[b][1].length : w += t[b][1].length, g && g.length <= Math.max(m, v) && g.length <= Math.max(y, w) && (t.splice(s[o - 1], 0, [e, g]), t[s[o - 1] + 1][0] = n, o--, b = --o > 0 ? s[o - 1] : -1, m = 0, v = 0, y = 0, w = 0, g = null, i = !0)), b++; } for (i && f(t), (function (t) {
 function e(t, e) {
 if (!t || !e) { return 6; } const n = t.charAt(t.length - 1),
                            r = e.charAt(0),
                            i = n.match(c),
                            s = r.match(c),
                            o = i && n.match(u),
                            l = s && r.match(u),
                            a = o && n.match(h),
                            f = l && r.match(h),
                            g = a && t.match(d),
                            b = f && e.match(p); return g || b ? 5 : a || f ? 4 : i && !o && l ? 3 : o || l ? 2 : i || s ? 1 : 0; 
} for (let n = 1; n < t.length - 1;) {
 if (t[n - 1][0] == r && t[n + 1][0] == r) {
 let i = t[n - 1][1],
                            s = t[n][1],
                            o = t[n + 1][1],
                            l = a(i, s); if (l) { const f = s.substring(s.length - l); i = i.substring(0, i.length - l), s = f + s.substring(0, s.length - l), o = f + o; } for (var g = i, b = s, m = o, v = e(i, s) + e(s, o); s.charAt(0) === o.charAt(0);) { i += s.charAt(0), s = s.substring(1) + o.charAt(0), o = o.substring(1); const y = e(i, s) + e(s, o); y >= v && (v = y, g = i, b = s, m = o); }t[n - 1][1] != g && (g ? t[n - 1][1] = g : (t.splice(n - 1, 1), n--), t[n][1] = b, m ? t[n + 1][1] = m : (t.splice(n + 1, 1), n--)); 
}n++; 
} 
}(t)), b = 1; b < t.length;) {
                            if (t[b - 1][0] == e && t[b][0] == n) {
                                const x = t[b - 1][1],
                                    k = t[b][1],
                                    C = l(x, k),
                                    _ = l(k, x); C >= _ ? (C >= x.length / 2 || C >= k.length / 2) && (t.splice(b, 0, [r, k.substring(0, C)]), t[b - 1][1] = x.substring(0, x.length - C), t[b + 1][1] = k.substring(C), b++) : (_ >= x.length / 2 || _ >= k.length / 2) && (t.splice(b, 0, [r, x.substring(0, _)]), t[b - 1][0] = n, t[b - 1][1] = k.substring(0, k.length - _), t[b + 1][0] = e, t[b + 1][1] = x.substring(_), b++), b++;
                            }b++;
                        }
                    }(_)), _;
                } function s(t, e, n, r) {
                    const s = t.substring(0, n),
                        o = e.substring(0, r),
                        l = t.substring(n),
                        a = e.substring(r),
                        c = i(s, o),
                        u = i(l, a); return c.concat(u);
                } function o(t, e) { if (!t || !e || t.charAt(0) !== e.charAt(0)) { return 0; } for (var n = 0, r = Math.min(t.length, e.length), i = r, s = 0; n < i;) { t.substring(s, i) == e.substring(s, i) ? s = n = i : r = i, i = Math.floor((r - n) / 2 + n); } return g(t.charCodeAt(i - 1)) && i--, i; } function l(t, e) {
                    const n = t.length,
                        r = e.length; if (n == 0 || r == 0) { return 0; } n > r ? t = t.substring(n - r) : n < r && (e = e.substring(0, n)); const i = Math.min(n, r); if (t == e) { return i; } for (let s = 0, o = 1; ;) {
                        const l = t.substring(i - o),
                            a = e.indexOf(l); if (a == -1) { return s; } o += a, a != 0 && t.substring(i - o) != e.substring(0, o) || (s = o, o++);
                    }
                } function a(t, e) { if (!t || !e || t.slice(-1) !== e.slice(-1)) { return 0; } for (var n = 0, r = Math.min(t.length, e.length), i = r, s = 0; n < i;) { t.substring(t.length - i, t.length - s) == e.substring(e.length - i, e.length - s) ? s = n = i : r = i, i = Math.floor((r - n) / 2 + n); } return b(t.charCodeAt(t.length - i)) && i--, i; } var c = /[^a-zA-Z0-9]/,
                    u = /\s/,
                    h = /[\r\n]/,
                    d = /\n\r?\n$/,
                    p = /^\r?\n\r?\n/; function f(t, i) { t.push([r, ""]); for (var s, l = 0, c = 0, u = 0, h = "", d = ""; l < t.length;) { if (l < t.length - 1 && !t[l][1]) { t.splice(l, 1); } else { switch (t[l][0]) { case n: u++, d += t[l][1], l++; break; case e: c++, h += t[l][1], l++; break; case r: var p = l - u - c - 1; if (i) { if (p >= 0 && v(t[p][1])) { var g = t[p][1].slice(-1); if (t[p][1] = t[p][1].slice(0, -1), h = g + h, d = g + d, !t[p][1]) { t.splice(p, 1), l--; let b = p - 1; t[b] && t[b][0] === n && (u++, d = t[b][1] + d, b--), t[b] && t[b][0] === e && (c++, h = t[b][1] + h, b--), p = b; } }m(t[l][1]) && (g = t[l][1].charAt(0), t[l][1] = t[l][1].slice(1), h += g, d += g); } if (l < t.length - 1 && !t[l][1]) { t.splice(l, 1); break; } if (h.length > 0 || d.length > 0) { h.length > 0 && d.length > 0 && ((s = o(d, h)) !== 0 && (p >= 0 ? t[p][1] += d.substring(0, s) : (t.splice(0, 0, [r, d.substring(0, s)]), l++), d = d.substring(s), h = h.substring(s)), (s = a(d, h)) !== 0 && (t[l][1] = d.substring(d.length - s) + t[l][1], d = d.substring(0, d.length - s), h = h.substring(0, h.length - s))); const y = u + c; h.length === 0 && d.length === 0 ? (t.splice(l - y, y), l -= y) : h.length === 0 ? (t.splice(l - y, y, [n, d]), l = l - y + 1) : d.length === 0 ? (t.splice(l - y, y, [e, h]), l = l - y + 1) : (t.splice(l - y, y, [e, h], [n, d]), l = l - y + 2); }l !== 0 && t[l - 1][0] === r ? (t[l - 1][1] += t[l][1], t.splice(l, 1)) : l++, u = 0, c = 0, h = "", d = ""; } } }t[t.length - 1][1] === "" && t.pop(); let w = !1; for (l = 1; l < t.length - 1;) { t[l - 1][0] === r && t[l + 1][0] === r && (t[l][1].substring(t[l][1].length - t[l - 1][1].length) === t[l - 1][1] ? (t[l][1] = t[l - 1][1] + t[l][1].substring(0, t[l][1].length - t[l - 1][1].length), t[l + 1][1] = t[l - 1][1] + t[l + 1][1], t.splice(l - 1, 1), w = !0) : t[l][1].substring(0, t[l + 1][1].length) == t[l + 1][1] && (t[l - 1][1] += t[l + 1][1], t[l][1] = t[l][1].substring(t[l + 1][1].length) + t[l + 1][1], t.splice(l + 1, 1), w = !0)), l++; }w && f(t, i); } function g(t) { return t >= 55296 && t <= 56319; } function b(t) { return t >= 56320 && t <= 57343; } function m(t) { return b(t.charCodeAt(0)); } function v(t) { return g(t.charCodeAt(t.length - 1)); } function y(t, i, s, o) { return v(t) || m(o) ? null : (function (t) { for (var e = [], n = 0; n < t.length; n++) { t[n][1].length > 0 && e.push(t[n]); } return e; }([[r, t], [e, i], [n, s], [r, o]])); } function w(t, e, n, r) { return i(t, e, n, r, !0); }w.INSERT = n, w.DELETE = e, w.EQUAL = r, t.exports = w;
            },
            861(t, e, n) {
                t = n.nmd(t); const r = "__lodash_hash_undefined__",
                    i = 9007199254740991,
                    s = "[object Arguments]",
                    o = "[object Boolean]",
                    l = "[object Date]",
                    a = "[object Function]",
                    c = "[object GeneratorFunction]",
                    u = "[object Map]",
                    h = "[object Number]",
                    d = "[object Object]",
                    p = "[object Promise]",
                    f = "[object RegExp]",
                    g = "[object Set]",
                    b = "[object String]",
                    m = "[object Symbol]",
                    v = "[object WeakMap]",
                    y = "[object ArrayBuffer]",
                    w = "[object DataView]",
                    x = "[object Float32Array]",
                    k = "[object Float64Array]",
                    C = "[object Int8Array]",
                    _ = "[object Int16Array]",
                    T = "[object Int32Array]",
                    N = "[object Uint8Array]",
                    A = "[object Uint8ClampedArray]",
                    L = "[object Uint16Array]",
                    S = "[object Uint32Array]",
                    E = /\w*$/,
                    j = /^\[object .+?Constructor\]$/,
                    q = /^(?:0|[1-9]\d*)$/,
                    M = {}; M[s] = M["[object Array]"] = M[y] = M[w] = M[o] = M[l] = M[x] = M[k] = M[C] = M[_] = M[T] = M[u] = M[h] = M[d] = M[f] = M[g] = M[b] = M[m] = M[N] = M[A] = M[L] = M[S] = !0, M["[object Error]"] = M[a] = M[v] = !1; const B = typeof n.g === "object" && n.g && n.g.Object === Object && n.g,
                    O = typeof self === "object" && self && self.Object === Object && self,
                    R = B || O || Function("return this")(),
                    P = e && !e.nodeType && e,
                    I = P && t && !t.nodeType && t,
                    D = I && I.exports === P; function z(t, e) { return t.set(e[0], e[1]), t; } function H(t, e) { return t.add(e), t; } function F(t, e, n, r) {
                    let i = -1,
                        s = t ? t.length : 0; for (r && s && (n = t[++i]); ++i < s;) { n = e(n, t[i], i, t); } return n;
                } function V(t) { let e = !1; if (t != null && typeof t.toString !== "function") { try { e = !!(`${t}`); } catch (t) {} } return e; } function U(t) {
                    let e = -1,
                        n = Array(t.size); return t.forEach(((t, r) => { n[++e] = [r, t]; })), n;
                } function W(t, e) { return function (n) { return t(e(n)); }; } function $(t) {
                    const e = -1,
                        n = Array(t.size); return t.forEach(((t) => { n[++e] = t; })), n;
                } let G,
                    K = Array.prototype,
                    Y = Function.prototype,
                    Z = Object.prototype,
                    X = R["__core-js_shared__"],
                    J = (G = /[^.]+$/.exec(X && X.keys && X.keys.IE_PROTO || "")) ? `Symbol(src)_1.${G}` : "",
                    Q = Y.toString,
                    tt = Z.hasOwnProperty,
                    et = Z.toString,
                    nt = RegExp(`^${Q.call(tt).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?")}$`),
                    rt = D ? R.Buffer : void 0,
                    it = R.Symbol,
                    st = R.Uint8Array,
                    ot = W(Object.getPrototypeOf, Object),
                    lt = Object.create,
                    at = Z.propertyIsEnumerable,
                    ct = K.splice,
                    ut = Object.getOwnPropertySymbols,
                    ht = rt ? rt.isBuffer : void 0,
                    dt = W(Object.keys, Object),
                    pt = Rt(R, "DataView"),
                    ft = Rt(R, "Map"),
                    gt = Rt(R, "Promise"),
                    bt = Rt(R, "Set"),
                    mt = Rt(R, "WeakMap"),
                    vt = Rt(Object, "create"),
                    yt = Ht(pt),
                    wt = Ht(ft),
                    xt = Ht(gt),
                    kt = Ht(bt),
                    Ct = Ht(mt),
                    _t = it ? it.prototype : void 0,
                    Tt = _t ? _t.valueOf : void 0; function Nt(t) {
                    let e = -1,
                        n = t ? t.length : 0; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function At(t) {
                    let e = -1,
                        n = t ? t.length : 0; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function Lt(t) {
                    let e = -1,
                        n = t ? t.length : 0; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function St(t) { this.__data__ = new At(t); } function Et(t, e, n) { const r = t[e]; tt.call(t, e) && Ft(r, n) && (void 0 !== n || e in t) || (t[e] = n); } function jt(t, e) { for (let n = t.length; n--;) { if (Ft(t[n][0], e)) { return n; } } return -1; } function qt(t, e, n, r, i, p, v) {
                    let j; if (r && (j = p ? r(t, i, p, v) : r(t)), void 0 !== j) { return j; } if (!Gt(t)) { return t; } const q = Vt(t); if (q) {
                        if (j = (function (t) {
                            let e = t.length,
                                n = t.constructor(e); return e && typeof t[0] === "string" && tt.call(t, "index") && (n.index = t.index, n.input = t.input), n;
                        }(t)), !e) {
 return (function (t, e) {
 let n = -1,
                            r = t.length; for (e || (e = Array(r)); ++n < r;) { e[n] = t[n]; } return e; 
}(t, j)); 
}
                    } else {
                        const B = It(t),
                            O = B == a || B == c; if (Wt(t)) { return (function (t, e) { if (e) { return t.slice(); } const n = new t.constructor(t.length); return t.copy(n), n; }(t, e)); } if (B == d || B == s || O && !p) { if (V(t)) { return p ? t : {}; } if (j = (function (t) { return typeof t.constructor !== "function" || zt(t) ? {} : Gt(e = ot(t)) ? lt(e) : {}; let e; }(O ? {} : t)), !e) { return (function (t, e) { return Bt(t, Pt(t), e); }(t, (function (t, e) { return t && Bt(e, Kt(e), t); }(j, t)))); } } else {
                            if (!M[B]) { return p ? t : {}; } j = (function (t, e, n, r) {
                                let i,
                                    s = t.constructor; switch (e) { case y: return Mt(t); case o: case l: return new s(+t); case w: return (function (t, e) { const n = e ? Mt(t.buffer) : t.buffer; return new t.constructor(n, t.byteOffset, t.byteLength); }(t, r)); case x: case k: case C: case _: case T: case N: case A: case L: case S: return (function (t, e) { const n = e ? Mt(t.buffer) : t.buffer; return new t.constructor(n, t.byteOffset, t.length); }(t, r)); case u: return (function (t, e, n) { return F(e ? n(U(t), !0) : U(t), z, new t.constructor()); }(t, r, n)); case h: case b: return new s(t); case f: return (function (t) { const e = new t.constructor(t.source, E.exec(t)); return e.lastIndex = t.lastIndex, e; }(t)); case g: return (function (t, e, n) { return F(e ? n($(t), !0) : $(t), H, new t.constructor()); }(t, r, n)); case m: return i = t, Tt ? Object(Tt.call(i)) : {}; }
                            }(t, B, qt, e));
                        }
                    }v || (v = new St()); const R = v.get(t); if (R) { return R; } if (v.set(t, j), !q) { var P = n ? (function (t) { return (function (t, e, n) { let r = e(t); return Vt(t) ? r : (function (t, e) { for (let n = -1, r = e.length, i = t.length; ++n < r;){t[i+n]=e[n];}return t }(r, n(t))) }(t, Kt, Pt)); }(t)) : Kt(t); } return (function (t, e) { for (let n = -1, r = t ? t.length : 0; ++n < r && !1 !== e(t[n], n);) { } }(P || t, ((i, s) => { P && (i = t[s = i]), Et(j, s, qt(i, e, n, r, s, t, v)); }))), j;
                } function Mt(t) { const e = new t.constructor(t.byteLength); return new st(e).set(new st(t)), e; } function Bt(t, e, n, r) {
                    n || (n = {}); for (let i = -1, s = e.length; ++i < s;) {
                        const o = e[i],
                            l = r ? r(n[o], t[o], o, n, t) : void 0; Et(n, o, void 0 === l ? t[o] : l);
                    } return n;
                } function Ot(t, e) {
                    let n,
                        r,
                        i = t.__data__; return ((r = typeof (n = e)) == "string" || r == "number" || r == "symbol" || r == "boolean" ? n !== "__proto__" : n === null) ? i[typeof e === "string" ? "string" : "hash"] : i.map;
                } function Rt(t, e) { const n = (function (t, e) { return t == null ? void 0 : t[e]; }(t, e)); return (function (t) { return !(!Gt(t) || (e = t, J && J in e)) && ($t(t) || V(t) ? nt : j).test(Ht(t)); let e; }(n)) ? n : void 0; }Nt.prototype.clear = function () { this.__data__ = vt ? vt(null) : {}; }, Nt.prototype.delete = function (t) { return this.has(t) && delete this.__data__[t]; }, Nt.prototype.get = function (t) { const e = this.__data__; if (vt) { const n = e[t]; return n === r ? void 0 : n; } return tt.call(e, t) ? e[t] : void 0; }, Nt.prototype.has = function (t) { const e = this.__data__; return vt ? void 0 !== e[t] : tt.call(e, t); }, Nt.prototype.set = function (t, e) { return this.__data__[t] = vt && void 0 === e ? r : e, this; }, At.prototype.clear = function () { this.__data__ = []; }, At.prototype.delete = function (t) {
                    const e = this.__data__,
                        n = jt(e, t); return !(n < 0 || (n == e.length - 1 ? e.pop() : ct.call(e, n, 1), 0));
                }, At.prototype.get = function (t) {
                    const e = this.__data__,
                        n = jt(e, t); return n < 0 ? void 0 : e[n][1];
                }, At.prototype.has = function (t) { return jt(this.__data__, t) > -1; }, At.prototype.set = function (t, e) {
                    const n = this.__data__,
                        r = jt(n, t); return r < 0 ? n.push([t, e]) : n[r][1] = e, this;
                }, Lt.prototype.clear = function () { this.__data__ = { hash: new Nt(), map: new (ft || At)(), string: new Nt() }; }, Lt.prototype.delete = function (t) { return Ot(this, t).delete(t); }, Lt.prototype.get = function (t) { return Ot(this, t).get(t); }, Lt.prototype.has = function (t) { return Ot(this, t).has(t); }, Lt.prototype.set = function (t, e) { return Ot(this, t).set(t, e), this; }, St.prototype.clear = function () { this.__data__ = new At(); }, St.prototype.delete = function (t) { return this.__data__.delete(t); }, St.prototype.get = function (t) { return this.__data__.get(t); }, St.prototype.has = function (t) { return this.__data__.has(t); }, St.prototype.set = function (t, e) { let n = this.__data__; if (n instanceof At) { const r = n.__data__; if (!ft || r.length < 199) { return r.push([t, e]), this; } n = this.__data__ = new Lt(r); } return n.set(t, e), this; }; var Pt = ut ? W(ut, Object) : function () { return []; },
                    It = function (t) { return et.call(t); }; function Dt(t, e) { return !!(e = e == null ? i : e) && (typeof t === "number" || q.test(t)) && t > -1 && t % 1 == 0 && t < e; } function zt(t) { const e = t && t.constructor; return t === (typeof e === "function" && e.prototype || Z); } function Ht(t) { if (t != null) { try { return Q.call(t); } catch (t) {} try { return `${t}`; } catch (t) {} } return ""; } function Ft(t, e) { return t === e || t != t && e != e; }(pt && It(new pt(new ArrayBuffer(1))) != w || ft && It(new ft()) != u || gt && It(gt.resolve()) != p || bt && It(new bt()) != g || mt && It(new mt()) != v) && (It = function (t) {
                    const e = et.call(t),
                        n = e == d ? t.constructor : void 0,
                        r = n ? Ht(n) : void 0; if (r) { switch (r) { case yt: return w; case wt: return u; case xt: return p; case kt: return g; case Ct: return v; } } return e;
                }); var Vt = Array.isArray; function Ut(t) { return t != null && (function (t) { return typeof t === "number" && t > -1 && t % 1 == 0 && t <= i; }(t.length)) && !$t(t); } var Wt = ht || function () { return !1; }; function $t(t) { const e = Gt(t) ? et.call(t) : ""; return e == a || e == c; } function Gt(t) { const e = typeof t; return !!t && (e == "object" || e == "function"); } function Kt(t) {
                    return Ut(t) ? (function (t, e) {
                        const n = Vt(t) || (function (t) { return (function (t) { return (function (t) { return !!t && "object"===typeof t }(t)) && Ut(t); }(t)) && tt.call(t, "callee") && (!at.call(t, "callee") || et.call(t) == s); }(t)) ? (function (t, e) { for (var n = -1, r = Array(t); ++n < t;) { r[n] = e(n); } return r; }(t.length, String)) : [],
                            r = n.length,
                            i = !!r; for (const o in t) { !e && !tt.call(t, o) || i && (o == "length" || Dt(o, r)) || n.push(o); } return n;
                    }(t)) : (function (t) { if (!zt(t)) { return dt(t); } const e = []; for (const n in Object(t)) { tt.call(t, n) && n != "constructor" && e.push(n); } return e; }(t));
                }t.exports = function (t) { return qt(t, !0, !0); };
            },
            842(t, e, n) {
                t = n.nmd(t); const r = "__lodash_hash_undefined__",
                    i = 1,
                    s = 2,
                    o = 9007199254740991,
                    l = "[object Arguments]",
                    a = "[object Array]",
                    c = "[object AsyncFunction]",
                    u = "[object Boolean]",
                    h = "[object Date]",
                    d = "[object Error]",
                    p = "[object Function]",
                    f = "[object GeneratorFunction]",
                    g = "[object Map]",
                    b = "[object Number]",
                    m = "[object Null]",
                    v = "[object Object]",
                    y = "[object Promise]",
                    w = "[object Proxy]",
                    x = "[object RegExp]",
                    k = "[object Set]",
                    C = "[object String]",
                    _ = "[object Undefined]",
                    T = "[object WeakMap]",
                    N = "[object ArrayBuffer]",
                    A = "[object DataView]",
                    L = /^\[object .+?Constructor\]$/,
                    S = /^(?:0|[1-9]\d*)$/,
                    E = {}; E["[object Float32Array]"] = E["[object Float64Array]"] = E["[object Int8Array]"] = E["[object Int16Array]"] = E["[object Int32Array]"] = E["[object Uint8Array]"] = E["[object Uint8ClampedArray]"] = E["[object Uint16Array]"] = E["[object Uint32Array]"] = !0, E[l] = E[a] = E[N] = E[u] = E[A] = E[h] = E[d] = E[p] = E[g] = E[b] = E[v] = E[x] = E[k] = E[C] = E[T] = !1; const j = typeof n.g === "object" && n.g && n.g.Object === Object && n.g,
                    q = typeof self === "object" && self && self.Object === Object && self,
                    M = j || q || Function("return this")(),
                    B = e && !e.nodeType && e,
                    O = B && t && !t.nodeType && t,
                    R = O && O.exports === B,
                    P = R && j.process,
                    I = (function () { try { return P && P.binding && P.binding("util"); } catch (t) {} }()),
                    D = I && I.isTypedArray; function z(t, e) { for (let n = -1, r = t == null ? 0 : t.length; ++n < r;) { if (e(t[n], n, t)) { return !0; } } return !1; } function H(t) {
                    let e = -1,
                        n = Array(t.size); return t.forEach(((t, r) => { n[++e] = [r, t]; })), n;
                } function F(t) {
                    const e = -1,
                        n = Array(t.size); return t.forEach(((t) => { n[++e] = t; })), n;
                } let V,
                    U,
                    W,
                    $ = Array.prototype,
                    G = Function.prototype,
                    K = Object.prototype,
                    Y = M["__core-js_shared__"],
                    Z = G.toString,
                    X = K.hasOwnProperty,
                    J = (V = /[^.]+$/.exec(Y && Y.keys && Y.keys.IE_PROTO || "")) ? `Symbol(src)_1.${V}` : "",
                    Q = K.toString,
                    tt = RegExp(`^${Z.call(X).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?")}$`),
                    et = R ? M.Buffer : void 0,
                    nt = M.Symbol,
                    rt = M.Uint8Array,
                    it = K.propertyIsEnumerable,
                    st = $.splice,
                    ot = nt ? nt.toStringTag : void 0,
                    lt = Object.getOwnPropertySymbols,
                    at = et ? et.isBuffer : void 0,
                    ct = (U = Object.keys, W = Object, function (t) { return U(W(t)); }),
                    ut = Ot(M, "DataView"),
                    ht = Ot(M, "Map"),
                    dt = Ot(M, "Promise"),
                    pt = Ot(M, "Set"),
                    ft = Ot(M, "WeakMap"),
                    gt = Ot(Object, "create"),
                    bt = Dt(ut),
                    mt = Dt(ht),
                    vt = Dt(dt),
                    yt = Dt(pt),
                    wt = Dt(ft),
                    xt = nt ? nt.prototype : void 0,
                    kt = xt ? xt.valueOf : void 0; function Ct(t) {
                    let e = -1,
                        n = t == null ? 0 : t.length; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function _t(t) {
                    let e = -1,
                        n = t == null ? 0 : t.length; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function Tt(t) {
                    let e = -1,
                        n = t == null ? 0 : t.length; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function Nt(t) {
                    let e = -1,
                        n = t == null ? 0 : t.length; for (this.__data__ = new Tt(); ++e < n;) { this.add(t[e]); }
                } function At(t) { const e = this.__data__ = new _t(t); this.size = e.size; } function Lt(t, e) { for (let n = t.length; n--;) { if (zt(t[n][0], e)) { return n; } } return -1; } function St(t) {
                    return t == null ? void 0 === t ? _ : m : ot && ot in Object(t) ? (function (t) {
                        let e = X.call(t, ot),
                            n = t[ot]; try { t[ot] = void 0; var r = !0; } catch (t) {} const i = Q.call(t); return r && (e ? t[ot] = n : delete t[ot]), i;
                    }(t)) : (function (t) { return Q.call(t); }(t));
                } function Et(t) { return Gt(t) && St(t) == l; } function jt(t, e, n, r, o) {
                    return t === e || (t == null || e == null || !Gt(t) && !Gt(e) ? t != t && e != e : (function (t, e, n, r, o, c) {
                        let p = Ft(t),
                            f = Ft(e),
                            m = p ? a : Pt(t),
                            y = f ? a : Pt(e),
                            w = (m = m == l ? v : m) == v,
                            _ = (y = y == l ? v : y) == v,
                            T = m == y; if (T && Vt(t)) { if (!Vt(e)) { return !1; } p = !0, w = !1; } if (T && !w) { return c || (c = new At()), p || Kt(t) ? qt(t, e, n, r, o, c) : (function (t, e, n, r, o, l, a) { switch (n) { case A: if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) {return !1;} t = t.buffer, e = e.buffer; case N: return !(t.byteLength != e.byteLength || !l(new rt(t), new rt(e))); case u: case h: case b: return zt(+t, +e); case d: return t.name == e.name && t.message == e.message; case x: case C: return t == `${e  }`; case g: var c = H; case k: var p = r & i; if (c || (c = F), t.size != e.size && !p) {return !1;} var f = a.get(t); if (f) {return f == e;} r |= s, a.set(t, e); var m = qt(c(t), c(e), r, o, l, a); return a.delete(t), m; case "[object Symbol]": if (kt) {return kt.call(t) == kt.call(e)} } return !1; }(t, e, m, n, r, o, c)); } if (!(n & i)) {
                            const L = w && X.call(t, "__wrapped__"),
                                S = _ && X.call(e, "__wrapped__"); if (L || S) {
                                const E = L ? t.value() : t,
                                    j = S ? e.value() : e; return c || (c = new At()), o(E, j, n, r, c);
                            }
                        } return !!T && (c || (c = new At()), (function (t, e, n, r, s, o) {
 const l = n & i,
                            a = Mt(t),
                            c = a.length; if (c != Mt(e).length && !l) { return !1; } for (var u = c; u--;) { var h = a[u]; if (!(l ? h in e : X.call(e, h))) { return !1 } } const d = o.get(t); if (d && o.get(e)) { return d == e; } let p = !0; o.set(t, e), o.set(e, t); for (var f = l; ++u < c;) {
 const g = t[h = a[u]],
                            b = e[h]; if (r) { var m = l ? r(b, g, h, e, t, o) : r(g, b, h, t, e, o); } if (!(void 0 === m ? g === b || s(g, b, n, r, o) : m)) { p = !1; break; }f || (f = h == "constructor"); 
} if (p && !f) {
 const v = t.constructor,
                            y = e.constructor; v == y || !("constructor" in t) || !("constructor" in e) || typeof v === "function" && v instanceof v && typeof y === "function" && y instanceof y || (p = !1); 
} return o.delete(t), o.delete(e), p; 
}(t, e, n, r, o, c)));
                    }(t, e, n, r, jt, o)));
                } function qt(t, e, n, r, o, l) {
                    const a = n & i,
                        c = t.length,
                        u = e.length; if (c != u && !(a && u > c)) { return !1; } const h = l.get(t); if (h && l.get(e)) { return h == e; } let d = -1,
                        p = !0,
                        f = n & s ? new Nt() : void 0; for (l.set(t, e), l.set(e, t); ++d < c;) {
                        var g = t[d],
                            b = e[d]; if (r) { var m = a ? r(b, g, d, e, t, l) : r(g, b, d, t, e, l); } if (void 0 !== m) { if (m) { continue; } p = !1; break; } if (f) { if (!z(e, ((t, e) => { if (i = e, !f.has(i) && (g === t || o(g, t, n, r, l))) { return f.push(e); } let i; }))) { p = !1; break; } } else if (g !== b && !o(g, b, n, r, l)) { p = !1; break; }
                    } return l.delete(t), l.delete(e), p;
                } function Mt(t) { return (function (t, e, n) { const r = e(t); return Ft(t) ? r : (function (t, e) { for (let n = -1, r = e.length, i = t.length; ++n < r;) { t[i + n] = e[n]; } return t; }(r, n(t))); }(t, Yt, Rt)); } function Bt(t, e) {
                    let n,
                        r,
                        i = t.__data__; return ((r = typeof (n = e)) == "string" || r == "number" || r == "symbol" || r == "boolean" ? n !== "__proto__" : n === null) ? i[typeof e === "string" ? "string" : "hash"] : i.map;
                } function Ot(t, e) { const n = (function (t, e) { return t == null ? void 0 : t[e]; }(t, e)); return (function (t) { return !(!$t(t) || (function (t) { return !!J && J in t; }(t))) && (Ut(t) ? tt : L).test(Dt(t)); }(n)) ? n : void 0; }Ct.prototype.clear = function () { this.__data__ = gt ? gt(null) : {}, this.size = 0; }, Ct.prototype.delete = function (t) { const e = this.has(t) && delete this.__data__[t]; return this.size -= e ? 1 : 0, e; }, Ct.prototype.get = function (t) { const e = this.__data__; if (gt) { const n = e[t]; return n === r ? void 0 : n; } return X.call(e, t) ? e[t] : void 0; }, Ct.prototype.has = function (t) { const e = this.__data__; return gt ? void 0 !== e[t] : X.call(e, t); }, Ct.prototype.set = function (t, e) { const n = this.__data__; return this.size += this.has(t) ? 0 : 1, n[t] = gt && void 0 === e ? r : e, this; }, _t.prototype.clear = function () { this.__data__ = [], this.size = 0; }, _t.prototype.delete = function (t) {
                    const e = this.__data__,
                        n = Lt(e, t); return !(n < 0 || (n == e.length - 1 ? e.pop() : st.call(e, n, 1), --this.size, 0));
                }, _t.prototype.get = function (t) {
                    const e = this.__data__,
                        n = Lt(e, t); return n < 0 ? void 0 : e[n][1];
                }, _t.prototype.has = function (t) { return Lt(this.__data__, t) > -1; }, _t.prototype.set = function (t, e) {
                    const n = this.__data__,
                        r = Lt(n, t); return r < 0 ? (++this.size, n.push([t, e])) : n[r][1] = e, this;
                }, Tt.prototype.clear = function () { this.size = 0, this.__data__ = { hash: new Ct(), map: new (ht || _t)(), string: new Ct() }; }, Tt.prototype.delete = function (t) { const e = Bt(this, t).delete(t); return this.size -= e ? 1 : 0, e; }, Tt.prototype.get = function (t) { return Bt(this, t).get(t); }, Tt.prototype.has = function (t) { return Bt(this, t).has(t); }, Tt.prototype.set = function (t, e) {
                    const n = Bt(this, t),
                        r = n.size; return n.set(t, e), this.size += n.size == r ? 0 : 1, this;
                }, Nt.prototype.add = Nt.prototype.push = function (t) { return this.__data__.set(t, r), this; }, Nt.prototype.has = function (t) { return this.__data__.has(t); }, At.prototype.clear = function () { this.__data__ = new _t(), this.size = 0; }, At.prototype.delete = function (t) {
                    const e = this.__data__,
                        n = e.delete(t); return this.size = e.size, n;
                }, At.prototype.get = function (t) { return this.__data__.get(t); }, At.prototype.has = function (t) { return this.__data__.has(t); }, At.prototype.set = function (t, e) { let n = this.__data__; if (n instanceof _t) { const r = n.__data__; if (!ht || r.length < 199) { return r.push([t, e]), this.size = ++n.size, this; } n = this.__data__ = new Tt(r); } return n.set(t, e), this.size = n.size, this; }; var Rt = lt ? function (t) { return t == null ? [] : (t = Object(t), (function (e, n) { for (var r = -1, i = e == null ? 0 : e.length, s = 0, o = []; ++r < i;) { const l = e[r]; a = l, it.call(t, a) && (o[s++] = l); } let a; return o; }(lt(t)))); } : function () { return []; },
                    Pt = St; function It(t, e) { return !!(e = e == null ? o : e) && (typeof t === "number" || S.test(t)) && t > -1 && t % 1 == 0 && t < e; } function Dt(t) { if (t != null) { try { return Z.call(t); } catch (t) {} try { return `${t}`; } catch (t) {} } return ""; } function zt(t, e) { return t === e || t != t && e != e; }(ut && Pt(new ut(new ArrayBuffer(1))) != A || ht && Pt(new ht()) != g || dt && Pt(dt.resolve()) != y || pt && Pt(new pt()) != k || ft && Pt(new ft()) != T) && (Pt = function (t) {
                    const e = St(t),
                        n = e == v ? t.constructor : void 0,
                        r = n ? Dt(n) : ""; if (r) { switch (r) { case bt: return A; case mt: return g; case vt: return y; case yt: return k; case wt: return T; } } return e;
                }); var Ht = Et(function () { return arguments; }()) ? Et : function (t) { return Gt(t) && X.call(t, "callee") && !it.call(t, "callee"); },
                    Ft = Array.isArray,
                    Vt = at || function () { return !1; }; function Ut(t) { if (!$t(t)) { return !1; } const e = St(t); return e == p || e == f || e == c || e == w; } function Wt(t) { return typeof t === "number" && t > -1 && t % 1 == 0 && t <= o; } function $t(t) { const e = typeof t; return t != null && (e == "object" || e == "function"); } function Gt(t) { return t != null && typeof t === "object"; } var Kt = D ? (function (t) { return function (e) { return t(e); }; }(D)) : function (t) { return Gt(t) && Wt(t.length) && !!E[St(t)]; }; function Yt(t) {
                    return (e = t) != null && Wt(e.length) && !Ut(e) ? (function (t, e) {
                        const n = Ft(t),
                            r = !n && Ht(t),
                            i = !n && !r && Vt(t),
                            s = !n && !r && !i && Kt(t),
                            o = n || r || i || s,
                            l = o ? (function (t, e) { for (var n = -1, r = Array(t); ++n < t;) { r[n] = e(n); } return r; }(t.length, String)) : [],
                            a = l.length; for (const c in t) { !e && !X.call(t, c) || o && (c == "length" || i && (c == "offset" || c == "parent") || s && (c == "buffer" || c == "byteLength" || c == "byteOffset") || It(c, a)) || l.push(c); } return l;
                    }(t)) : (function (t) {
                        if (n = (e = t) && e.constructor, e !== (typeof n === "function" && n.prototype || K)) { return ct(t); } let e,
                            n,
                            r = []; for (const i in Object(t)) { X.call(t, i) && i != "constructor" && r.push(i); } return r;
                    }(t)); let e;
                }t.exports = function (t, e) { return jt(t, e); };
            },
            930(t, e, n) {
                t = n.nmd(t); const r = "__lodash_hash_undefined__",
                    i = 9007199254740991,
                    s = "[object Arguments]",
                    o = "[object AsyncFunction]",
                    l = "[object Function]",
                    a = "[object GeneratorFunction]",
                    c = "[object Null]",
                    u = "[object Object]",
                    h = "[object Proxy]",
                    d = "[object Undefined]",
                    p = /^\[object .+?Constructor\]$/,
                    f = /^(?:0|[1-9]\d*)$/,
                    g = {}; g["[object Float32Array]"] = g["[object Float64Array]"] = g["[object Int8Array]"] = g["[object Int16Array]"] = g["[object Int32Array]"] = g["[object Uint8Array]"] = g["[object Uint8ClampedArray]"] = g["[object Uint16Array]"] = g["[object Uint32Array]"] = !0, g[s] = g["[object Array]"] = g["[object ArrayBuffer]"] = g["[object Boolean]"] = g["[object DataView]"] = g["[object Date]"] = g["[object Error]"] = g[l] = g["[object Map]"] = g["[object Number]"] = g[u] = g["[object RegExp]"] = g["[object Set]"] = g["[object String]"] = g["[object WeakMap]"] = !1; let b,
                    m,
                    v,
                    y = typeof n.g === "object" && n.g && n.g.Object === Object && n.g,
                    w = typeof self === "object" && self && self.Object === Object && self,
                    x = y || w || Function("return this")(),
                    k = e && !e.nodeType && e,
                    C = k && t && !t.nodeType && t,
                    _ = C && C.exports === k,
                    T = _ && y.process,
                    N = (function () { try { return C && C.require && C.require("util").types || T && T.binding && T.binding("util"); } catch (t) {} }()),
                    A = N && N.isTypedArray,
                    L = Array.prototype,
                    S = Function.prototype,
                    E = Object.prototype,
                    j = x["__core-js_shared__"],
                    q = S.toString,
                    M = E.hasOwnProperty,
                    B = (b = /[^.]+$/.exec(j && j.keys && j.keys.IE_PROTO || "")) ? `Symbol(src)_1.${b}` : "",
                    O = E.toString,
                    R = q.call(Object),
                    P = RegExp(`^${q.call(M).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?")}$`),
                    I = _ ? x.Buffer : void 0,
                    D = x.Symbol,
                    z = x.Uint8Array,
                    H = (I && I.allocUnsafe, m = Object.getPrototypeOf, v = Object, function (t) { return m(v(t)); }),
                    F = Object.create,
                    V = E.propertyIsEnumerable,
                    U = L.splice,
                    W = D ? D.toStringTag : void 0,
                    $ = (function () { try { const t = dt(Object, "defineProperty"); return t({}, "", {}), t; } catch (t) {} }()),
                    G = I ? I.isBuffer : void 0,
                    K = Math.max,
                    Y = Date.now,
                    Z = dt(x, "Map"),
                    X = dt(Object, "create"),
                    J = (function () { function t() {} return function (e) { if (!_t(e)) { return {}; } if (F) { return F(e); } t.prototype = e; const n = new t(); return t.prototype = void 0, n; }; }()); function Q(t) {
                    let e = -1,
                        n = t == null ? 0 : t.length; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function tt(t) {
                    let e = -1,
                        n = t == null ? 0 : t.length; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function et(t) {
                    let e = -1,
                        n = t == null ? 0 : t.length; for (this.clear(); ++e < n;) { const r = t[e]; this.set(r[0], r[1]); }
                } function nt(t) { const e = this.__data__ = new tt(t); this.size = e.size; } function rt(t, e, n) { (void 0 !== n && !mt(t[e], n) || void 0 === n && !(e in t)) && ot(t, e, n); } function it(t, e, n) { const r = t[e]; M.call(t, e) && mt(r, n) && (void 0 !== n || e in t) || ot(t, e, n); } function st(t, e) { for (let n = t.length; n--;) { if (mt(t[n][0], e)) { return n; } } return -1; } function ot(t, e, n) {
                    e == "__proto__" && $ ? $(t, e, {
                        configurable: !0, enumerable: !0, value: n, writable: !0,
                    }) : t[e] = n;
                }Q.prototype.clear = function () { this.__data__ = X ? X(null) : {}, this.size = 0; }, Q.prototype.delete = function (t) { const e = this.has(t) && delete this.__data__[t]; return this.size -= e ? 1 : 0, e; }, Q.prototype.get = function (t) { const e = this.__data__; if (X) { const n = e[t]; return n === r ? void 0 : n; } return M.call(e, t) ? e[t] : void 0; }, Q.prototype.has = function (t) { const e = this.__data__; return X ? void 0 !== e[t] : M.call(e, t); }, Q.prototype.set = function (t, e) { const n = this.__data__; return this.size += this.has(t) ? 0 : 1, n[t] = X && void 0 === e ? r : e, this; }, tt.prototype.clear = function () { this.__data__ = [], this.size = 0; }, tt.prototype.delete = function (t) {
                    const e = this.__data__,
                        n = st(e, t); return !(n < 0 || (n == e.length - 1 ? e.pop() : U.call(e, n, 1), --this.size, 0));
                }, tt.prototype.get = function (t) {
                    let e = this.__data__,
                        n = st(e, t); return n < 0 ? void 0 : e[n][1];
                }, tt.prototype.has = function (t) { return st(this.__data__, t) > -1; }, tt.prototype.set = function (t, e) {
                    const n = this.__data__,
                        r = st(n, t); return r < 0 ? (++this.size, n.push([t, e])) : n[r][1] = e, this;
                }, et.prototype.clear = function () { this.size = 0, this.__data__ = { hash: new Q(), map: new (Z || tt)(), string: new Q() }; }, et.prototype.delete = function (t) { const e = ht(this, t).delete(t); return this.size -= e ? 1 : 0, e; }, et.prototype.get = function (t) { return ht(this, t).get(t); }, et.prototype.has = function (t) { return ht(this, t).has(t); }, et.prototype.set = function (t, e) {
                    const n = ht(this, t),
                        r = n.size; return n.set(t, e), this.size += n.size == r ? 0 : 1, this;
                }, nt.prototype.clear = function () { this.__data__ = new tt(), this.size = 0; }, nt.prototype.delete = function (t) {
                    const e = this.__data__,
                        n = e.delete(t); return this.size = e.size, n;
                }, nt.prototype.get = function (t) { return this.__data__.get(t); }, nt.prototype.has = function (t) { return this.__data__.has(t); }, nt.prototype.set = function (t, e) { let n = this.__data__; if (n instanceof tt) { const r = n.__data__; if (!Z || r.length < 199) { return r.push([t, e]), this.size = ++n.size, this; } n = this.__data__ = new et(r); } return n.set(t, e), this.size = n.size, this; }; function lt(t) {
                    return t == null ? void 0 === t ? d : c : W && W in Object(t) ? (function (t) {
                        let e = M.call(t, W),
                            n = t[W]; try { t[W] = void 0; var r = !0; } catch (t) {} const i = O.call(t); return r && (e ? t[W] = n : delete t[W]), i;
                    }(t)) : (function (t) { return O.call(t); }(t));
                } function at(t) { return Tt(t) && lt(t) == s; } function ct(t, e, n, r, i) { t !== e && (function (t, e, n) { for (let r = -1, i = Object(t), s = n(t), o = s.length; o--;) { const l = s[++r]; if (!1 === e(i[l], l, i)) { break; } } }(e, ((s, o) => { if (i || (i = new nt()), _t(s)) { !(function (t, e, n, r, i, s, o) { var l = gt(t, n), a = gt(e, n), c = o.get(a); if (c){rt(t,n,c);}else { var h, d, p, f, g, b = s ? s(l, a, n + "", t, e, o):void 0, m = void 0 === b; if (m) { var v = yt(a), y = !v && xt(a), w = !v && !y && Nt(a); b = a, v || y || w ? yt(l) ? b = l:Tt(g = l) && wt(g) ? b = function (t, e) { var n = -1, r = t.length; for (e || (e = Array(r)); ++n < r;){e[n]=t[n];}return e }(l):y ? (m = !1, b = function (t, e) { return t.slice() }(a)):w ? (m = !1, f = new (p = (h = a).buffer).constructor(p.byteLength), new z(f).set(new z(p)), d = f, b = new h.constructor(d, h.byteOffset, h.length)):b = []:(function(t){if(!Tt(t)||lt(t)!=u)return!1;var e=H(t);if(null===e)return!0;var n=M.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&q.call(n)==R}(a))||vt(a) ? (b = l, vt(l) ? b = function (t) { return (function(t,e,n,r){var i=!n;n||(n={});for(var s=-1,o=e.length;++s<o;){var l=e[s],a=void 0;void 0===a&&(a=t[l]),i?ot(n,l,a):it(n,l,a)}return n}(t,At(t)))}(l):_t(l) && !kt(l) || (b = function (t) { return "function"!==typeof t.constructor || ft(t) ? {}:J(H(t)) }(a))):m = !1 }m && (o.set(a, b), i(b, a, r, s, o), o.delete(a)), rt(t, n, b) } }(t, e, o, n, ct, r, i)); } else { let l = r ? r(gt(t, o), s, `${o }`, t, e, i) : void 0; void 0 === l && (l = s), rt(t, o, l); } }), At)); } const ut = $ ? function (t, e) {
                    return $(t, "toString", {
                        configurable: !0, enumerable: !1, value: (n = e, function () { return n; }), writable: !0,
                    }); let n;
                } : Et; function ht(t, e) {
                    let n,
                        r,
                        i = t.__data__; return ((r = typeof (n = e)) == "string" || r == "number" || r == "symbol" || r == "boolean" ? n !== "__proto__" : n === null) ? i[typeof e === "string" ? "string" : "hash"] : i.map;
                } function dt(t, e) { const n = (function (t, e) { return t == null ? void 0 : t[e]; }(t, e)); return (function (t) { return !(!_t(t) || (function (t) { return !!B && B in t; }(t))) && (kt(t) ? P : p).test(function (t) { if (t != null) { try { return q.call(t); } catch (t) {} try { return `${t}`; } catch (t) {} } return ""; }(t)); }(n)) ? n : void 0; } function pt(t, e) { const n = typeof t; return !!(e = e == null ? i : e) && (n == "number" || n != "symbol" && f.test(t)) && t > -1 && t % 1 == 0 && t < e; } function ft(t) { const e = t && t.constructor; return t === (typeof e === "function" && e.prototype || E); } function gt(t, e) { if ((e !== "constructor" || typeof t[e] !== "function") && e != "__proto__") { return t[e]; } } const bt = (function (t) {
                    let e = 0,
                        n = 0; return function () {
                        const r = Y(),
                            i = 16 - (r - n); if (n = r, i > 0) { if (++e >= 800) { return arguments[0]; } } else { e = 0; } return t.apply(void 0, arguments);
                    };
                }(ut)); function mt(t, e) { return t === e || t != t && e != e; } var vt = at(function () { return arguments; }()) ? at : function (t) { return Tt(t) && M.call(t, "callee") && !V.call(t, "callee"); },
                    yt = Array.isArray; function wt(t) { return t != null && Ct(t.length) && !kt(t); } var xt = G || function () { return !1; }; function kt(t) { if (!_t(t)) { return !1; } const e = lt(t); return e == l || e == a || e == o || e == h; } function Ct(t) { return typeof t === "number" && t > -1 && t % 1 == 0 && t <= i; } function _t(t) { const e = typeof t; return t != null && (e == "object" || e == "function"); } function Tt(t) { return t != null && typeof t === "object"; } var Nt = A ? (function (t) { return function (e) { return t(e); }; }(A)) : function (t) { return Tt(t) && Ct(t.length) && !!g[lt(t)]; }; function At(t) {
                    return wt(t) ? (function (t, e) {
                        const n = yt(t),
                            r = !n && vt(t),
                            i = !n && !r && xt(t),
                            s = !n && !r && !i && Nt(t),
                            o = n || r || i || s,
                            l = o ? (function (t, e) { for (var n = -1, r = Array(t); ++n < t;) { r[n] = e(n); } return r; }(t.length, String)) : [],
                            a = l.length; for (const c in t) { !e && !M.call(t, c) || o && (c == "length" || i && (c == "offset" || c == "parent") || s && (c == "buffer" || c == "byteLength" || c == "byteOffset") || pt(c, a)) || l.push(c); } return l;
                    }(t, !0)) : (function (t) {
                        if (!_t(t)) { return (function (t) { let e = []; if (t != null) {for (let n in Object(t)){e.push(n);}}return e; }(t)); } const e = ft(t),
                            n = []; for (const r in t) { (r != "constructor" || !e && M.call(t, r)) && n.push(r); } return n;
                    }(t));
                } let Lt,
                    St = (Lt = function (t, e, n) { ct(t, e, n); }, (function (t, e) { return bt((function (t, e, n) { return e = K(void 0 === e ? t.length - 1 : e, 0), function () { for (var r = arguments, i = -1, s = K(r.length - e, 0), o = Array(s); ++i < s;) { o[i] = r[e + i]; }i = -1; for (var l = Array(e + 1); ++i < e;) { l[i] = r[i]; } return l[e] = n(o), (function (t, e, n) { switch (n.length) { case 0: return t.call(e); case 1: return t.call(e, n[0]); case 2: return t.call(e, n[0], n[1]); case 3: return t.call(e, n[0], n[1], n[2]); } return t.apply(e, n); }(t, this, l)); }; }(t, e, Et)), `${t}`); }(((t, e) => {
 let n = -1,
                        r = e.length,
                        i = r > 1 ? e[r - 1] : void 0,
                        s = r > 2 ? e[2] : void 0; for (i = Lt.length > 3 && typeof i === "function" ? (r--, i) : void 0, s && (function (t, e, n) { if (!_t(n)) {return !1;} let r = typeof e; return !!(r == "number" ? wt(n) && pt(e, n.length):r == "string" && e in n) && mt(n[e], t); }(e[0], e[1], s)) && (i = r < 3 ? void 0 : i, r = 1), t = Object(t); ++n < r;) { const o = e[n]; o && Lt(t, o, n); } return t; 
})))); function Et(t) { return t; }t.exports = St;
            },
            696(t, e, n) {
                typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : void 0 !== n.g ? n.g : Function("return this")(), t.exports = (() => {
                    var t,
                        e = { d: (t, n) => { for (const r in n) { e.o(n, r) && !e.o(t, r) && Object.defineProperty(t, r, { enumerable: !0, get: n[r] }); } }, o: (t, e) => Object.prototype.hasOwnProperty.call(t, e), r: (t) => { typeof Symbol !== "undefined" && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }); } },
                        n = {}; e.r(n), e.d(n, {
                        Attributor: () => g, AttributorStore: () => w, BlockBlot: () => _, ClassAttributor: () => m, ContainerBlot: () => d, EmbedBlot: () => T, InlineBlot: () => k, LeafBlot: () => f, ParentBlot: () => u, Registry: () => s, Scope: () => r, ScrollBlot: () => L, StyleAttributor: () => y, TextBlot: () => E,
                    }), (function (t) { t[t.TYPE = 3] = "TYPE", t[t.LEVEL = 12] = "LEVEL", t[t.ATTRIBUTE = 13] = "ATTRIBUTE", t[t.BLOT = 14] = "BLOT", t[t.INLINE = 7] = "INLINE", t[t.BLOCK = 11] = "BLOCK", t[t.BLOCK_BLOT = 10] = "BLOCK_BLOT", t[t.INLINE_BLOT = 6] = "INLINE_BLOT", t[t.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", t[t.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", t[t.ANY = 15] = "ANY"; }(t || (t = {}))); const r = t; class i extends Error {constructor(t) { super(t = `[Parchment] ${t}`), this.message = t, this.name = this.constructor.name; }} class s {
                        constructor() { this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {}; }

                        static find(t, e = !1) { if (t == null) { return null; } if (this.blots.has(t)) { return this.blots.get(t) || null; } if (e) { let n = null; try { n = t.parentNode; } catch (t) { return null; } return this.find(n, e); } return null; }

                        create(t, e, n) {
                            const r = this.query(e); if (r == null) { throw new i(`Unable to create ${e} blot`); } const o = r,
                                l = e instanceof Node || e.nodeType === Node.TEXT_NODE ? e : o.create(n),
                                a = new o(t, l, n); return s.blots.set(a.domNode, a), a;
                        }

                        find(t, e = !1) { return s.find(t, e); }

                        query(t, e = r.ANY) { let n; return typeof t === "string" ? n = this.types[t] || this.attributes[t] : t instanceof Text || t.nodeType === Node.TEXT_NODE ? n = this.types.text : typeof t === "number" ? t & r.LEVEL & r.BLOCK ? n = this.types.block : t & r.LEVEL & r.INLINE && (n = this.types.inline) : t instanceof Element && ((t.getAttribute("class") || "").split(/\s+/).some((t => (n = this.classes[t], !!n))), n = n || this.tags[t.tagName]), n == null ? null : e & r.LEVEL & n.scope && e & r.TYPE & n.scope ? n : null; }

                        register(...t) { if (t.length > 1) { return t.map((t => this.register(t))); } const e = t[0]; if (typeof e.blotName !== "string" && typeof e.attrName !== "string") { throw new i("Invalid definition"); } if (e.blotName === "abstract") { throw new i("Cannot register abstract class"); } return this.types[e.blotName || e.attrName] = e, typeof e.keyName === "string" ? this.attributes[e.keyName] = e : (e.className != null && (this.classes[e.className] = e), e.tagName != null && (Array.isArray(e.tagName) ? e.tagName = e.tagName.map((t => t.toUpperCase())) : e.tagName = e.tagName.toUpperCase(), (Array.isArray(e.tagName) ? e.tagName : [e.tagName]).forEach(((t) => { this.tags[t] != null && e.className != null || (this.tags[t] = e); })))), e; }
                    }s.blots = new WeakMap(); class o {
                        constructor(t, e) { this.scroll = t, this.domNode = e, s.blots.set(e, this), this.prev = null, this.next = null; }

                        static create(t) { if (this.tagName == null) { throw new i("Blot definition missing tagName"); } let e; return Array.isArray(this.tagName) ? (typeof t === "string" && (t = t.toUpperCase(), parseInt(t, 10).toString() === t && (t = parseInt(t, 10))), e = typeof t === "number" ? document.createElement(this.tagName[t - 1]) : this.tagName.indexOf(t) > -1 ? document.createElement(t) : document.createElement(this.tagName[0])) : e = document.createElement(this.tagName), this.className && e.classList.add(this.className), e; }

                        get statics() { return this.constructor; }

                        attach() {}

                        clone() { const t = this.domNode.cloneNode(!1); return this.scroll.create(t); }

                        detach() { this.parent != null && this.parent.removeChild(this), s.blots.delete(this.domNode); }

                        deleteAt(t, e) { this.isolate(t, e).remove(); }

                        formatAt(t, e, n, i) { const s = this.isolate(t, e); if (this.scroll.query(n, r.BLOT) != null && i) { s.wrap(n, i); } else if (this.scroll.query(n, r.ATTRIBUTE) != null) { const t = this.scroll.create(this.statics.scope); s.wrap(t), t.format(n, i); } }

                        insertAt(t, e, n) {
                            const r = n == null ? this.scroll.create("text", e) : this.scroll.create(e, n),
                                i = this.split(t); this.parent.insertBefore(r, i || void 0);
                        }

                        isolate(t, e) { const n = this.split(t); if (n == null) { throw new Error("Attempt to isolate at end"); } return n.split(e), n; }

                        length() { return 1; }

                        offset(t = this.parent) { return this.parent == null || this === t ? 0 : this.parent.children.offset(this) + this.parent.offset(t); }

                        optimize(t) { !this.statics.requiredContainer || this.parent instanceof this.statics.requiredContainer || this.wrap(this.statics.requiredContainer.blotName); }

                        remove() { this.domNode.parentNode != null && this.domNode.parentNode.removeChild(this.domNode), this.detach(); }

                        replaceWith(t, e) { const n = typeof t === "string" ? this.scroll.create(t, e) : t; return this.parent != null && (this.parent.insertBefore(n, this.next || void 0), this.remove()), n; }

                        split(t, e) { return t === 0 ? this : this.next; }

                        update(t, e) {}

                        wrap(t, e) { const n = typeof t === "string" ? this.scroll.create(t, e) : t; if (this.parent != null && this.parent.insertBefore(n, this.next || void 0), typeof n.appendChild !== "function") { throw new i(`Cannot wrap ${t}`); } return n.appendChild(this), n; }
                    }o.blotName = "abstract"; const l = o; function a(t, e) { let n = e.find(t); if (n == null) { try { n = e.create(t); } catch (i) { n = e.create(r.INLINE), Array.from(t.childNodes).forEach(((t) => { n.domNode.appendChild(t); })), t.parentNode && t.parentNode.replaceChild(n.domNode, t), n.attach(); } } return n; } class c extends l {
                        constructor(t, e) { super(t, e), this.uiNode = null, this.build(); }

                        appendChild(t) { this.insertBefore(t); }

                        attach() { super.attach(), this.children.forEach(((t) => { t.attach(); })); }

                        attachUI(t) { this.uiNode != null && this.uiNode.remove(), this.uiNode = t, c.uiClass && this.uiNode.classList.add(c.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild); }

                        build() {
                            this.children = new class {
                                constructor() { this.head = null, this.tail = null, this.length = 0; }

                                append(...t) { if (this.insertBefore(t[0], null), t.length > 1) { const e = t.slice(1); this.append(...e); } }

                                at(t) { const e = this.iterator(); let n = e(); for (;n && t > 0;) { t -= 1, n = e(); } return n; }

                                contains(t) { const e = this.iterator(); let n = e(); for (;n;) { if (n === t) { return !0; } n = e(); } return !1; }

                                indexOf(t) {
                                    const e = this.iterator(); let n = e(),
                                        r = 0; for (;n;) { if (n === t) { return r; } r += 1, n = e(); } return -1;
                                }

                                insertBefore(t, e) { t != null && (this.remove(t), t.next = e, e != null ? (t.prev = e.prev, e.prev != null && (e.prev.next = t), e.prev = t, e === this.head && (this.head = t)) : this.tail != null ? (this.tail.next = t, t.prev = this.tail, this.tail = t) : (t.prev = null, this.head = this.tail = t), this.length += 1); }

                                offset(t) {
                                    let e = 0,
                                        n = this.head; for (;n != null;) { if (n === t) { return e; } e += n.length(), n = n.next; } return -1;
                                }

                                remove(t) { this.contains(t) && (t.prev != null && (t.prev.next = t.next), t.next != null && (t.next.prev = t.prev), t === this.head && (this.head = t.next), t === this.tail && (this.tail = t.prev), this.length -= 1); }

                                iterator(t = this.head) { return () => { const e = t; return t != null && (t = t.next), e; }; }

                                find(t, e = !1) { const n = this.iterator(); let r = n(); for (;r;) { const i = r.length(); if (t < i || e && t === i && (r.next == null || r.next.length() !== 0)) { return [r, t]; } t -= i, r = n(); } return [null, 0]; }

                                forEach(t) { const e = this.iterator(); let n = e(); for (;n;) { t(n), n = e(); } }

                                forEachAt(t, e, n) { if (e <= 0) { return; } const [r, i] = this.find(t); let s = t - i; const o = this.iterator(r); let l = o(); for (;l && s < t + e;) { const r = l.length(); t > s ? n(l, t - s, Math.min(e, s + r - t)) : n(l, 0, Math.min(r, t + e - s)), s += r, l = o(); } }

                                map(t) { return this.reduce(((e, n) => (e.push(t(n)), e)), []); }

                                reduce(t, e) { const n = this.iterator(); let r = n(); for (;r;) { e = t(e, r), r = n(); } return e; }
                            }(), Array.from(this.domNode.childNodes).filter((t => t !== this.uiNode)).reverse().forEach(((t) => { try { const e = a(t, this.scroll); this.insertBefore(e, this.children.head || void 0); } catch (t) { if (t instanceof i) { return; } throw t; } }));
                        }

                        deleteAt(t, e) { if (t === 0 && e === this.length()) { return this.remove(); } this.children.forEachAt(t, e, ((t, e, n) => { t.deleteAt(e, n); })); }

                        descendant(t, e = 0) { const [n, r] = this.children.find(e); return t.blotName == null && t(n) || t.blotName != null && n instanceof t ? [n, r] : n instanceof c ? n.descendant(t, r) : [null, -1]; }

                        descendants(t, e = 0, n = Number.MAX_VALUE) {
                            let r = [],
                                i = n; return this.children.forEachAt(e, n, ((e, n, s) => { (t.blotName == null && t(e) || t.blotName != null && e instanceof t) && r.push(e), e instanceof c && (r = r.concat(e.descendants(t, n, i))), i -= s; })), r;
                        }

                        detach() { this.children.forEach(((t) => { t.detach(); })), super.detach(); }

                        enforceAllowedChildren() { let t = !1; this.children.forEach(((e) => { t || this.statics.allowedChildren.some((t => e instanceof t)) || (e.statics.scope === r.BLOCK_BLOT ? (e.next != null && this.splitAfter(e), e.prev != null && this.splitAfter(e.prev), e.parent.unwrap(), t = !0) : e instanceof c ? e.unwrap() : e.remove()); })); }

                        formatAt(t, e, n, r) { this.children.forEachAt(t, e, ((t, e, i) => { t.formatAt(e, i, n, r); })); }

                        insertAt(t, e, n) { const [r, i] = this.children.find(t); if (r) { r.insertAt(i, e, n); } else { const t = n == null ? this.scroll.create("text", e) : this.scroll.create(e, n); this.appendChild(t); } }

                        insertBefore(t, e) { t.parent != null && t.parent.children.remove(t); let n = null; this.children.insertBefore(t, e || null), t.parent = this, e != null && (n = e.domNode), this.domNode.parentNode === t.domNode && this.domNode.nextSibling === n || this.domNode.insertBefore(t.domNode, n), t.attach(); }

                        length() { return this.children.reduce(((t, e) => t + e.length()), 0); }

                        moveChildren(t, e) { this.children.forEach(((n) => { t.insertBefore(n, e); })); }

                        optimize(t) { if (super.optimize(t), this.enforceAllowedChildren(), this.uiNode != null && this.uiNode !== this.domNode.firstChild && this.domNode.insertBefore(this.uiNode, this.domNode.firstChild), this.children.length === 0) { if (this.statics.defaultChild != null) { const t = this.scroll.create(this.statics.defaultChild.blotName); this.appendChild(t); } else { this.remove(); } } }

                        path(t, e = !1) {
                            const [n, r] = this.children.find(t, e),
                                i = [[this, t]]; return n instanceof c ? i.concat(n.path(r, e)) : (n != null && i.push([n, r]), i);
                        }

                        removeChild(t) { this.children.remove(t); }

                        replaceWith(t, e) { const n = typeof t === "string" ? this.scroll.create(t, e) : t; return n instanceof c && this.moveChildren(n), super.replaceWith(n); }

                        split(t, e = !1) { if (!e) { if (t === 0) { return this; } if (t === this.length()) { return this.next; } } const n = this.clone(); return this.parent && this.parent.insertBefore(n, this.next || void 0), this.children.forEachAt(t, this.length(), ((t, r, i) => { const s = t.split(r, e); s != null && n.appendChild(s); })), n; }

                        splitAfter(t) { const e = this.clone(); for (;t.next != null;) { e.appendChild(t.next); } return this.parent && this.parent.insertBefore(e, this.next || void 0), e; }

                        unwrap() { this.parent && this.moveChildren(this.parent, this.next || void 0), this.remove(); }

                        update(t, e) {
                            const n = [],
                                r = []; t.forEach(((t) => { t.target === this.domNode && t.type === "childList" && (n.push(...t.addedNodes), r.push(...t.removedNodes)); })), r.forEach(((t) => { if (t.parentNode != null && t.tagName !== "IFRAME" && document.body.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) { return; } const e = this.scroll.find(t); e != null && (e.domNode.parentNode != null && e.domNode.parentNode !== this.domNode || e.detach()); })), n.filter((t => t.parentNode === this.domNode || t === this.uiNode)).sort(((t, e) => (t === e ? 0 : t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1))).forEach(((t) => { let e = null; t.nextSibling != null && (e = this.scroll.find(t.nextSibling)); const n = a(t, this.scroll); n.next === e && n.next != null || (n.parent != null && n.parent.removeChild(this), this.insertBefore(n, e || void 0)); })), this.enforceAllowedChildren();
                        }
                    }c.uiClass = ""; const u = c; class h extends u {
                        checkMerge() { return this.next !== null && this.next.statics.blotName === this.statics.blotName; }

                        deleteAt(t, e) { super.deleteAt(t, e), this.enforceAllowedChildren(); }

                        formatAt(t, e, n, r) { super.formatAt(t, e, n, r), this.enforceAllowedChildren(); }

                        insertAt(t, e, n) { super.insertAt(t, e, n), this.enforceAllowedChildren(); }

                        optimize(t) { super.optimize(t), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove()); }
                    }h.blotName = "container", h.scope = r.BLOCK_BLOT; const d = h; class p extends l {
                        static value(t) { return !0; }

                        index(t, e) { return this.domNode === t || this.domNode.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY ? Math.min(e, 1) : -1; }

                        position(t, e) { let n = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode); return t > 0 && (n += 1), [this.parent.domNode, n]; }

                        value() { return { [this.statics.blotName]: this.statics.value(this.domNode) || !0 }; }
                    }p.scope = r.INLINE_BLOT; const f = p; class g {
                        constructor(t, e, n = {}) { this.attrName = t, this.keyName = e; const i = r.TYPE & r.ATTRIBUTE; this.scope = n.scope != null ? n.scope & r.LEVEL | i : r.ATTRIBUTE, n.whitelist != null && (this.whitelist = n.whitelist); }

                        static keys(t) { return Array.from(t.attributes).map((t => t.name)); }

                        add(t, e) { return !!this.canAdd(t, e) && (t.setAttribute(this.keyName, e), !0); }

                        canAdd(t, e) { return this.whitelist == null || (typeof e === "string" ? this.whitelist.indexOf(e.replace(/["']/g, "")) > -1 : this.whitelist.indexOf(e) > -1); }

                        remove(t) { t.removeAttribute(this.keyName); }

                        value(t) { const e = t.getAttribute(this.keyName); return this.canAdd(t, e) && e ? e : ""; }
                    } function b(t, e) { return (t.getAttribute("class") || "").split(/\s+/).filter((t => t.indexOf(`${e}-`) === 0)); } const m = class extends g {
                        static keys(t) { return (t.getAttribute("class") || "").split(/\s+/).map((t => t.split("-").slice(0, -1).join("-"))); }

                        add(t, e) { return !!this.canAdd(t, e) && (this.remove(t), t.classList.add(`${this.keyName}-${e}`), !0); }

                        remove(t) { b(t, this.keyName).forEach(((e) => { t.classList.remove(e); })), t.classList.length === 0 && t.removeAttribute("class"); }

                        value(t) { const e = (b(t, this.keyName)[0] || "").slice(this.keyName.length + 1); return this.canAdd(t, e) ? e : ""; }
                    }; function v(t) {
                        const e = t.split("-"),
                            n = e.slice(1).map((t => t[0].toUpperCase() + t.slice(1))).join(""); return e[0] + n;
                    } const y = class extends g {
                            static keys(t) { return (t.getAttribute("style") || "").split(";").map((t => t.split(":")[0].trim())); }

                            add(t, e) { return !!this.canAdd(t, e) && (t.style[v(this.keyName)] = e, !0); }

                            remove(t) { t.style[v(this.keyName)] = "", t.getAttribute("style") || t.removeAttribute("style"); }

                            value(t) { const e = t.style[v(this.keyName)]; return this.canAdd(t, e) ? e : ""; }
                        },
                        w = class {
                            constructor(t) { this.attributes = {}, this.domNode = t, this.build(); }

                            attribute(t, e) { e ? t.add(this.domNode, e) && (t.value(this.domNode) != null ? this.attributes[t.attrName] = t : delete this.attributes[t.attrName]) : (t.remove(this.domNode), delete this.attributes[t.attrName]); }

                            build() {
                                this.attributes = {}; const t = s.find(this.domNode); if (t == null) { return; } const e = g.keys(this.domNode),
                                    n = m.keys(this.domNode),
                                    i = y.keys(this.domNode); e.concat(n).concat(i).forEach(((e) => { const n = t.scroll.query(e, r.ATTRIBUTE); n instanceof g && (this.attributes[n.attrName] = n); }));
                            }

                            copy(t) { Object.keys(this.attributes).forEach(((e) => { const n = this.attributes[e].value(this.domNode); t.format(e, n); })); }

                            move(t) { this.copy(t), Object.keys(this.attributes).forEach(((t) => { this.attributes[t].remove(this.domNode); })), this.attributes = {}; }

                            values() { return Object.keys(this.attributes).reduce(((t, e) => (t[e] = this.attributes[e].value(this.domNode), t)), {}); }
                        }; class x extends u {
                        constructor(t, e) { super(t, e), this.attributes = new w(this.domNode); }

                        static formats(t, e) { const n = e.query(x.blotName); if (n == null || t.tagName !== n.tagName) { return typeof this.tagName === "string" || (Array.isArray(this.tagName) ? t.tagName.toLowerCase() : void 0); } }

                        format(t, e) { if (t !== this.statics.blotName || e) { const n = this.scroll.query(t, r.INLINE); if (n == null) { return; } n instanceof g ? this.attributes.attribute(n, e) : !e || t === this.statics.blotName && this.formats()[t] === e || this.replaceWith(t, e); } else { this.children.forEach(((t) => { t instanceof x || (t = t.wrap(x.blotName, !0)), this.attributes.copy(t); })), this.unwrap(); } }

                        formats() {
                            const t = this.attributes.values(),
                                e = this.statics.formats(this.domNode, this.scroll); return e != null && (t[this.statics.blotName] = e), t;
                        }

                        formatAt(t, e, n, i) { this.formats()[n] != null || this.scroll.query(n, r.ATTRIBUTE) ? this.isolate(t, e).format(n, i) : super.formatAt(t, e, n, i); }

                        optimize(t) { super.optimize(t); const e = this.formats(); if (Object.keys(e).length === 0) { return this.unwrap(); } const n = this.next; n instanceof x && n.prev === this && (function (t, e) { if (Object.keys(t).length !== Object.keys(e).length) { return !1; } for (const n in t) { if (t[n] !== e[n]) { return !1; } } return !0; }(e, n.formats())) && (n.moveChildren(this), n.remove()); }

                        replaceWith(t, e) { const n = super.replaceWith(t, e); return this.attributes.copy(n), n; }

                        update(t, e) { super.update(t, e), t.some((t => t.target === this.domNode && t.type === "attributes")) && this.attributes.build(); }

                        wrap(t, e) { const n = super.wrap(t, e); return n instanceof x && this.attributes.move(n), n; }
                    }x.allowedChildren = [x, f], x.blotName = "inline", x.scope = r.INLINE_BLOT, x.tagName = "SPAN"; const k = x; class C extends u {
                        constructor(t, e) { super(t, e), this.attributes = new w(this.domNode); }

                        static formats(t, e) { const n = e.query(C.blotName); if (n == null || t.tagName !== n.tagName) { return typeof this.tagName === "string" || (Array.isArray(this.tagName) ? t.tagName.toLowerCase() : void 0); } }

                        format(t, e) { const n = this.scroll.query(t, r.BLOCK); n != null && (n instanceof g ? this.attributes.attribute(n, e) : t !== this.statics.blotName || e ? !e || t === this.statics.blotName && this.formats()[t] === e || this.replaceWith(t, e) : this.replaceWith(C.blotName)); }

                        formats() {
                            const t = this.attributes.values(),
                                e = this.statics.formats(this.domNode, this.scroll); return e != null && (t[this.statics.blotName] = e), t;
                        }

                        formatAt(t, e, n, i) { this.scroll.query(n, r.BLOCK) != null ? this.format(n, i) : super.formatAt(t, e, n, i); }

                        insertAt(t, e, n) { if (n == null || this.scroll.query(e, r.INLINE) != null) { super.insertAt(t, e, n); } else { const r = this.split(t); if (r == null) { throw new Error("Attempt to insertAt after block boundaries"); } { const t = this.scroll.create(e, n); r.parent.insertBefore(t, r); } } }

                        replaceWith(t, e) { const n = super.replaceWith(t, e); return this.attributes.copy(n), n; }

                        update(t, e) { super.update(t, e), t.some((t => t.target === this.domNode && t.type === "attributes")) && this.attributes.build(); }
                    }C.blotName = "block", C.scope = r.BLOCK_BLOT, C.tagName = "P", C.allowedChildren = [k, C, f]; const _ = C,
                        T = class extends f {
                            static formats(t, e) {}

                            format(t, e) { super.formatAt(0, this.length(), t, e); }

                            formatAt(t, e, n, r) { t === 0 && e === this.length() ? this.format(n, r) : super.formatAt(t, e, n, r); }

                            formats() { return this.statics.formats(this.domNode, this.scroll); }
                        },
                        N = {
                            attributes: !0, characterData: !0, characterDataOldValue: !0, childList: !0, subtree: !0,
                        }; class A extends u {
                        constructor(t, e) { super(null, e), this.registry = t, this.scroll = this, this.build(), this.observer = new MutationObserver(((t) => { this.update(t); })), this.observer.observe(this.domNode, N), this.attach(); }

                        create(t, e) { return this.registry.create(this, t, e); }

                        find(t, e = !1) { const n = this.registry.find(t, e); return n ? n.scroll === this ? n : e ? this.find(n.scroll.domNode.parentNode, !0) : null : null; }

                        query(t, e = r.ANY) { return this.registry.query(t, e); }

                        register(...t) { return this.registry.register(...t); }

                        build() { this.scroll != null && super.build(); }

                        detach() { super.detach(), this.observer.disconnect(); }

                        deleteAt(t, e) { this.update(), t === 0 && e === this.length() ? this.children.forEach(((t) => { t.remove(); })) : super.deleteAt(t, e); }

                        formatAt(t, e, n, r) { this.update(), super.formatAt(t, e, n, r); }

                        insertAt(t, e, n) { this.update(), super.insertAt(t, e, n); }

                        optimize(t = [], e = {}) {
                            super.optimize(e); const n = e.mutationsMap || new WeakMap(); let r = Array.from(this.observer.takeRecords()); for (;r.length > 0;) { t.push(r.pop()); } const i = (t, e = !0) => { t != null && t !== this && t.domNode.parentNode != null && (n.has(t.domNode) || n.set(t.domNode, []), e && i(t.parent)); },
                                s = (t) => { n.has(t.domNode) && (t instanceof u && t.children.forEach(s), n.delete(t.domNode), t.optimize(e)); }; let o = t; for (let e = 0; o.length > 0; e += 1) { if (e >= 100) { throw new Error("[Parchment] Maximum optimize iterations reached"); } for (o.forEach(((t) => { const e = this.find(t.target, !0); e != null && (e.domNode === t.target && (t.type === "childList" ? (i(this.find(t.previousSibling, !1)), Array.from(t.addedNodes).forEach(((t) => { const e = this.find(t, !1); i(e, !1), e instanceof u && e.children.forEach(((t) => { i(t, !1); })); }))) : t.type === "attributes" && i(e.prev)), i(e)); })), this.children.forEach(s), o = Array.from(this.observer.takeRecords()), r = o.slice(); r.length > 0;) { t.push(r.pop()); } }
                        }

                        update(t, e = {}) { t = t || this.observer.takeRecords(); const n = new WeakMap(); t.map(((t) => { const e = this.find(t.target, !0); return e == null ? null : n.has(e.domNode) ? (n.get(e.domNode).push(t), null) : (n.set(e.domNode, [t]), e); })).forEach(((t) => { t != null && t !== this && n.has(t.domNode) && t.update(n.get(t.domNode) || [], e); })), e.mutationsMap = n, n.has(this.domNode) && super.update(n.get(this.domNode), e), this.optimize(t, e); }
                    }A.blotName = "scroll", A.defaultChild = _, A.allowedChildren = [_, d], A.scope = r.BLOCK_BLOT, A.tagName = "DIV"; const L = A; class S extends f {
                        constructor(t, e) { super(t, e), this.text = this.statics.value(this.domNode); }

                        static create(t) { return document.createTextNode(t); }

                        static value(t) { return t.data; }

                        deleteAt(t, e) { this.domNode.data = this.text = this.text.slice(0, t) + this.text.slice(t + e); }

                        index(t, e) { return this.domNode === t ? e : -1; }

                        insertAt(t, e, n) { n == null ? (this.text = this.text.slice(0, t) + e + this.text.slice(t), this.domNode.data = this.text) : super.insertAt(t, e, n); }

                        length() { return this.text.length; }

                        optimize(t) { super.optimize(t), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof S && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove()); }

                        position(t, e = !1) { return [this.domNode, t]; }

                        split(t, e = !1) { if (!e) { if (t === 0) { return this; } if (t === this.length()) { return this.next; } } const n = this.scroll.create(this.domNode.splitText(t)); return this.parent.insertBefore(n, this.next || void 0), this.text = this.statics.value(this.domNode), n; }

                        update(t, e) { t.some((t => t.type === "characterData" && t.target === this.domNode)) && (this.text = this.statics.value(this.domNode)); }

                        value() { return this.text; }
                    }S.blotName = "text", S.scope = r.INLINE_BLOT; const E = S; return n;
                })();
            },
            382(t, e, n) {
                Object.defineProperty(e, "__esModule", { value: !0 }); const r = n(861),
                    i = n(842); let s; !(function (t) { t.compose = function (t = {}, e = {}, n = !1) { typeof t !== "object" && (t = {}), typeof e !== "object" && (e = {}); let i = r(e); n || (i = Object.keys(i).reduce(((t, e) => (i[e] != null && (t[e] = i[e]), t)), {})); for (const n in t) { void 0 !== t[n] && void 0 === e[n] && (i[n] = t[n]); } return Object.keys(i).length > 0 ? i : void 0; }, t.diff = function (t = {}, e = {}) { typeof t !== "object" && (t = {}), typeof e !== "object" && (e = {}); const n = Object.keys(t).concat(Object.keys(e)).reduce(((n, r) => (i(t[r], e[r]) || (n[r] = void 0 === e[r] ? null : e[r]), n)), {}); return Object.keys(n).length > 0 ? n : void 0; }, t.invert = function (t = {}, e = {}) { t = t || {}; const n = Object.keys(e).reduce(((n, r) => (e[r] !== t[r] && void 0 !== t[r] && (n[r] = e[r]), n)), {}); return Object.keys(t).reduce(((n, r) => (t[r] !== e[r] && void 0 === e[r] && (n[r] = null), n)), n); }, t.transform = function (t, e, n = !1) { if (typeof t !== "object") { return e; } if (typeof e !== "object") { return; } if (!n) { return e; } const r = Object.keys(e).reduce(((n, r) => (void 0 === t[r] && (n[r] = e[r]), n)), {}); return Object.keys(r).length > 0 ? r : void 0; }; }(s || (s = {}))), e.default = s;
            },
            32(t, e, n) {
                Object.defineProperty(e, "__esModule", { value: !0 }), e.AttributeMap = e.OpIterator = e.Op = void 0; const r = n(386),
                    i = n(861),
                    s = n(842),
                    o = n(382); e.AttributeMap = o.default; const l = n(427); e.Op = l.default; const a = n(505); e.OpIterator = a.default; const c = String.fromCharCode(0),
                    u = (t, e) => { if (typeof t !== "object" || t === null) { throw new Error(`cannot retain a ${typeof t}`); } if (typeof e !== "object" || e === null) { throw new Error(`cannot retain a ${typeof e}`); } const n = Object.keys(t)[0]; if (!n || n !== Object.keys(e)[0]) { throw new Error(`embed types not matched: ${n} != ${Object.keys(e)[0]}`); } return [n, t[n], e[n]]; }; class h {
                    constructor(t) { Array.isArray(t) ? this.ops = t : t != null && Array.isArray(t.ops) ? this.ops = t.ops : this.ops = []; }

                    static registerEmbed(t, e) { this.handlers[t] = e; }

                    static unregisterEmbed(t) { delete this.handlers[t]; }

                    static getHandler(t) { const e = this.handlers[t]; if (!e) { throw new Error(`no handlers for embed type "${t}"`); } return e; }

                    insert(t, e) { const n = {}; return typeof t === "string" && t.length === 0 ? this : (n.insert = t, e != null && typeof e === "object" && Object.keys(e).length > 0 && (n.attributes = e), this.push(n)); }

                    delete(t) { return t <= 0 ? this : this.push({ delete: t }); }

                    retain(t, e) { if (typeof t === "number" && t <= 0) { return this; } const n = { retain: t }; return e != null && typeof e === "object" && Object.keys(e).length > 0 && (n.attributes = e), this.push(n); }

                    push(t) {
                        let e = this.ops.length,
                            n = this.ops[e - 1]; if (t = i(t), typeof n === "object") { if (typeof t.delete === "number" && typeof n.delete === "number") { return this.ops[e - 1] = { delete: n.delete + t.delete }, this; } if (typeof n.delete === "number" && t.insert != null && (e -= 1, n = this.ops[e - 1], typeof n !== "object")) { return this.ops.unshift(t), this; } if (s(t.attributes, n.attributes)) { if (typeof t.insert === "string" && typeof n.insert === "string") { return this.ops[e - 1] = { insert: n.insert + t.insert }, typeof t.attributes === "object" && (this.ops[e - 1].attributes = t.attributes), this; } if (typeof t.retain === "number" && typeof n.retain === "number") { return this.ops[e - 1] = { retain: n.retain + t.retain }, typeof t.attributes === "object" && (this.ops[e - 1].attributes = t.attributes), this; } } } return e === this.ops.length ? this.ops.push(t) : this.ops.splice(e, 0, t), this;
                    }

                    chop() { const t = this.ops[this.ops.length - 1]; return t && typeof t.retain === "number" && !t.attributes && this.ops.pop(), this; }

                    filter(t) { return this.ops.filter(t); }

                    forEach(t) { this.ops.forEach(t); }

                    map(t) { return this.ops.map(t); }

                    partition(t) {
                        const e = [],
                            n = []; return this.forEach(((r) => { (t(r) ? e : n).push(r); })), [e, n];
                    }

                    reduce(t, e) { return this.ops.reduce(t, e); }

                    changeLength() { return this.reduce(((t, e) => (e.insert ? t + l.default.length(e) : e.delete ? t - e.delete : t)), 0); }

                    length() { return this.reduce(((t, e) => t + l.default.length(e)), 0); }

                    slice(t = 0, e = 1 / 0) {
                        const n = [],
                            r = new a.default(this.ops); let i = 0; for (;i < e && r.hasNext();) { let s; i < t ? s = r.next(t - i) : (s = r.next(e - i), n.push(s)), i += l.default.length(s); } return new h(n);
                    }

                    compose(t) {
                        const e = new a.default(this.ops),
                            n = new a.default(t.ops),
                            r = [],
                            i = n.peek(); if (i != null && typeof i.retain === "number" && i.attributes == null) { let t = i.retain; for (;e.peekType() === "insert" && e.peekLength() <= t;) { t -= e.peekLength(), r.push(e.next()); }i.retain - t > 0 && n.next(i.retain - t); } const l = new h(r); for (;e.hasNext() || n.hasNext();) {
                            if (n.peekType() === "insert") { l.push(n.next()); } else if (e.peekType() === "delete") { l.push(e.next()); } else {
                                const t = Math.min(e.peekLength(), n.peekLength()),
                                    r = e.next(t),
                                    i = n.next(t); if (i.retain) {
                                    const a = {}; if (typeof r.retain === "number") { a.retain = typeof i.retain === "number" ? t : i.retain; } else if (typeof i.retain === "number") { r.retain == null ? a.insert = r.insert : a.retain = r.retain; } else {
                                        const t = r.retain == null ? "insert" : "retain",
                                            [e, n, s] = u(r[t], i.retain),
                                            o = h.getHandler(e); a[t] = { [e]: o.compose(n, s, t === "retain") };
                                    } const c = o.default.compose(r.attributes, i.attributes, typeof r.retain === "number"); if (c && (a.attributes = c), l.push(a), !n.hasNext() && s(l.ops[l.ops.length - 1], a)) { const t = new h(e.rest()); return l.concat(t).chop(); }
                                } else { typeof i.delete === "number" && (typeof r.retain === "number" || typeof r.retain === "object" && r.retain !== null) && l.push(i); }
                            }
                        } return l.chop();
                    }

                    concat(t) { const e = new h(this.ops.slice()); return t.ops.length > 0 && (e.push(t.ops[0]), e.ops = e.ops.concat(t.ops.slice(1))), e; }

                    diff(t, e) {
                        if (this.ops === t.ops) { return new h(); } const n = [this, t].map((e => e.map(((n) => { if (n.insert != null) { return typeof n.insert === "string" ? n.insert : c; } throw new Error(`diff() called ${e === t ? "on" : "with"} non-document`); })).join(""))),
                            i = new h(),
                            l = r(n[0], n[1], e, !0),
                            u = new a.default(this.ops),
                            d = new a.default(t.ops); return l.forEach(((t) => {
                            let e = t[1].length; for (;e > 0;) {
                                let n = 0; switch (t[0]) {
                                case r.INSERT: n = Math.min(d.peekLength(), e), i.push(d.next(n)); break; case r.DELETE: n = Math.min(e, u.peekLength()), u.next(n), i.delete(n); break; case r.EQUAL: n = Math.min(u.peekLength(), d.peekLength(), e); const t = u.next(n),
                                    l = d.next(n); s(t.insert, l.insert) ? i.retain(n, o.default.diff(t.attributes, l.attributes)) : i.push(l).delete(n);
                                }e -= n;
                            }
                        })), i.chop();
                    }

                    eachLine(t, e = "\n") {
                        const n = new a.default(this.ops); let r = new h(),
                            i = 0; for (;n.hasNext();) {
                            if (n.peekType() !== "insert") { return; } const s = n.peek(),
                                o = l.default.length(s) - n.peekLength(),
                                a = typeof s.insert === "string" ? s.insert.indexOf(e, o) - o : -1; if (a < 0) { r.push(n.next()); } else if (a > 0) { r.push(n.next(a)); } else { if (!1 === t(r, n.next(1).attributes || {}, i)) { return; } i += 1, r = new h(); }
                        }r.length() > 0 && t(r, {}, i);
                    }

                    invert(t) {
                        const e = new h(); return this.reduce(((n, r) => {
                            if (r.insert) { e.delete(l.default.length(r)); } else {
                                if (typeof r.retain === "number" && r.attributes == null) { return e.retain(r.retain), n + r.retain; } if (r.delete || typeof r.retain === "number") { const i = r.delete || r.retain; return t.slice(n, n + i).forEach(((t) => { r.delete ? e.push(t) : r.retain && r.attributes && e.retain(l.default.length(t), o.default.invert(r.attributes, t.attributes)); })), n + i; } if (typeof r.retain === "object" && r.retain !== null) {
                                    const i = t.slice(n, n + 1),
                                        s = new a.default(i.ops).next(),
                                        [l, c, d] = u(r.retain, s.insert),
                                        p = h.getHandler(l); return e.retain({ [l]: p.invert(c, d) }, o.default.invert(r.attributes, s.attributes)), n + 1;
                                }
                            } return n;
                        }), 0), e.chop();
                    }

                    transform(t, e = !1) {
                        if (e = !!e, typeof t === "number") { return this.transformPosition(t, e); } const n = t,
                            r = new a.default(this.ops),
                            i = new a.default(n.ops),
                            s = new h(); for (;r.hasNext() || i.hasNext();) {
 if (r.peekType() !== "insert" || !e && i.peekType() === "insert") {
 if (i.peekType() === "insert") { s.push(i.next()); } else {
 const t = Math.min(r.peekLength(), i.peekLength()),
                            n = r.next(t),
                            l = i.next(t); if (n.delete) { continue; } if (l.delete) { s.push(l); } else {
 const r = n.retain,
                            i = l.retain; let a = typeof i === "object" && i !== null ? i : t; if (typeof r === "object" && r !== null && typeof i === "object" && i !== null) { const t = Object.keys(r)[0]; if (t === Object.keys(i)[0]) { const n = h.getHandler(t); n && (a = { [t]: n.transform(r[t], i[t], e) }); } }s.retain(a, o.default.transform(n.attributes, l.attributes, e)); 
} 
} 
} else { s.retain(l.default.length(r.next())); } 
} return s.chop();
                    }

                    transformPosition(t, e = !1) {
                        e = !!e; const n = new a.default(this.ops); let r = 0; for (;n.hasNext() && r <= t;) {
                            const i = n.peekLength(),
                                s = n.peekType(); n.next(), s !== "delete" ? (s === "insert" && (r < t || !e) && (t += i), r += i) : t -= Math.min(i, t - r);
                        } return t;
                    }
                }h.Op = l.default, h.OpIterator = a.default, h.AttributeMap = o.default, h.handlers = {}, e.default = h, t.exports = h, t.exports.default = h;
            },
            427(t, e) {
                let n; Object.defineProperty(e, "__esModule", { value: !0 }), (function (t) { t.length = function (t) { return typeof t.delete === "number" ? t.delete : typeof t.retain === "number" ? t.retain : typeof t.retain === "object" && t.retain !== null ? 1 : typeof t.insert === "string" ? t.insert.length : 1; }; }(n || (n = {}))), e.default = n;
            },
            505(t, e, n) {
                Object.defineProperty(e, "__esModule", { value: !0 }); const r = n(427); e.default = class {
                    constructor(t) { this.ops = t, this.index = 0, this.offset = 0; }

                    hasNext() { return this.peekLength() < 1 / 0; }

                    next(t) {
                        t || (t = 1 / 0); const e = this.ops[this.index]; if (e) {
                            const n = this.offset,
                                i = r.default.length(e); if (t >= i - n ? (t = i - n, this.index += 1, this.offset = 0) : this.offset += t, typeof e.delete === "number") { return { delete: t }; } { const r = {}; return e.attributes && (r.attributes = e.attributes), typeof e.retain === "number" ? r.retain = t : typeof e.retain === "object" && e.retain !== null ? r.retain = e.retain : typeof e.insert === "string" ? r.insert = e.insert.substr(n, t) : r.insert = e.insert, r; }
                        } return { retain: 1 / 0 };
                    }

                    peek() { return this.ops[this.index]; }

                    peekLength() { return this.ops[this.index] ? r.default.length(this.ops[this.index]) - this.offset : 1 / 0; }

                    peekType() { const t = this.ops[this.index]; return t ? typeof t.delete === "number" ? "delete" : typeof t.retain === "number" || typeof t.retain === "object" && t.retain !== null ? "retain" : "insert" : "retain"; }

                    rest() {
                        if (this.hasNext()) {
                            if (this.offset === 0) { return this.ops.slice(this.index); } { const t = this.offset,
                                e = this.index,
                                n = this.next(),
                                r = this.ops.slice(this.index); return this.offset = t, this.index = e, [n].concat(r); }
                        } return [];
                    }
                };
            },
            912(e) {
                e.exports = t;
            },
        },
        n = {}; function r(t) { const i = n[t]; if (void 0 !== i) { return i.exports; } const s = n[t] = { id: t, loaded: !1, exports: {} }; return e[t](s, s.exports, r), s.loaded = !0, s.exports; }r.n = function (t) { const e = t && t.__esModule ? function () { return t.default; } : function () { return t; }; return r.d(e, { a: e }), e; }, r.d = function (t, e) { for (const n in e) { r.o(e, n) && !r.o(t, n) && Object.defineProperty(t, n, { enumerable: !0, get: e[n] }); } }, r.g = (function () { if (typeof globalThis === "object") { return globalThis; } try { return this || new Function("return this")(); } catch (t) { if (typeof window === "object") { return window; } } }()), r.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e); }, r.nmd = function (t) { return t.paths = [], t.children || (t.children = []), t; }; const i = {}; return (function () {
        r.d(i, { default() { return jn; } }); const t = r(912),
            e = r.n(t),
            n = r(32),
            s = r.n(n),
            o = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M36 19H12\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 9H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 29H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M36 39H12\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",
            l = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M42 9H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M34 19H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 29H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M34 39H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",
            a = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M42 9H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 19H14\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 29H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 39H14\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", c = ["data-row", "width", "height", "colspan", "rowspan", "style"],
            u = {
                "border-style": "none", "border-color": "", "border-width": "", "background-color": "", width: "", height: "", padding: "", "text-align": "left", "vertical-align": "middle",
            },
            h = ["border-style", "border-color", "border-width", "background-color", "width", "height", "padding", "text-align", "vertical-align"],
            d = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "currentcolor", "currentcolor", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "transparent", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
            p = ["border-style", "border-color", "border-width", "background-color", "width", "height", "align"],
            f = e().import("formats/list"),
            g = e().import("blots/container"),
            b = ["colspan", "rowspan"]; class m extends g {
            static create(t) { const e = super.create(); for (const e of b) { t[e] == "1" && delete t[e]; } const n = Object.keys(t); for (const r of n) { r === "data-row" ? e.setAttribute(r, t[r]) : r === "cellId" ? e.setAttribute("data-cell", t[r]) : e.setAttribute(`data-${r}`, t[r]); } return e; }

            format(t, e) { return this.wrap(t, e); }

            static formats(t) { const e = c.reduce(((e, n) => { const r = n.includes("data") ? n : `data-${n}`; return t.hasAttribute(r) && (e[n] = t.getAttribute(r)), e; }), {}); e.cellId = t.getAttribute("data-cell"); for (const t of b) { e[t] || (e[t] = "1"); } return e; }

            formats() { const t = this.statics.formats(this.domNode, this.scroll); return { [this.statics.blotName]: t }; }
        }m.blotName = "table-list-container", m.className = "table-list-container", m.tagName = "OL"; class v extends f {
            format(t, e, n) { const r = this.formats()[this.statics.blotName]; if (t === "list") { const [t, i] = this.getCellFormats(this.parent); if (!e || e === r) { return this.setReplace(n, t), this.replaceWith(W.blotName, i); } if (e !== r) { return this.replaceWith(this.statics.blotName, e); } } else if (t === m.blotName) { typeof e === "string" && (e = { cellId: e }); const [n, r] = this.getCorrectCellFormats(e); this.wrap($.blotName, n), this.wrap(t, Object.assign(Object.assign({}, n), { cellId: r })); } else { if (t === "header") { const [t, r] = this.getCellFormats(this.parent); return this.setReplace(n, t), this.replaceWith("table-header", { cellId: r, value: e }); } if (t === $.blotName) { const n = this.getListContainer(this.parent); if (!n) { return; } const r = n.formats()[n.statics.blotName]; this.wrap(t, e), this.wrap(m.blotName, Object.assign(Object.assign({}, r), e)); } else if (t !== this.statics.blotName || e) { super.format(t, e); } else { const [, t] = this.getCellFormats(this.parent); this.replaceWith(W.blotName, t); } } }

            getCellFormats(t) { return N(B(t)); }

            getCorrectCellFormats(t) {
                const e = B(this.parent); if (e) {
                    const [n, r] = N(e),
                        i = Object.assign(Object.assign({}, n), t),
                        s = i.cellId || r; return delete i.cellId, [i, s];
                } { const e = t.cellId,
                    n = Object.assign({}, t); return delete n.cellId, [n, e]; }
            }

            getListContainer(t) { for (;t;) { if (t.statics.blotName === m.blotName) { return t; } t = t.parent; } return null; }

            static register() { e().register(m); }

            setReplace(t, e) { t ? this.parent.replaceWith($.blotName, e) : this.wrap($.blotName, e); }
        }v.blotName = "table-list", v.className = "table-list", e().register({ "formats/table-list": v }, !0), m.allowedChildren = [v], v.requiredContainer = m; const y = e().import("formats/header"); class w extends y {
            static create(t) {
                const { cellId: e, value: n } = t,
                    r = super.create(n); return r.setAttribute("data-cell", e), r;
            }

            format(t, e, n) {
                if (t === "header") {
                    const t = this.statics.formats(this.domNode).value,
                        n = this.domNode.getAttribute("data-cell"); t != e && e ? super.format("table-header", { cellId: n, value: e }) : this.replaceWith(W.blotName, n);
                } else { if (t === "list") { const [t, r] = this.getCellFormats(this.parent); return n ? this.wrap(m.blotName, Object.assign(Object.assign({}, t), { cellId: r })) : this.wrap($.blotName, t), this.replaceWith("table-list", e); } if (t === $.blotName) { return this.wrap(t, e); } if (t !== this.statics.blotName || e) { super.format(t, e); } else { const t = this.domNode.getAttribute("data-cell"); this.replaceWith(W.blotName, t); } }
            }

            static formats(t) { return { cellId: t.getAttribute("data-cell"), value: this.tagName.indexOf(t.tagName) + 1 }; }

            formats() {
                const t = this.attributes.values(),
                    e = this.statics.formats(this.domNode, this.scroll); return e != null && (t[this.statics.blotName] = e), t;
            }

            getCellFormats(t) { return N(B(t)); }
        }w.blotName = "table-header", w.className = "ql-table-header", e().register({ "formats/table-header": w }, !0); const x = w; function k(t) {
            if (typeof t !== "string" || !t) { return t; } const e = t.slice(-2),
                n = t.slice(0, -2); return `${Math.round(parseFloat(n))}${e}`;
        } function C(t) { const e = document.createElement("div"); return e.innerText = t, e.classList.add("ql-table-tooltip", "ql-hidden"), e; } function _(t) { return t.replace(/mso.*?;/g, ""); } function T(t) {
            const [e] = t.descendant(W),
                [n] = t.descendant(m),
                [r] = t.descendant(x); return e || n || r;
        } function N(t) {
            const e = $.formats(t.domNode),
                n = T(t); if (n) { return [e, A(n.formats()[n.statics.blotName])]; } { const t = e["data-row"].split("-")[1]; return [e, `cell-${t}`]; }
        } function A(t) { return t instanceof Object ? t.cellId : t; } function L(t, e) { return t.closest(e); } function S(t, e) {
            return {
                left: Math.min(t.left, e.left), right: Math.max(t.right, e.right), top: Math.min(t.top, e.top), bottom: Math.max(t.bottom, e.bottom),
            };
        } function E(t, n, r) { const i = e().find(n).descendants(Z); let s = 0; return i.reduce(((e, n) => { const { left: i, width: o } = M(n.domNode, r); return s = s || i, s + 2 >= t.left && s - 2 + o <= t.right && e.push(n.domNode), s += o, e; }), []); } function j(t, n, r, i) {
            return e().find(n).descendants($).reduce(((e, n) => {
                const {
                    left: s, top: o, width: l, height: a,
                } = M(n.domNode, r); switch (i) { case "column": (s + 2 >= t.left && s - 2 + l <= t.right || s + 2 < t.right && t.right < s - 2 + l || t.left > s + 2 && t.left < s - 2 + l) && e.push(n.domNode); break; case "row": break; default: s + 2 >= t.left && s - 2 + l <= t.right && o + 2 >= t.top && o - 2 + a <= t.bottom && e.push(n.domNode); } return e;
            }), []);
        } function q(t) { return t.replace(/data-[a-z]+="[^"]*"/g, "").replace(/class="[^"]*"/g, (t => t.replace("ql-cell-selected", "").replace("ql-cell-focused", "").replace("ql-table-block", ""))).replace(/class="\s*"/g, ""); } function M(t, e) {
            const n = t.getBoundingClientRect(),
                r = e.getBoundingClientRect(),
                i = n.left - r.left - e.scrollLeft,
                s = n.top - r.top - e.scrollTop,
                o = n.width,
                l = n.height; return {
                left: i, top: s, width: o, height: l, right: i + o, bottom: s + l,
            };
        } function B(t) { for (;t;) { if (t.statics.blotName === $.blotName) { return t; } t = t.parent; } return null; } function O(t, e) {
            const n = getComputedStyle(t),
                r = t.style; return e.reduce(((t, e) => {
                return t[e] = (i = r.getPropertyValue(e) || n.getPropertyValue(e)).startsWith("rgba(") ? (function (t) {
                    t = t.replace(/^[^\d]+/, "").replace(/[^\d]+$/, ""); const e = Math.round(+t[0]),
                        n = Math.round(+t[1]),
                        r = Math.round(+t[2]),
                        i = Math.round(255 * +t[3]).toString(16).toUpperCase().padStart(2, "0"); return `#${((1 << 24) + (e << 16) + (n << 8) + r).toString(16).slice(1)}${i}`;
                }(i)) : i.startsWith("rgb(") ? `#${(i = i.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "")).split(",").map((t => `00${parseInt(t, 10).toString(16)}`.slice(-2))).join("")}` : i, t; let i;
            }), {});
        } function R(t) { return !t || (!!/^#([A-Fa-f0-9]{3,6})$/.test(t) || !!/^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/.test(t) || (function (t) { for (const e of d) { if (e === t) { return !0; } } return !1; }(t))); } function P(t) { if (!t) { return !0; } const e = t.slice(-2); return e === "px" || e === "em" || !/[a-z]/.test(e) && !isNaN(parseFloat(e)); } function I(t, e) { for (const n in e) { t.setAttribute(n, e[n]); } } function D(t, e) { const n = t.style; if (n) { for (const t in e) { n.setProperty(t, e[t]); } } else { t.setAttribute("style", e.toString()); } } function z(t, n, r) {
            if (!(t == null ? void 0 : t.style.getPropertyValue("width"))) { return; } const i = e().find(t); if (!i) { return; } const s = i.colgroup(),
                o = i.temporary(); if (s) { let t = 0; const e = s.domNode.querySelectorAll("col"); for (const n of e) { t += ~~n.getAttribute("width"); }D(o.domNode, { width: `${t}px` }); } else { D(o.domNode, { width: `${~~(n.width + r)}px` }); }
        } const H = e().import("blots/block"),
            F = (e().import("blots/break"), e().import("blots/container")),
            V = ["border", "cellspacing", "style", "data-class"],
            U = ["width"]; class W extends H {
            static create(t) { const e = super.create(); return t ? e.setAttribute("data-cell", t) : e.setAttribute("data-cell", Q()), e; }

            format(t, e) { const n = this.formats()[this.statics.blotName]; if (t === $.blotName && e) { return this.wrap(G.blotName), this.wrap(t, e); } if (t === J.blotName) { this.wrap(t, e); } else { if (t === "header") { return this.replaceWith("table-header", { cellId: n, value: e }); } if (t === "table-header" && e) { return this.wrapTableCell(this.parent), this.replaceWith(t, e); } if (t === "list" || t === "table-list" && e) { const t = this.getCellFormats(this.parent); return this.wrap(m.blotName, Object.assign(Object.assign({}, t), { cellId: n })), this.replaceWith("table-list", e); } super.format(t, e); } }

            formats() {
                const t = this.attributes.values(),
                    e = this.domNode.getAttribute("data-cell"); return e != null && (t[this.statics.blotName] = e), t;
            }

            getCellFormats(t) { const e = B(t); if (!e) { return {}; } const [n] = N(e); return n; }

            wrapTableCell(t) { const e = B(t); if (!e) { return; } const [n] = N(e); this.wrap($.blotName, n); }
        }W.blotName = "table-cell-block", W.className = "ql-table-block", W.tagName = "P"; class $ extends F {
            checkMerge() {
                if (super.checkMerge() && this.next.children.head != null && this.next.children.head.formats) {
                    const t = this.children.head.formats()[this.children.head.statics.blotName],
                        e = this.children.tail.formats()[this.children.tail.statics.blotName],
                        n = this.next.children.head.formats()[this.next.children.head.statics.blotName],
                        r = this.next.children.tail.formats()[this.next.children.tail.statics.blotName],
                        i = A(t),
                        s = A(e),
                        o = A(n),
                        l = A(r); return i === s && i === o && i === l;
                } return !1;
            }

            static create(t) {
                const e = super.create(),
                    n = Object.keys(t); for (const r of n) { t[r] && e.setAttribute(r, t[r]); } return e;
            }

            static formats(t) {
                const e = this.getEmptyRowspan(t),
                    n = c.reduce(((n, r) => (t.hasAttribute(r) && (n[r] = r === "rowspan" && e ? `${~~t.getAttribute(r) - e}` : _(t.getAttribute(r))), n)), {}); return this.hasColgroup(t) && (delete n.width, n.style && (n.style = n.style.replace(/width.*?;/g, ""))), n;
            }

            formats() { const t = this.statics.formats(this.domNode, this.scroll); return { [this.statics.blotName]: t }; }

            static getEmptyRowspan(t) {
                let e = t.parentElement.nextElementSibling,
                    n = 0; for (;e && e.tagName === "TR" && !e.innerHTML.replace(/\s/g, "");) { n++, e = e.nextElementSibling; } return n;
            }

            static hasColgroup(t) { for (;t && t.tagName !== "TBODY";) { t = t.parentElement; } for (;t;) { if (t.tagName === "COLGROUP") { return !0; } t = t.previousElementSibling; } return !1; }

            html() { return this.domNode.outerHTML.replace(/<(ol)[^>]*><li[^>]* data-list="bullet">(?:.*?)<\/li><\/(ol)>/gi, ((t, e, n) => t.replace(e, "ul").replace(n, "ul"))); }

            row() { return this.parent; }

            rowOffset() { return this.row() ? this.row().rowOffset() : -1; }

            setChildrenId(t) { this.children.forEach(((e) => { e.domNode.setAttribute("data-cell", t); })); }

            table() { let t = this.parent; for (;t != null && t.statics.blotName !== "table-container";) { t = t.parent; } return t; }

            optimize(...t) { super.optimize(...t), this.children.forEach(((t) => { if (t.next != null && A(t.formats()[t.statics.blotName]) !== A(t.next.formats()[t.next.statics.blotName])) { const e = this.splitAfter(t); e && e.optimize(), this.prev && this.prev.optimize(); } })); }
        }$.blotName = "table-cell", $.tagName = "TD"; class G extends F {
            checkMerge() {
                if (super.checkMerge() && this.next.children.head != null && this.next.children.head.formats) {
                    const t = this.children.head.formats()[this.children.head.statics.blotName],
                        e = this.children.tail.formats()[this.children.tail.statics.blotName],
                        n = this.next.children.head.formats()[this.next.children.head.statics.blotName],
                        r = this.next.children.tail.formats()[this.next.children.tail.statics.blotName]; return t["data-row"] === e["data-row"] && t["data-row"] === n["data-row"] && t["data-row"] === r["data-row"];
                } return !1;
            }

            rowOffset() { return this.parent ? this.parent.children.indexOf(this) : -1; }
        }G.blotName = "table-row", G.tagName = "TR"; class K extends F {}K.blotName = "table-body", K.tagName = "TBODY"; class Y extends H {
            static create(t) {
                const e = super.create(),
                    n = Object.keys(t); for (const r of n) { e.setAttribute(r, t[r]); } return e;
            }

            static formats(t) { return V.reduce(((e, n) => (t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e)), {}); }

            formats() { const t = this.statics.formats(this.domNode, this.scroll); return { [this.statics.blotName]: t }; }

            optimize(...t) { if (this.statics.requiredContainer && this.parent instanceof this.statics.requiredContainer) { const t = this.formats()[this.statics.blotName]; for (const e of V) { t[e] ? e === "data-class" ? this.parent.domNode.setAttribute("class", t[e]) : this.parent.domNode.setAttribute(e, t[e]) : this.parent.domNode.removeAttribute(e); } } super.optimize(...t); }
        }Y.blotName = "table-temporary", Y.className = "ql-table-temporary", Y.tagName = "temporary"; class Z extends H {
            static create(t) {
                const e = super.create(),
                    n = Object.keys(t); for (const r of n) { e.setAttribute(r, t[r]); } return e;
            }

            static formats(t) { return U.reduce(((e, n) => (t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e)), {}); }

            formats() { const t = this.statics.formats(this.domNode, this.scroll); return { [this.statics.blotName]: t }; }

            html() { return this.domNode.outerHTML; }
        }Z.blotName = "table-col", Z.tagName = "COL"; class X extends F {}X.blotName = "table-colgroup", X.tagName = "COLGROUP"; class J extends F {
            colgroup() { const [t] = this.descendant(X); return t || this.findChild("table-colgroup"); }

            deleteColumn(t, n, r, i = []) {
                const s = this.tbody(),
                    o = this.descendants($); if (s != null && s.children.head != null) { if (n.length === o.length) { r(); } else { for (const [n, r] of t) { this.setCellColspan(e().find(n), r); } for (const t of [...n, ...i]) { t.parentElement.children.length === 1 && this.setCellRowspan(t.parentElement.previousElementSibling), t.remove(); } } }
            }

            deleteRow(t, e) {
                const n = this.tbody(); if (n != null && n.children.head != null) {
                    if (t.length === n.children.length) { e(); } else {
                        const e = new WeakMap(),
                            r = [],
                            i = [],
                            s = this.getMaxColumns(n.children.head.children); for (const n of t) {
                            const r = this.getCorrectRow(n, s); r && r.children.forEach(((n) => {
                                let r; const s = ~~n.domNode.getAttribute("rowspan") || 1; if (s > 1) {
                                    const o = n.statics.blotName,
                                        [l] = N(n); if (t.includes(n.parent)) { const t = (r = n.parent) === null || void 0 === r ? void 0 : r.next; if (e.has(n)) { const { rowspan: r } = e.get(n); e.set(n, { next: t, rowspan: r - 1 }); } else { e.set(n, { next: t, rowspan: s - 1 }), i.push(n); } } else { n.replaceWith(o, Object.assign(Object.assign({}, l), { rowspan: s - 1 })); }
                                }
                            }));
                        } for (const t of i) {
                            const [n] = N(t),
                                { right: i, width: s } = t.domNode.getBoundingClientRect(),
                                { next: o, rowspan: l } = e.get(t); this.setColumnCells(o, r, { position: i, width: s }, n, l, t);
                        } for (const [t, e, n, i] of r) { const r = this.scroll.create($.blotName, e); i.moveChildren(r); const s = Q(); r.setChildrenId(s), t.insertBefore(r, n), i.remove(); } for (const e of t) { e.remove(); }
                    }
                }
            }

            deleteTable() { this.remove(); }

            findChild(t) { let e = this.children.head; for (;e;) { if (e.statics.blotName === t) { return e; } e = e.next; } return null; }

            getCopyTable() { return this.domNode.outerHTML.replace(/<temporary[^>]*>(.*?)<\/temporary>/gi, "").replace(/<td[^>]*>(.*?)<\/td>/gi, (t => q(t))); }

            getCorrectRow(t, e) { let n = !1; for (;t && !n;) { if (e === this.getMaxColumns(t.children)) { return n = !0, t; } t = t.prev; } return t; }

            getInsertRow(t, e, n) {
                const r = this.tbody(); if (r == null || r.children.head == null) { return; } const i = tt(),
                    s = this.scroll.create(G.blotName),
                    o = this.getMaxColumns(r.children.head.children); return this.getMaxColumns(t.children) === o ? (t.children.forEach(((t) => {
                    const e = { height: "24", "data-row": i },
                        n = ~~t.domNode.getAttribute("colspan") || 1; this.insertTableCell(n, e, s);
                })), s) : (this.getCorrectRow(t.prev, o).children.forEach(((t) => {
                    const r = { height: "24", "data-row": i },
                        o = ~~t.domNode.getAttribute("colspan") || 1,
                        l = ~~t.domNode.getAttribute("rowspan") || 1; if (l > 1) { if (n > 0 && !e) { this.insertTableCell(o, r, s); } else { const [e] = N(t); t.replaceWith(t.statics.blotName, Object.assign(Object.assign({}, e), { rowspan: l + 1 })); } } else { this.insertTableCell(o, r, s); }
                })), s);
            }

            getMaxColumns(t) { return t.reduce(((t, e) => t + (~~e.domNode.getAttribute("colspan") || 1)), 0); }

            insertColumn(t, e, n, r) {
                const i = this.colgroup(),
                    s = this.tbody(); if (s == null || s.children.head == null) { return; } const o = [],
                    l = []; let a = s.children.head; for (;a;) { if (e && r > 0) { const t = a.children.tail.domNode.getAttribute("data-row"); o.push([a, t, null, null]); } else { this.setColumnCells(a, o, { position: t, width: n }); }a = a.next; } if (i) {
                    if (e) { l.push([i, null]); } else {
                        let e = 0,
                            n = 0,
                            r = i.children.head; for (;r;) { const { left: s, width: o } = r.domNode.getBoundingClientRect(); if (e = e || s, n = e + o, Math.abs(e - t) <= 2) { l.push([i, r]); break; } if (Math.abs(n - t) <= 2 && !r.next) { l.push([i, null]); break; }e += o, r = r.next; }
                    }
                } for (const [t, e, n] of o) { t ? this.insertColumnCell(t, e, n) : this.setCellColspan(n, 1); } for (const [t, e] of l) { this.insertCol(t, e); }
            }

            insertCol(t, e) { const n = this.scroll.create(Z.blotName, { width: "72" }); t.insertBefore(n, e); }

            insertColumnCell(t, e, n) {
                const r = this.colgroup() ? { "data-row": e } : { "data-row": e, width: "72" },
                    i = this.scroll.create($.blotName, r),
                    s = this.scroll.create(W.blotName, Q()); if (i.appendChild(s), !t) { const e = this.tbody(); t = this.scroll.create(G.blotName), e.insertBefore(t, null); } return t.insertBefore(i, n), s.optimize(), i;
            }

            insertRow(t, e) {
                const n = this.tbody(); if (n == null || n.children.head == null) { return; } const r = n.children.at(t),
                    i = r || n.children.at(t - 1),
                    s = this.getInsertRow(i, r, e); n.insertBefore(s, r);
            }

            insertTableCell(t, e, n) {
                t > 1 ? Object.assign(e, { colspan: t }) : delete e.colspan; const r = this.scroll.create($.blotName, e),
                    i = this.scroll.create(W.blotName, Q()); r.appendChild(i), n.appendChild(r), i.optimize();
            }

            optimize(...t) { super.optimize(...t); const e = this.descendants(Y); if (this.setClassName(e), e.length > 1) { e.shift(); for (const t of e) { t.remove(); } } }

            setCellColspan(t, e) {
                const n = t.statics.blotName,
                    r = t.formats()[n],
                    i = (~~r.colspan || 1) + e; i > 1 ? Object.assign(r, { colspan: i }) : delete r.colspan, t.replaceWith(n, r);
            }

            setCellRowspan(t) {
                for (;t;) {
                    const n = t.querySelectorAll("td[rowspan]"); if (n.length) {
                        for (const t of n) {
                            const n = e().find(t),
                                r = n.statics.blotName,
                                i = n.formats()[r],
                                s = (~~i.rowspan || 1) - 1,
                                o = T(n); s > 1 ? Object.assign(i, { rowspan: s }) : delete i.rowspan, o.format(r, i);
                        } break;
                    }t = t.previousElementSibling;
                }
            }

            setClassName(t) {
                const e = this.statics.defaultClassName,
                    n = t[0],
                    r = this.domNode.getAttribute("class"),
                    i = (t) => { const n = (t || "").split(/\s+/); return n.find((t => t === e)) || n.unshift(e), n.join(" ").trim(); },
                    s = (t, e) => { t.domNode.setAttribute("data-class", e); }; if (n) { const t = n.domNode.getAttribute("data-class"); t !== r && r != null && s(n, i(r)), r || t || s(n, e); } else {
                    const t = this.prev; if (!t) { return; } const [n] = t.descendant($),
                        [o] = t.descendant(Y); if (!n && o) { const t = o.domNode.getAttribute("data-class"); t !== r && r != null && s(o, i(r)), r || t || s(o, e); }
                }
            }

            setColumnCells(t, e, n, r, i, s) {
                if (!t) { return; } const { position: o, width: l } = n; let a = t.children.head; for (;a;) {
                    const { left: n, right: c } = a.domNode.getBoundingClientRect(),
                        u = a.domNode.getAttribute("data-row"); typeof r === "object" && Object.assign(r, { rowspan: i, "data-row": u }); const h = r || u; if (Math.abs(n - o) <= 2) { e.push([t, h, a, s]); break; } if (Math.abs(c - o) <= 2 && !a.next) { e.push([t, h, null, s]); break; } if (Math.abs(n - o - l) <= 2) { e.push([t, h, a, s]); break; } if (o > n && o < c) { e.push([null, h, a, s]); break; }a = a.next;
                }
            }

            tbody() { const [t] = this.descendant(K); return t || this.findChild("table-body"); }

            temporary() { const [t] = this.descendant(Y); return t; }
        } function Q() { return `cell-${Math.random().toString(36).slice(2, 6)}`; } function tt() { return `row-${Math.random().toString(36).slice(2, 6)}`; }J.blotName = "table-container", J.defaultClassName = "ql-table-better", J.tagName = "TABLE", J.allowedChildren = [K, Y, X], K.requiredContainer = J, Y.requiredContainer = J, X.requiredContainer = J, K.allowedChildren = [G], G.requiredContainer = K, X.allowedChildren = [Z], Z.requiredContainer = X, G.allowedChildren = [$], $.requiredContainer = G, $.allowedChildren = [W, x, m], W.requiredContainer = $, x.requiredContainer = $, m.requiredContainer = $; const et = r(930),
            nt = r.n(et), rt = ["border", "cellspacing", "style", "class"]; function it(t, e, n) { return typeof e === "object" ? Object.keys(e).reduce(((t, n) => it(t, n, e[n])), t) : t.reduce(((t, r) => (r.attributes && r.attributes[e] ? t.push(r) : t.insert(r.insert, nt()({}, { [e]: n }, r.attributes)))), new (s())()); } function st(t, e) {
            const n = t.parentNode.tagName === "TABLE" ? t.parentNode : t.parentNode.parentNode,
                r = Array.from(n.querySelectorAll("tr")).indexOf(t) + 1; return t.innerHTML.replace(/\s/g, "") ? it(e, "table-cell", r) : new (s())();
        } function ot(t, e) {
            let n; const r = t.parentNode.parentNode.tagName === "TABLE" ? t.parentNode.parentNode : t.parentNode.parentNode.parentNode,
                i = Array.from(r.querySelectorAll("tr")),
                s = t.tagName,
                o = Array.from(t.parentNode.querySelectorAll(s)),
                l = t.getAttribute("data-row") || i.indexOf(t.parentNode) + 1,
                a = ((n = t == null ? void 0 : t.firstElementChild) === null || void 0 === n ? void 0 : n.getAttribute("data-cell")) || o.indexOf(t) + 1; return e.length() || e.insert("\n", { "table-cell": { "data-row": l } }), e.ops.forEach(((t) => { t.attributes && t.attributes["table-cell"] && (t.attributes["table-cell"] = Object.assign(Object.assign({}, t.attributes["table-cell"]), { "data-row": l })); })), it((function (t, e, n) { const r = $.formats(t); return t.tagName === "TH" ? (e.ops.forEach(((t) => { typeof t.insert !== "string" || t.insert.endsWith("\n") || (t.insert += "\n"); })), it(e, "table-cell", Object.assign(Object.assign({}, r), { "data-row": n }))) : e; }(t, e, l)), "table-cell-block", a);
        } function lt(t, e) {
            let n = ~~t.getAttribute("span") || 1; const r = t.getAttribute("width"),
                i = new (s())(); for (;n > 1;) { i.insert("\n", { "table-col": { width: r } }), n--; } return i.concat(e);
        } function at(t, e) { const n = rt.reduce(((e, n) => (t.hasAttribute(n) && (n === "class" ? e["data-class"] = t.getAttribute(n) : e[n] = _(t.getAttribute(n))), e)), {}); return (new (s())()).insert("\n", { "table-temporary": n }).concat(e); } const ct = {
                col: "Column", insColL: "Insert column left", insColR: "Insert column right", delCol: "Delete column", row: "Row", insRowAbv: "Insert row above", insRowBlw: "Insert row below", delRow: "Delete row", mCells: "Merge cells", sCell: "Split cell", tblProps: "Table properties", cellProps: "Cell properties", insParaOTbl: "Insert paragraph outside the table", insB4: "Insert before", insAft: "Insert after", copyTable: "Copy table", delTable: "Delete table", border: "Border", color: "Color", width: "Width", background: "Background", dims: "Dimensions", height: "Height", padding: "Padding", tblCellTxtAlm: "Table cell text alignment", alCellTxtL: "Align cell text to the left", alCellTxtC: "Align cell text to the center", alCellTxtR: "Align cell text to the right", jusfCellTxt: "Justify cell text", alCellTxtT: "Align cell text to the top", alCellTxtM: "Align cell text to the middle", alCellTxtB: "Align cell text to the bottom", dimsAlm: "Dimensions and alignment", alTblL: "Align table to the left", tblC: "Center table", alTblR: "Align table to the right", save: "Save", cancel: "Cancel", colorMsg: "The color is invalid. Try \"#FF0000\" or \"rgb(255,0,0)\" or \"red\".", dimsMsg: "The value is invalid. Try \"10px\" or \"2em\" or simply \"2\".", colorPicker: "Color picker", removeColor: "Remove color", black: "Black", dimGrey: "Dim grey", grey: "Grey", lightGrey: "Light grey", white: "White", red: "Red", orange: "Orange", yellow: "Yellow", lightGreen: "Light green", green: "Green", aquamarine: "Aquamarine", turquoise: "Turquoise", lightBlue: "Light blue", blue: "Blue", purple: "Purple",
            },
            ut = {
                col: "列", insColL: "向左插入列", insColR: "向右插入列", delCol: "删除列", row: "行", insRowAbv: "在上面插入行", insRowBlw: "在下面插入行", delRow: "删除行", mCells: "合并单元格", sCell: "拆分单元格", tblProps: "表格属性", cellProps: "单元格属性", insParaOTbl: "在表格外插入段落", insB4: "在表格前面插入", insAft: "在表格后面插入", copyTable: "复制表格", delTable: "删除表格", border: "边框", color: "颜色", width: "宽度", background: "背景", dims: "尺寸", height: "高度", padding: "内边距", tblCellTxtAlm: "单元格文本对齐方式", alCellTxtL: "左对齐", alCellTxtC: "水平居中对齐", alCellTxtR: "右对齐", jusfCellTxt: "两边对齐", alCellTxtT: "顶端对齐", alCellTxtM: "垂直居中对齐", alCellTxtB: "底部对齐", dimsAlm: "尺寸和对齐方式", alTblL: "表格左对齐", tblC: "表格居中", alTblR: "表格右对齐", save: "保存", cancel: "取消", colorMsg: "无效颜色，请使用 \"#FF0000\" 或者 \"rgb(255,0,0)\" 或者 \"red\"", dimsMsg: "无效值， 请使用 \"10px\" 或者 \"2em\" 或者 \"2\"", colorPicker: "颜色选择器", removeColor: "删除颜色", black: "黑色", dimGrey: "暗灰色", grey: "灰色", lightGrey: "浅灰色", white: "白色", red: "红色", orange: "橙色", yellow: "黄色", lightGreen: "浅绿色", green: "绿色", aquamarine: "海蓝色", turquoise: "青绿色", lightBlue: "浅蓝色", blue: "蓝色", purple: "紫色",
            },
            ht = {
                col: "Colonne", insColL: "Insérer colonne à gauche", insColR: "Insérer colonne à droite", delCol: "Supprimer la colonne", row: "Ligne", insRowAbv: "Insérer ligne au-dessus", insRowBlw: "Insérer ligne en dessous", delRow: "Supprimer la ligne", mCells: "Fusionner les cellules", sCell: "Diviser la cellule", tblProps: "Propriétés du tableau", cellProps: "Propriétés de la cellule", insParaOTbl: "Insérer paragraphe en dehors du tableau", insB4: "Insérer avant", insAft: "Insérer après", copyTable: "Copier le tableau", delTable: "Supprimer le tableau", border: "Bordure", color: "Couleur", width: "Largeur", background: "Arrière-plan", dims: "Dimensions", height: "Hauteur", padding: "Marge intérieure", tblCellTxtAlm: "Alignement du texte de la cellule du tableau", alCellTxtL: "Aligner le texte de la cellule à gauche", alCellTxtC: "Aligner le texte de la cellule au centre", alCellTxtR: "Aligner le texte de la cellule à droite", jusfCellTxt: "Justifier le texte de la cellule", alCellTxtT: "Aligner le texte de la cellule en haut", alCellTxtM: "Aligner le texte de la cellule au milieu", alCellTxtB: "Aligner le texte de la cellule en bas", dimsAlm: "Dimensions et alignement", alTblL: "Aligner le tableau à gauche", tblC: "Centrer le tableau", alTblR: "Aligner le tableau à droite", save: "Enregistrer", cancel: "Annuler", colorMsg: "La couleur est invalide. Essayez \"#FF0000\" ou \"rgb(255,0,0)\" ou \"rouge\".", dimsMsg: "La valeur est invalide. Essayez \"10px\" ou \"2em\" ou simplement \"2\".", colorPicker: "Sélecteur de couleur", removeColor: "Supprimer la couleur", black: "Noir", dimGrey: "Gris foncé", grey: "Gris", lightGrey: "Gris clair", white: "Blanc", red: "Rouge", orange: "Orange", yellow: "Jaune", lightGreen: "Vert clair", green: "Vert", aquamarine: "Aigue-marine", turquoise: "Turquoise", lightBlue: "Bleu clair", blue: "Bleu", purple: "Violet",
            },
            dt = {
                col: "Kolumna", insColL: "Wstaw kolumnę z lewej", insColR: "Wstaw kolumnę z prawej", delCol: "Usuń kolumnę", row: "Wiersz", insRowAbv: "Wstaw wiersz powyżej", insRowBlw: "Wstaw wiersz poniżej", delRow: "Usuń wiersz", mCells: "Scal komórki", sCell: "Podziel komórkę", tblProps: "Właściwości tabeli", cellProps: "Właściwości komórki", insParaOTbl: "Wstaw akapit poza tabelą", insB4: "Wstaw przed", insAft: "Wstaw po", copyTable: "Kopiuj tabelę", delTable: "Usuń tabelę", border: "Obramowanie", color: "Kolor", width: "Szerokość", background: "Tło", dims: "Wymiary", height: "Wysokość", padding: "Margines wewnętrzny", tblCellTxtAlm: "Wyrównanie tekstu w komórce tabeli", alCellTxtL: "Wyrównaj tekst w komórce do lewej", alCellTxtC: "Wyrównaj tekst w komórce do środka", alCellTxtR: "Wyrównaj tekst w komórce do prawej", jusfCellTxt: "Wyjustuj tekst w komórce", alCellTxtT: "Wyrównaj tekst w komórce do góry", alCellTxtM: "Wyrównaj tekst w komórce do środka", alCellTxtB: "Wyrównaj tekst w komórce do dołu", dimsAlm: "Wymiary i wyrównanie", alTblL: "Wyrównaj tabelę do lewej", tblC: "Wyśrodkuj tabelę", alTblR: "Wyrównaj tabelę do prawej", save: "Zapisz", cancel: "Anuluj", colorMsg: "Kolor jest nieprawidłowy. Spróbuj \"#FF0000\" lub \"rgb(255,0,0)\" lub \"red\".", dimsMsg: "Wartość jest nieprawidłowa. Spróbuj \"10px\" lub \"2em\" lub po prostu \"2\".", colorPicker: "Wybór koloru", removeColor: "Usuń kolor", black: "Czarny", dimGrey: "Przyciemniony szary", grey: "Szary", lightGrey: "Jasnoszary", white: "Biały", red: "Czerwony", orange: "Pomarańczowy", yellow: "Żółty", lightGreen: "Jasnozielony", green: "Zielony", aquamarine: "Akwamaryna", turquoise: "Turkusowy", lightBlue: "Jasnoniebieski", blue: "Niebieski", purple: "Fioletowy",
            },
            pt = {
                col: "Spalte", insColL: "Spalte links einfügen", insColR: "Spalte rechts einfügen", delCol: "Spalte löschen", row: "Zeile", insRowAbv: "Zeile oberhalb einfügen", insRowBlw: "Zeile unterhalb einfügen", delRow: "Zeile löschen", mCells: "Zellen verbinden", sCell: "Zelle teilen", tblProps: "Tabelleneingenschaften", cellProps: "Zelleneigenschaften", insParaOTbl: "Absatz außerhalb der Tabelle einfügen", insB4: "Davor einfügen", insAft: "Danach einfügen", copyTable: "Tabelle kopieren", delTable: "Tabelle löschen", border: "Rahmen", color: "Farbe", width: "Breite", background: "Schattierung", dims: "Maße", height: "Höhe", padding: "Abstand", tblCellTxtAlm: "Ausrichtung", alCellTxtL: "Zellentext links ausrichten", alCellTxtC: "Zellentext mittig ausrichten", alCellTxtR: "Zellentext rechts ausrichten", jusfCellTxt: "Zellentext Blocksatz", alCellTxtT: "Zellentext oben ausrichten", alCellTxtM: "Zellentext mittig ausrichten", alCellTxtB: "Zellentext unten ausrichten", dimsAlm: "Maße und Ausrichtung", alTblL: "Tabelle links ausrichten", tblC: "Tabelle mittig ausrichten", alTblR: "Tabelle rechts ausrichten", save: "Speichern", cancel: "Abbrechen", colorMsg: "Die Farbe ist ungültig. Probiere \"#FF0000\", \"rgb(255,0,0)\" oder \"red\".", dimsMsg: "Der Wert ist ungültig. Probiere \"10px\", \"2em\" oder einfach \"2\".", colorPicker: "Farbwähler", removeColor: "Farbe entfernen", black: "Schwarz", dimGrey: "Dunkelgrau", grey: "Grau", lightGrey: "Hellgrau", white: "Weiß", red: "Rot", orange: "Orange", yellow: "Gelb", lightGreen: "Hellgrün", green: "Grün", aquamarine: "Aquamarin", turquoise: "Türkis", lightBlue: "Hellblau", blue: "Blau", purple: "Lila",
            },
            ft = {
                col: "Столбец", insColL: "Вставить столбец слева", insColR: "Вставить столбец справа", delCol: "Удалить столбец", row: "Строка", insRowAbv: "Вставить строку сверху", insRowBlw: "Вставить строку снизу", delRow: "Удалить строку", mCells: "Объединить ячейки", sCell: "Разбить ячейку", tblProps: "Свойства таблицы", cellProps: "Свойства ячейки", insParaOTbl: "Вставить абзац за пределами таблицы", insB4: "Вставить абзац перед", insAft: "Вставить абзац после", copyTable: "Копировать таблицу", delTable: "Удалить таблицу", border: "Обводка", color: "Цвет", width: "Ширина", background: "Фон", dims: "Размеры", height: "Высота", padding: "Отступ", tblCellTxtAlm: "Выравнивание текста в ячейке таблицы", alCellTxtL: "Выровнять текст в ячейке по левому краю", alCellTxtC: "Выровнять текст в ячейке по центру", alCellTxtR: "Выровнять текст в ячейке по правому краю", jusfCellTxt: "Выровнять текст в ячейке по ширине", alCellTxtT: "Выровнять текст в ячейке по верху", alCellTxtM: "Выровнять текст в ячейке по середине", alCellTxtB: "Выровнять текст в ячейке по низу", dimsAlm: "Размеры и выравнивание", alTblL: "Выровнять таблицу по левому краю", tblC: "Центрировать таблицу", alTblR: "Выровнять таблицу по правому краю", save: "Сохранить", cancel: "Отменить", colorMsg: "Неверный цвет. Попробуйте \"#FF0000\", \"rgb(255,0,0)\" или \"red\".", dimsMsg: "Недопустимое значение. Попробуйте \"10px\", \"2em\" или просто \"2\".", colorPicker: "Выбор цвета", removeColor: "Удалить цвет", black: "Черный", dimGrey: "Темно-серый", grey: "Серый", lightGrey: "Светло-серый", white: "Белый", red: "Красный", orange: "Оранжевый", yellow: "Желтый", lightGreen: "Светло-зеленый", green: "Зеленый", aquamarine: "Аквамарин", turquoise: "Бирюзовый", lightBlue: "Светло-голубой", blue: "Синий", purple: "Фиолетовый",
            },
            gt = class {
                constructor(t) {
                    this.config = {
                        en_US: ct, zh_CN: ut, fr_FR: ht, pl_PL: dt, de_DE: pt, ru_RU: ft,
                    }, this.init(t);
                }

                changeLanguage(t) { this.name = t; }

                init(t) { if (void 0 === t || typeof t === "string") { this.changeLanguage(t || "en_US"); } else { const { name: e, content: n } = t; n && this.registry(e, n), e && this.changeLanguage(e); } }

                registry(t, e) { this.config = Object.assign(Object.assign({}, this.config), { [t]: e }); }

                useLanguage(t) { return this.config[this.name][t]; }
            }, bt = e().import("blots/block"),
            { BlockEmbed: mt } = e().import("blots/block"),
            vt = e().import("blots/container"),
            yt = ["bold", "italic", "underline", "strike", "size", "color", "background", "font", "list", "header", "align", "link", "image"],
            wt = ["link", "image"]; let xt,
            kt,
            Ct,
            _t,
            Tt,
            Nt = class {
                constructor(t, e) { this.quill = t, this.selectedTds = [], this.startTd = null, this.endTd = null, this.disabledList = [], this.singleList = [], this.tableBetter = e, this.quill.root.addEventListener("click", this.handleClick.bind(this)), this.initDocumentListener(), this.initWhiteList(); }

                attach(t) {
                    let e = Array.from(t.classList).find((t => t.indexOf("ql-") === 0)); if (!e) { return; } const [n, r] = this.getButtonsWhiteList(),
                        i = this.getCorrectDisabled(t, e); e = e.slice(3), n.includes(e) || this.disabledList.push(...i), r.includes(e) && this.singleList.push(...i);
                }

                clearSelected() { for (const t of this.selectedTds) { t.classList && t.classList.remove("ql-cell-focused", "ql-cell-selected"); } this.selectedTds = [], this.startTd = null, this.endTd = null; }

                exitTableFocus(t, n) {
                    const r = B(t).table(),
                        i = n ? -1 : r.length(),
                        s = r.offset(this.quill.scroll) + i; this.tableBetter.hideTools(), this.quill.setSelection(s, 0, e().sources.USER);
                }

                getButtonsWhiteList() {
                    const { options: t = {} } = this.tableBetter,
                        { toolbarButtons: e = {} } = t,
                        { whiteList: n = yt, singleWhiteList: r = wt } = e; return [n, r];
                }

                getCopyColumns(t) { const e = t.querySelector("tr"); return Array.from(e.querySelectorAll("td")).reduce(((t, e) => t + (~~e.getAttribute("colspan") || 1)), 0); }

                getCopyData() { const t = e().find(this.selectedTds[0]).table(); if (t.descendants($).length === this.selectedTds.length) { const e = t.getCopyTable(); return { html: e, text: this.getText(e) }; } let n = ""; const r = {}; for (const t of this.selectedTds) { const e = t.getAttribute("data-row"); r[e] || (r[e] = []), r[e].push(t); } for (const t of Object.values(r)) { let e = ""; for (const n of t) { e += q(n.outerHTML); }e = `<tr>${e}</tr>`, n += e; } return n = `<table><tbody>${n}</tbody></table>`, { html: n, text: this.getText(n) }; }

                getCorrectDisabled(t, e) { if (t.tagName !== "SELECT") { return [t]; } const n = t.closest("span.ql-formats"); return n ? [...n.querySelectorAll(`span.${e}.ql-picker`), t] : [t]; }

                getCorrectRow(t, n) {
                    const r = n === "next" ? 0 : -1; let i = (~~t.getAttribute("rowspan") || 1) + r || 1,
                        s = e().find(t).parent; for (;s && i;) { s = s[n], i--; } return s == null ? void 0 : s.domNode;
                }

                getCorrectValue(t, n) {
                    for (const r of this.selectedTds) {
                        const i = e().find(r).html() || r.outerHTML,
                            s = this.quill.clipboard.convert({ html: i, text: "\n" }); for (const e of s.ops) { if (!this.isContinue(e) && (n = this.getListCorrectValue(t, n, e == null ? void 0 : e.attributes)) != ((e == null ? void 0 : e.attributes) && (e == null ? void 0 : e.attributes[t]) || !1)) { return n; } }
                    } return !n;
                }

                getListCorrectValue(t, e, n = {}) { return t !== "list" ? e : e === "check" ? n[t] !== "checked" && n[t] !== "unchecked" && "unchecked" : e; }

                getPasteComputeBounds(t, e, n) {
                    const r = t.getBoundingClientRect(),
                        i = e.getBoundingClientRect(),
                        s = n.domNode.getBoundingClientRect(),
                        o = this.quill.container.getBoundingClientRect(),
                        l = this.quill.container.scrollLeft,
                        a = this.quill.container.scrollTop; return {
                        left: r.left - o.left - l, right: i.right - o.left - l, top: r.top - o.top - a, bottom: s.bottom - o.top - a,
                    };
                }

                getPasteInfo(t, e, n) {
                    let r = 0,
                        i = null,
                        s = null,
                        o = t.parentElement; for (;t;) { if (r += ~~t.getAttribute("colspan") || 1, r >= e) { r = e, i = t; break; }t = t.nextElementSibling; } for (;--n;) { if (!o.nextElementSibling) { s = o.firstElementChild; break; }o = o.nextElementSibling; } return [{ clospan: Math.abs(e - r), cloTd: i }, { rowspan: n, rowTd: s }];
                }

                getPasteLastRow(t, e) { for (;--e && t;) { t = t.next; } return t; }

                getPasteTds(t) { const e = {}; for (const n of t) { const t = n.getAttribute("data-row"); e[t] || (e[t] = []), e[t].push(n); } return Object.values(e); }

                getText(t) { return this.quill.clipboard.convert({ html: t }).filter((t => typeof t.insert === "string")).map((t => t.insert)).join(""); }

                handleClick(t) { if (t.detail < 3 || !this.selectedTds.length) { return; } const { index: n, length: r } = this.quill.getSelection(!0); this.quill.setSelection(n, r - 1, e().sources.SILENT), this.quill.scrollSelectionIntoView(); }

                handleDeleteKeyup(t) { let e; ((e = this.selectedTds) === null || void 0 === e ? void 0 : e.length) < 2 || t.key !== "Backspace" && t.key !== "Delete" || (t.ctrlKey ? (this.tableBetter.tableMenus.deleteColumn(!0), this.tableBetter.tableMenus.deleteRow(!0)) : this.removeSelectedTdsContent()); }

                handleKeyup(t) { switch (t.key) { case "ArrowLeft": case "ArrowRight": this.makeTableArrowLevelHandler(t.key); break; case "ArrowUp": case "ArrowDown": this.makeTableArrowVerticalHandler(t.key); } }

                handleMousedown(t) {
                    this.clearSelected(); const e = t.target.closest("table"); if (!e) { return; } this.tableBetter.tableMenus.destroyTablePropertiesForm(); const n = t.target.closest("td"); this.startTd = n, this.endTd = n, this.selectedTds = [n], n.classList.add("ql-cell-focused"); const r = (t) => { const r = t.target.closest("td"); if (!r) { return; } const i = n.isEqualNode(r); if (i) { return; } this.clearSelected(), this.startTd = n, this.endTd = r; const s = S(M(n, this.quill.container), M(r, this.quill.container)); this.selectedTds = j(s, e, this.quill.container); for (const t of this.selectedTds) { t.classList && t.classList.add("ql-cell-selected"); }i || this.quill.blur(); },
                        i = (t) => { this.setSingleDisabled(), this.setCorrectPositionTds(this.startTd, this.endTd, this.selectedTds), this.quill.root.removeEventListener("mousemove", r), this.quill.root.removeEventListener("mouseup", i); }; this.quill.root.addEventListener("mousemove", r), this.quill.root.addEventListener("mouseup", i);
                }

                initDocumentListener() { document.addEventListener("copy", (t => this.onCaptureCopy(t, !1))), document.addEventListener("cut", (t => this.onCaptureCopy(t, !0))), document.addEventListener("keyup", this.handleDeleteKeyup.bind(this)), document.addEventListener("paste", this.onCapturePaste.bind(this)); }

                initWhiteList() { const t = this.quill.getModule("toolbar"); Array.from(t.container.querySelectorAll("button, select")).forEach(((t) => { this.attach(t); })); }

                insertColumnCell(t, e) { const n = t.tbody(); n && n.children.forEach(((n) => { const r = n.children.tail.domNode.getAttribute("data-row"); for (let i = 0; i < e; i++) { t.insertColumnCell(n, r, null); } })); }

                insertRow(t, n, r) { const i = e().find(r).rowOffset(); for (;n--;) { t.insertRow(i + 1, 1); } }

                insertWith(t) { return typeof t === "string" && t.startsWith("\n") && t.endsWith("\n"); }

                isContinue(t) { return !(!this.insertWith(t.insert) || t.attributes && !t.attributes["table-list"] && !t.attributes["table-header"]); }

                lines(t) { const e = (t) => { let n = []; return t.children.forEach(((t) => { t instanceof vt ? n = n.concat(e(t)) : (function (t) { return t instanceof bt || t instanceof mt; }(t)) && n.push(t); })), n; }; return e(t); }

                makeTableArrowLevelHandler(t) {
                    const e = t === "ArrowLeft" ? this.startTd : this.endTd,
                        n = this.quill.getSelection(); if (!n) { return; } const [r] = this.quill.getLine(n.index),
                        i = B(r); if (!i) { return this.tableBetter.hideTools(); } !i || e && e.isEqualNode(i.domNode) || (this.setSelected(i.domNode, !1), this.tableBetter.showTools(!1));
                }

                makeTableArrowVerticalHandler(t) {
                    const n = t === "ArrowUp",
                        r = this.quill.getSelection(); if (!r) { return; } const [i, s] = this.quill.getLine(r.index),
                        o = n ? "prev" : "next"; if (i[o] && this.selectedTds.length) { const t = i[o].offset(this.quill.scroll) + Math.min(s, i[o].length() - 1); this.quill.setSelection(t, 0, e().sources.USER); } else {
                        if (!this.selectedTds.length) { const t = B(i); if (!t) { return; } return this.tableArrowSelection(n, t), void this.tableBetter.showTools(!1); } const t = n ? this.startTd : this.endTd,
                            r = e().find(t).parent[o],
                            { left: s, right: l } = t.getBoundingClientRect(); if (r) {
                            let t = null,
                                e = r; for (;e && !t;) { let n = e.children.head; for (;n;) { const { left: e, right: r } = n.domNode.getBoundingClientRect(); if (Math.abs(e - s) <= 2) { t = n; break; } if (Math.abs(r - l) <= 2) { t = n; break; }n = n.next; }e = e[o]; }t ? this.tableArrowSelection(n, t) : this.exitTableFocus(i, n);
                        } else { this.exitTableFocus(i, n); }
                    }
                }

                onCaptureCopy(t, e = !1) {
                    let n,
                        r,
                        i; if (((n = this.selectedTds) === null || void 0 === n ? void 0 : n.length) < 2) { return; } if (t.defaultPrevented) { return; } t.preventDefault(); const { html: s, text: o } = this.getCopyData(); (r = t.clipboardData) === null || void 0 === r || r.setData("text/plain", o), (i = t.clipboardData) === null || void 0 === i || i.setData("text/html", s), e && this.removeSelectedTdsContent();
                }

                onCapturePaste(t) {
                    let n,
                        r,
                        i; if (!((n = this.selectedTds) === null || void 0 === n ? void 0 : n.length)) { return; } t.preventDefault(); const s = (r = t.clipboardData) === null || void 0 === r ? void 0 : r.getData("text/html"),
                        o = ((i = t.clipboardData) === null || void 0 === i || i.getData("text/plain"), document.createElement("div")); o.innerHTML = s; const l = Array.from(o.querySelectorAll("tr")); if (!l.length) { return; } const a = e().find(this.startTd),
                        c = a.row(),
                        u = a.table(); this.quill.history.cutoff(); const h = this.getCopyColumns(o),
                        [d, p] = this.getPasteInfo(this.startTd, h, l.length),
                        { clospan: f, cloTd: g } = d,
                        { rowspan: b, rowTd: m } = p; f && this.insertColumnCell(u, f), b && this.insertRow(u, b, m); const v = f ? c.children.tail.domNode : g,
                        y = this.getPasteLastRow(c, l.length),
                        w = this.getPasteComputeBounds(this.startTd, v, y),
                        x = this.getPasteTds(j(w, u.domNode, this.quill.container)),
                        k = l.reduce(((t, e) => (t.push(Array.from(e.querySelectorAll("td"))), t)), []),
                        C = []; for (;k.length;) {
                        const t = k.shift(),
                            n = x.shift(); let r = null,
                            i = null; for (;t.length;) {
                            const s = t.shift(),
                                o = n.shift(); if (o) { r = o, i = this.pasteSelectedTd(o, s); } else {
                                const t = r.getAttribute("data-row"),
                                    n = e().find(r); i = u.insertColumnCell(n.parent, t, n.next), i = this.pasteSelectedTd(i.domNode, s), r = i.domNode;
                            }i && C.push(i.domNode);
                        } for (;n.length;) { n.shift().remove(); }
                    } this.quill.blur(), this.setSelectedTds(C), this.tableBetter.tableMenus.updateMenus(), this.quill.scrollSelectionIntoView();
                }

                pasteSelectedTd(t, n) {
                    const r = t.getAttribute("data-row"),
                        i = $.formats(n); Object.assign(i, { "data-row": r }); const o = e().find(t),
                        l = o.replaceWith(o.statics.blotName, i); this.quill.setSelection(l.offset(this.quill.scroll) + l.length() - 1, 0, e().sources.USER); const a = this.quill.getSelection(!0),
                        c = this.quill.getFormat(a.index),
                        u = n.innerHTML,
                        h = this.getText(u),
                        d = this.quill.clipboard.convert({ text: h, html: u }),
                        p = (new (s())()).retain(a.index).delete(a.length).concat(it(d, c)); return this.quill.updateContents(p, e().sources.USER), l;
                }

                removeCursor() { const t = this.quill.getSelection(!0); t && t.length === 0 && (this.quill.selection.cursor.remove(), this.quill.blur()); }

                removeSelectedTdContent(t) {
                    const n = e().find(t); let r = n.children.head; const i = r.formats()[W.blotName],
                        s = this.quill.scroll.create(W.blotName, i); for (n.insertBefore(s, r); r;) { r.remove(), r = r.next; }
                }

                removeSelectedTdsContent() { if (!(this.selectedTds.length < 2)) { for (const t of this.selectedTds) { this.removeSelectedTdContent(t); } this.tableBetter.tableMenus.updateMenus(); } }

                setCorrectPositionTds(t, e, n) {
                    if (!t || !e || n.length < 2) { return; } const r = n[0],
                        i = n[n.length - 1],
                        s = [...new Set([t, e, r, i])]; s.sort(((t, e) => {
                        const n = t.getBoundingClientRect(),
                            r = e.getBoundingClientRect(); return (n.top <= r.top || n.bottom <= r.bottom) && (n.left <= r.left || n.right <= r.right) ? -1 : 1;
                    })), this.startTd = s[0], this.endTd = s[s.length - 1];
                }

                setDisabled(t) { for (const e of this.disabledList) { t ? e.classList.add("ql-table-button-disabled") : e.classList.remove("ql-table-button-disabled"); } this.setSingleDisabled(); }

                setSelected(t, n = !0) { const r = e().find(t); this.clearSelected(), this.startTd = t, this.endTd = t, this.selectedTds = [t], t.classList.add("ql-cell-focused"), n && this.quill.setSelection(r.offset(this.quill.scroll) + r.length() - 1, 0, e().sources.USER); }

                setSelectedTds(t) { this.clearSelected(), this.startTd = t[0], this.endTd = t[t.length - 1], this.selectedTds = t; for (const t of this.selectedTds) { t.classList && t.classList.add("ql-cell-selected"); } }

                setSelectedTdsFormat(t, n) {
                    const r = [],
                        i = this.quill.getModule("toolbar"); for (const s of this.selectedTds) {
                        if (i.handlers[t] != null) {
                            const o = e().find(s),
                                l = this.lines(o),
                                a = i.handlers[t].call(i, n, l); a && r.push(B(a).domNode);
                        } else { const r = window.getSelection(); r.selectAllChildren(s), this.quill.format(t, n, e().sources.USER), r.removeAllRanges(); }
                    } this.quill.blur(), r.length && this.setSelectedTds(r);
                }

                setSingleDisabled() { for (const t of this.singleList) { this.selectedTds.length > 1 ? t.classList.add("ql-table-button-disabled") : t.classList.remove("ql-table-button-disabled"); } }

                tableArrowSelection(t, n) {
                    const r = t ? "tail" : "head",
                        i = t ? n.children[r].length() - 1 : 0; this.setSelected(n.domNode, !1); const s = n.children[r].offset(this.quill.scroll) + i; this.quill.setSelection(s, 0, e().sources.USER);
                }

                updateSelected(t) { switch (t) { case "column": { const t = this.endTd.nextElementSibling || this.startTd.previousElementSibling; if (!t) { return; } this.setSelected(t); } break; case "row": { const t = this.getCorrectRow(this.endTd, "next") || this.getCorrectRow(this.startTd, "prev"); if (!t) { return; } const e = M(this.startTd, this.quill.container); let n = t.firstElementChild; for (;n;) { const t = M(n, this.quill.container); if (t.left + 2 >= e.left || t.right - 2 >= e.left) { return void this.setSelected(n); } n = n.nextElementSibling; } this.setSelected(t.firstElementChild); } } }
            },
            At = class {
                constructor(t, e) { this.quill = t, this.options = null, this.drag = !1, this.line = null, this.dragBlock = null, this.dragTable = null, this.direction = null, this.tableBetter = e, this.quill.root.addEventListener("mousemove", this.handleMouseMove.bind(this)); }

                createDragBlock() { const t = document.createElement("div"); t.classList.add("ql-operate-block"); const { dragBlockProps: e } = this.getProperty(this.options); D(t, e), this.dragBlock = t, this.quill.container.appendChild(t), this.updateCell(t); }

                createDragTable(t) {
                    const e = document.createElement("div"),
                        n = this.getDragTableProperty(t); e.classList.add("ql-operate-drag-table"), D(e, n), this.dragTable = e, this.quill.container.appendChild(e);
                }

                createOperateLine() {
                    const t = document.createElement("div"),
                        e = document.createElement("div"); t.classList.add("ql-operate-line-container"); const { containerProps: n, lineProps: r } = this.getProperty(this.options); D(t, n), D(e, r), t.appendChild(e), this.quill.container.appendChild(t), this.line = t, this.updateCell(t);
                }

                getCorrectCol(t, e) { let n = t.children.head; for (;n && --e;) { n = n.next; } return n; }

                getDragTableProperty(t) {
                    const {
                            left: e, top: n, width: r, height: i,
                        } = t.getBoundingClientRect(),
                        s = this.quill.container.getBoundingClientRect(); return {
                        left: `${e - s.left}px`, top: `${n - s.top}px`, width: `${r}px`, height: `${i}px`, display: "block",
                    };
                }

                getLevelColSum(t) {
                    let e = t,
                        n = 0; for (;e;) { n += ~~e.getAttribute("colspan") || 1, e = e.previousSibling; } return n;
                }

                getMaxColNum(t) { const e = t.parentElement.children; let n = 0; for (const t of e) { n += ~~t.getAttribute("colspan") || 1; } return n; }

                getProperty(t) {
                    const e = this.quill.container.getBoundingClientRect(),
                        { tableNode: n, cellNode: r, mousePosition: i } = t,
                        { clientX: s, clientY: o } = i,
                        l = n.getBoundingClientRect(),
                        a = r.getBoundingClientRect(),
                        c = a.left + a.width,
                        u = a.top + a.height,
                        h = {
                            width: "8px", height: "8px", top: `${l.bottom - e.top}px`, left: `${l.right - e.left}px`, display: l.bottom > e.bottom ? "none" : "block",
                        }; return Math.abs(c - s) <= 5 ? (this.direction = "level", {
                        dragBlockProps: h,
                        containerProps: {
                            width: "5px", height: `${e.height}px`, top: "0", left: `${c - e.left - 2.5}px`, display: "flex", cursor: "col-resize",
                        },
                        lineProps: { width: "1px", height: "100%" },
                    }) : Math.abs(u - o) <= 5 ? (this.direction = "vertical", {
                        dragBlockProps: h,
                        containerProps: {
                            width: `${e.width}px`, height: "5px", top: `${u - e.top - 2.5}px`, left: "0", display: "flex", cursor: "row-resize",
                        },
                        lineProps: { width: "100%", height: "1px" },
                    }) : (this.hideLine(), { dragBlockProps: h });
                }

                getVerticalCells(t, e) { let n = t.parentElement; for (;e > 1 && n;) { n = n.nextSibling, e--; } return n.children; }

                handleMouseMove(t) {
                    const e = t.target.closest("table"),
                        n = t.target.closest("td"),
                        r = { clientX: t.clientX, clientY: t.clientY }; if (!e || !n) { return void (this.line && !this.drag && (this.hideLine(), this.hideDragBlock())); } const i = { tableNode: e, cellNode: n, mousePosition: r }; if (this.line) { if (this.drag || !n) { return; } this.updateProperty(i); } else { this.options = i, this.createOperateLine(), this.createDragBlock(); }
                }

                hideDragBlock() { this.dragBlock && D(this.dragBlock, { display: "none" }); }

                hideDragTable() { this.dragTable && D(this.dragTable, { display: "none" }); }

                hideLine() { this.line && D(this.line, { display: "none" }); }

                isLine(t) { return t.classList.contains("ql-operate-line-container"); }

                setCellLevelRect(t, n) {
                    const { right: r } = t.getBoundingClientRect(),
                        i = ~~(n - r),
                        s = this.getLevelColSum(t),
                        o = e().find(t).table(),
                        l = o.colgroup(),
                        a = o.domNode.getBoundingClientRect(); if (l) {
                        const t = this.getCorrectCol(l, s),
                            e = t.next,
                            n = t.formats()[t.statics.blotName]; if (t.domNode.setAttribute("width", `${parseFloat(n.width) + i}`), e) { const t = e.formats()[e.statics.blotName]; e.domNode.setAttribute("width", `${parseFloat(t.width) - i}`); }
                    } else {
                        const e = t.nextElementSibling == null,
                            n = t.parentElement.parentElement.children,
                            r = []; for (const t of n) {
                            const n = t.children; if (e) {
                                const t = n[n.length - 1],
                                    { width: e } = t.getBoundingClientRect(); r.push([t, `${~~(e + i)}`]); continue;
                            } let o = 0; for (const t of n) {
                                if (o += ~~t.getAttribute("colspan") || 1, o > s) { break; } if (o === s) {
                                    const { width: e } = t.getBoundingClientRect(),
                                        n = t.nextElementSibling; if (!n) { continue; } const { width: s } = n.getBoundingClientRect(); r.push([t, `${~~(e + i)}`], [n, `${~~(s - i)}`]);
                                }
                            }
                        } for (const [t, e] of r) { I(t, { width: e }), D(t, { width: `${e}px` }); }
                    }t.nextElementSibling == null && z(o.domNode, a, i);
                }

                setCellRect(t, e, n) { this.direction === "level" ? this.setCellLevelRect(t, e) : this.direction === "vertical" && this.setCellVerticalRect(t, n); }

                setCellsRect(t, n, r) {
                    const i = t.parentElement.parentElement.children,
                        s = n / this.getMaxColNum(t),
                        o = r / i.length,
                        l = [],
                        a = e().find(t).table(),
                        c = a.colgroup(),
                        u = a.domNode.getBoundingClientRect(); for (const t of i) {
                        const e = t.children; for (const t of e) {
                            const e = ~~t.getAttribute("colspan") || 1,
                                { width: n, height: r } = t.getBoundingClientRect(); l.push([t, `${Math.ceil(n + s * e)}`, `${Math.ceil(r + o)}`]);
                        }
                    } if (c) { let t = c.children.head; for (const [t,, e] of l) { I(t, { height: e }), D(t, { height: `${e}px` }); } for (;t;) { const { width: e } = t.domNode.getBoundingClientRect(); I(t.domNode, { width: `${Math.ceil(e + s)}` }), t = t.next; } } else { for (const [t, e, n] of l) { I(t, { width: e, height: n }), D(t, { width: `${e}px`, height: `${n}px` }); } }z(a.domNode, u, n);
                }

                setCellVerticalRect(t, e) {
                    const n = ~~t.getAttribute("rowspan") || 1,
                        r = n > 1 ? this.getVerticalCells(t, n) : t.parentElement.children; for (const t of r) {
                        const { top: n } = t.getBoundingClientRect(),
                            r = `${~~(e - n)}`; I(t, { height: r }), D(t, { height: `${r}px` });
                    }
                }

                toggleLineChildClass(t) { const e = this.line.firstElementChild; t ? e.classList.add("ql-operate-line") : e.classList.remove("ql-operate-line"); }

                updateCell(t) {
                    if (!t) { return; } const e = this.isLine(t),
                        n = (t) => { t.preventDefault(), this.drag && (e ? (this.updateDragLine(t.clientX, t.clientY), this.hideDragBlock()) : (this.updateDragBlock(t.clientX, t.clientY), this.hideLine())); },
                        r = (t) => {
                            t.preventDefault(); const { cellNode: i, tableNode: s } = this.options; if (e) { this.setCellRect(i, t.clientX, t.clientY), this.toggleLineChildClass(!1); } else {
                                const { right: e, bottom: n } = s.getBoundingClientRect(),
                                    r = t.clientX - e,
                                    o = t.clientY - n; this.setCellsRect(i, r, o), this.dragBlock.classList.remove("ql-operate-block-move"), this.hideDragBlock(), this.hideDragTable();
                            } this.drag = !1, document.removeEventListener("mousemove", n, !1), document.removeEventListener("mouseup", r, !1), this.tableBetter.tableMenus.updateMenus(s);
                        }; t.addEventListener("mousedown", ((t) => { t.preventDefault(); const { tableNode: i } = this.options; if (e) { this.toggleLineChildClass(!0); } else if (this.dragTable) { const t = this.getDragTableProperty(i); D(this.dragTable, t); } else { this.createDragTable(i); } this.drag = !0, document.addEventListener("mousemove", n), document.addEventListener("mouseup", r); }));
                }

                updateDragBlock(t, e) { const n = this.quill.container.getBoundingClientRect(); this.dragBlock.classList.add("ql-operate-block-move"), D(this.dragBlock, { top: `${~~(e - n.top - 4)}px`, left: `${~~(t - n.left - 4)}px` }), this.updateDragTable(t, e); }

                updateDragLine(t, e) { const n = this.quill.container.getBoundingClientRect(); this.direction === "level" ? D(this.line, { left: `${~~(t - n.left - 2.5)}px` }) : this.direction === "vertical" && D(this.line, { top: `${~~e - n.top - 2.5}px` }); }

                updateDragTable(t, e) {
                    const { top: n, left: r } = this.dragTable.getBoundingClientRect(),
                        i = t - r,
                        s = e - n; D(this.dragTable, { width: `${i}px`, height: `${s}px`, display: "block" });
                }

                updateProperty(t) { const { containerProps: e, lineProps: n, dragBlockProps: r } = this.getProperty(t); e && n && (this.options = t, D(this.line, e), D(this.line.firstChild, n), D(this.dragBlock, r)); }
            },
            Lt = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1692084293475\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2632\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"16\" height=\"16\"><path d=\"M1012.62222223 944.76190506a78.01904747 78.01904747 0 0 1-78.01904747 78.01904747H76.3936505a78.01904747 78.01904747 0 0 1-78.01904747-78.01904747V86.55238079a78.01904747 78.01904747 0 0 1 78.01904747-78.01904746h858.20952426a78.01904747 78.01904747 0 0 1 78.01904747 78.01904746v858.20952427zM466.4888889 554.66666666H76.3936505v390.0952384h390.0952384V554.66666666z m468.11428586 0H544.50793636v390.0952384h390.0952384V554.66666666zM466.4888889 86.55238079H76.3936505v390.0952384h390.0952384V86.55238079z m468.11428586 0H544.50793636v390.0952384h390.0952384V86.55238079z\" fill=\"#515151\" p-id=\"2633\"></path></svg>",
            St = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"18\" height=\"18\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M36 18L24 30L12 18\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",
            Et = {},
            jt = [],
            qt = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i; function Mt(t, e) { for (const n in e) { t[n] = e[n]; } return t; } function Bt(t) { const e = t.parentNode; e && e.removeChild(t); } function Ot(t, e, n) {
            let r,
                i,
                s,
                o,
                l = arguments; if (e = Mt({}, e), arguments.length > 3) { for (n = [n], r = 3; r < arguments.length; r++) { n.push(l[r]); } } if (n != null && (e.children = n), t != null && t.defaultProps != null) { for (i in t.defaultProps) { void 0 === e[i] && (e[i] = t.defaultProps[i]); } } return o = e.key, (s = e.ref) != null && delete e.ref, o != null && delete e.key, Rt(t, e, o, s);
        } function Rt(t, e, n, r) {
            const i = {
                type: t, props: e, key: n, ref: r, __k: null, __p: null, __b: 0, __e: null, l: null, __c: null, constructor: void 0,
            }; return xt.vnode && xt.vnode(i), i;
        } function Pt(t) { return t.children; } function It(t, e) { this.props = t, this.context = e; } function Dt(t, e) { if (e == null) { return t.__p ? Dt(t.__p, t.__p.__k.indexOf(t) + 1) : null; } for (var n; e < t.__k.length; e++) { if ((n = t.__k[e]) != null && n.__e != null) { return n.__e; } } return typeof t.type === "function" ? Dt(t) : null; } function zt(t) {
            let e,
                n; if ((t = t.__p) != null && t.__c != null) { for (t.__e = t.__c.base = null, e = 0; e < t.__k.length; e++) { if ((n = t.__k[e]) != null && n.__e != null) { t.__e = t.__c.base = n.__e; break; } } return zt(t); }
        } function Ht(t) { (!t.__d && (t.__d = !0) && kt.push(t) === 1 || _t !== xt.debounceRendering) && (_t = xt.debounceRendering, (xt.debounceRendering || Ct)(Ft)); } function Ft() {
            let t,
                e,
                n,
                r,
                i,
                s,
                o,
                l; for (kt.sort(((t, e) => e.__v.__b - t.__v.__b)); t = kt.pop();) { t.__d && (n = void 0, r = void 0, s = (i = (e = t).__v).__e, o = e.__P, l = e.u, e.u = !1, o && (n = [], r = Kt(o, i, Mt({}, i), e.__n, void 0 !== o.ownerSVGElement, null, n, l, s == null ? Dt(i) : s), Yt(n, i), r != s && zt(i))); }
        } function Vt(t, e, n, r, i, s, o, l, a) {
            let c,
                u,
                h,
                d,
                p,
                f,
                g,
                b = n && n.__k || jt,
                m = b.length; if (l == Et && (l = s != null ? s[0] : m ? Dt(n, 0) : null), c = 0, e.__k = Ut(e.__k, ((n) => { if (n != null) { if (n.__p = e, n.__b = e.__b + 1, (h = b[c]) === null || h && n.key == h.key && n.type === h.type) { b[c] = void 0; } else { for (u = 0; u < m; u++) { if ((h = b[u]) && n.key == h.key && n.type === h.type) { b[u] = void 0; break; }h = null; } } if (d = Kt(t, n, h = h || Et, r, i, s, o, null, l, a), (u = n.ref) && h.ref != u && (g || (g = [])).push(u, n.__c || d, n), d != null) { if (f == null && (f = d), n.l != null) { d = n.l, n.l = null; } else if (s == h || d != l || d.parentNode == null) { t:if (l == null || l.parentNode !== t) { t.appendChild(d); } else { for (p = l, u = 0; (p = p.nextSibling) && u < m; u += 2) { if (p == d) { break t; } } t.insertBefore(d, l); }e.type == "option" && (t.value = ""); }l = d.nextSibling, typeof e.type === "function" && (e.l = d); } } return c++, n; })), e.__e = f, s != null && typeof e.type !== "function") { for (c = s.length; c--;) { s[c] != null && Bt(s[c]); } } for (c = m; c--;) { b[c] != null && Jt(b[c], b[c]); } if (g) { for (c = 0; c < g.length; c++) { Xt(g[c], g[++c], g[++c]); } }
        } function Ut(t, e, n) { if (n == null && (n = []), t == null || typeof t === "boolean") { e && n.push(e(null)); } else if (Array.isArray(t)) { for (let r = 0; r < t.length; r++) { Ut(t[r], e, n); } } else { n.push(e ? e(function (t) { if (t == null || typeof t === "boolean") { return null; } if (typeof t === "string" || typeof t === "number") { return Rt(null, t, null, null); } if (t.__e != null || t.__c != null) { const e = Rt(t.type, t.props, t.key, null); return e.__e = t.__e, e; } return t; }(t)) : t); } return n; } function Wt(t, e, n) { e[0] === "-" ? t.setProperty(e, n) : t[e] = typeof n === "number" && !1 === qt.test(e) ? `${n}px` : n == null ? "" : n; } function $t(t, e, n, r, i) {
            let s,
                o,
                l,
                a,
                c; if ((e = i ? e === "className" ? "class" : e : e === "class" ? "className" : e) === "key" || e === "children") { } else if (e === "style") { if (s = t.style, typeof n === "string") { s.cssText = n; } else { if (typeof r === "string" && (s.cssText = "", r = null), r) { for (o in r) { n && o in n || Wt(s, o, ""); } } if (n) { for (l in n) { r && n[l] === r[l] || Wt(s, l, n[l]); } } } } else { e[0] === "o" && e[1] === "n" ? (a = e !== (e = e.replace(/Capture$/, "")), c = e.toLowerCase(), e = (c in t ? c : e).slice(2), n ? (r || t.addEventListener(e, Gt, a), (t.t || (t.t = {}))[e] = n) : t.removeEventListener(e, Gt, a)) : e !== "list" && e !== "tagName" && e !== "form" && !i && e in t ? t[e] = n == null ? "" : n : typeof n !== "function" && e !== "dangerouslySetInnerHTML" && (e !== (e = e.replace(/^xlink:?/, "")) ? n == null || !1 === n ? t.removeAttributeNS("http://www.w3.org/1999/xlink", e.toLowerCase()) : t.setAttributeNS("http://www.w3.org/1999/xlink", e.toLowerCase(), n) : n == null || !1 === n ? t.removeAttribute(e) : t.setAttribute(e, n)); }
        } function Gt(t) { return this.t[t.type](xt.event ? xt.event(t) : t); } function Kt(t, e, n, r, i, s, o, l, a, c) {
            let u,
                h,
                d,
                p,
                f,
                g,
                b,
                m,
                v,
                y,
                w = e.type; if (void 0 !== e.constructor) { return null; } (u = xt.__b) && u(e); try { t:if (typeof w === "function") { if (m = e.props, v = (u = w.contextType) && r[u.__c], y = u ? v ? v.props.value : u.__p : r, n.__c ? b = (h = e.__c = n.__c).__p = h.__E : ("prototype" in w && w.prototype.render ? e.__c = h = new w(m, y) : (e.__c = h = new It(m, y), h.constructor = w, h.render = Qt), v && v.sub(h), h.props = m, h.state || (h.state = {}), h.context = y, h.__n = r, d = h.__d = !0, h.__h = []), h.__s == null && (h.__s = h.state), w.getDerivedStateFromProps != null && Mt(h.__s == h.state ? h.__s = Mt({}, h.__s) : h.__s, w.getDerivedStateFromProps(m, h.__s)), d) { w.getDerivedStateFromProps == null && h.componentWillMount != null && h.componentWillMount(), h.componentDidMount != null && o.push(h); } else { if (w.getDerivedStateFromProps == null && l == null && h.componentWillReceiveProps != null && h.componentWillReceiveProps(m, y), !l && h.shouldComponentUpdate != null && !1 === h.shouldComponentUpdate(m, h.__s, y)) { for (h.props = m, h.state = h.__s, h.__d = !1, h.__v = e, e.__e = a != null ? a !== n.__e ? a : n.__e : null, e.__k = n.__k, u = 0; u < e.__k.length; u++) { e.__k[u] && (e.__k[u].__p = e); } break t; }h.componentWillUpdate != null && h.componentWillUpdate(m, h.__s, y); } for (p = h.props, f = h.state, h.context = y, h.props = m, h.state = h.__s, (u = xt.__r) && u(e), h.__d = !1, h.__v = e, h.__P = t, u = h.render(h.props, h.state, h.context), e.__k = Ut(u != null && u.type == Pt && u.key == null ? u.props.children : u), h.getChildContext != null && (r = Mt(Mt({}, r), h.getChildContext())), d || h.getSnapshotBeforeUpdate == null || (g = h.getSnapshotBeforeUpdate(p, f)), Vt(t, e, n, r, i, s, o, a, c), h.base = e.__e; u = h.__h.pop();) { h.__s && (h.state = h.__s), u.call(h); }d || p == null || h.componentDidUpdate == null || h.componentDidUpdate(p, f, g), b && (h.__E = h.__p = null); } else { e.__e = Zt(n.__e, e, n, r, i, s, o, c); }(u = xt.diffed) && u(e); } catch (t) { xt.__e(t, e, n); } return e.__e;
        } function Yt(t, e) { for (var n; n = t.pop();) { try { n.componentDidMount(); } catch (t) { xt.__e(t, n.__v); } }xt.__c && xt.__c(e); } function Zt(t, e, n, r, i, s, o, l) {
            let a,
                c,
                u,
                h,
                d = n.props,
                p = e.props; if (i = e.type === "svg" || i, t == null && s != null) { for (a = 0; a < s.length; a++) { if ((c = s[a]) != null && (e.type === null ? c.nodeType === 3 : c.localName === e.type)) { t = c, s[a] = null; break; } } } if (t == null) { if (e.type === null) { return document.createTextNode(p); } t = i ? document.createElementNS("http://www.w3.org/2000/svg", e.type) : document.createElement(e.type), s = null; } return e.type === null ? d !== p && (s != null && (s[s.indexOf(t)] = null), t.data = p) : e !== n && (s != null && (s = jt.slice.call(t.childNodes)), u = (d = n.props || Et).dangerouslySetInnerHTML, h = p.dangerouslySetInnerHTML, l || (h || u) && (h && u && h.__html == u.__html || (t.innerHTML = h && h.__html || "")), (function (t, e, n, r, i) { let s; for (s in n) { s in e || $t(t, s, null, n[s], r); } for (s in e) { i && typeof e[s] !== "function" || s === "value" || s === "checked" || n[s] === e[s] || $t(t, s, e[s], n[s], r); } }(t, p, d, i, l)), e.__k = e.props.children, h || Vt(t, e, n, r, e.type !== "foreignObject" && i, s, o, Et, l), l || ("value" in p && void 0 !== p.value && p.value !== t.value && (t.value = p.value == null ? "" : p.value), "checked" in p && void 0 !== p.checked && p.checked !== t.checked && (t.checked = p.checked))), t;
        } function Xt(t, e, n) { try { typeof t === "function" ? t(e) : t.current = e; } catch (t) { xt.__e(t, n); } } function Jt(t, e, n) {
            let r,
                i,
                s; if (xt.unmount && xt.unmount(t), (r = t.ref) && Xt(r, null, e), n || typeof t.type === "function" || (n = (i = t.__e) != null), t.__e = t.l = null, (r = t.__c) != null) { if (r.componentWillUnmount) { try { r.componentWillUnmount(); } catch (t) { xt.__e(t, e); } }r.base = r.__P = null; } if (r = t.__k) { for (s = 0; s < r.length; s++) { r[s] && Jt(r[s], e, n); } }i != null && Bt(i);
        } function Qt(t, e, n) { return this.constructor(t, n); } function te(t, e) { for (let n = 0; n < e.length; n++) { const r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r); } } function ee() { return ee = Object.assign || function (t) { for (let e = arguments, n = 1; n < arguments.length; n++) { const r = e[n]; for (const i in r) { Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]); } } return t; }, ee.apply(this, arguments); }xt = {}, It.prototype.setState = function (t, e) { const n = this.__s !== this.state && this.__s || (this.__s = Mt({}, this.state)); (typeof t !== "function" || (t = t(n, this.props))) && Mt(n, t), t != null && this.__v && (this.u = !1, e && this.__h.push(e), Ht(this)); }, It.prototype.forceUpdate = function (t) { this.__v && (t && this.__h.push(t), this.u = !0, Ht(this)); }, It.prototype.render = Pt, kt = [], Ct = typeof Promise === "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, _t = xt.debounceRendering, xt.__e = function (t, e, n) { for (var r; e = e.__p;) { if ((r = e.__c) && !r.__p) { try { if (r.constructor && r.constructor.getDerivedStateFromError != null) { r.setState(r.constructor.getDerivedStateFromError(t)); } else { if (r.componentDidCatch == null) { continue; } r.componentDidCatch(t); } return Ht(r.__E = r); } catch (e) { t = e; } } } throw t; }, Tt = Et; const ne = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",
            re = `[\\s|\\(]+(${ne})[,|\\s]+(${ne})[,|\\s]+(${ne})\\s*\\)?`,
            ie = `[\\s|\\(]+(${ne})[,|\\s]+(${ne})[,|\\s]+(${ne})[,|\\s]+(${ne})\\s*\\)?`,
            se = new RegExp(`rgb${re}`),
            oe = new RegExp(`rgba${ie}`),
            le = new RegExp(`hsl${re}`),
            ae = new RegExp(`hsla${ie}`),
            ce = "^(?:#?|0x?)",
            ue = "([0-9a-fA-F]{1})",
            he = "([0-9a-fA-F]{2})",
            de = new RegExp(`${ce + ue + ue + ue}$`),
            pe = new RegExp(`${ce + ue + ue + ue + ue}$`),
            fe = new RegExp(`${ce + he + he + he}$`),
            ge = new RegExp(`${ce + he + he + he + he}$`),
            be = Math.log,
            me = Math.round,
            ve = Math.floor; function ye(t, e, n) { return Math.min(Math.max(t, e), n); } function we(t, e) {
            const n = t.indexOf("%") > -1,
                r = parseFloat(t); return n ? e / 100 * r : r;
        } function xe(t) { return parseInt(t, 16); } function ke(t) { return t.toString(16).padStart(2, "0"); } const Ce = (function () {
            function t(t, e) {
                this.$ = {
                    h: 0, s: 0, v: 0, a: 1,
                }, t && this.set(t), this.onChange = e, this.initialValue = ee({}, this.$);
            } let e,
                n,
                r = t.prototype; return r.set = function (e) { if (typeof e === "string") { /^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(e) ? this.hexString = e : /^rgba?/.test(e) ? this.rgbString = e : /^hsla?/.test(e) && (this.hslString = e); } else { if (typeof e !== "object") { throw new Error("Invalid color value"); } e instanceof t ? this.hsva = e.hsva : "r" in e && "g" in e && "b" in e ? this.rgb = e : "h" in e && "s" in e && "v" in e ? this.hsv = e : "h" in e && "s" in e && "l" in e ? this.hsl = e : "kelvin" in e && (this.kelvin = e.kelvin); } }, r.setChannel = function (t, e, n) { let r; this[t] = ee({}, this[t], ((r = {})[e] = n, r)); }, r.reset = function () { this.hsva = this.initialValue; }, r.clone = function () { return new t(this); }, r.unbind = function () { this.onChange = void 0; }, t.hsvToRgb = function (t) {
                let e = t.h / 60,
                    n = t.s / 100,
                    r = t.v / 100,
                    i = ve(e),
                    s = e - i,
                    o = r * (1 - n),
                    l = r * (1 - s * n),
                    a = r * (1 - (1 - s) * n),
                    c = i % 6,
                    u = [a, r, r, l, o, o][c],
                    h = [o, o, a, r, r, l][c]; return { r: ye(255 * [r, l, o, o, a, r][c], 0, 255), g: ye(255 * u, 0, 255), b: ye(255 * h, 0, 255) };
            }, t.rgbToHsv = function (t) {
                let e = t.r / 255,
                    n = t.g / 255,
                    r = t.b / 255,
                    i = Math.max(e, n, r),
                    s = Math.min(e, n, r),
                    o = i - s,
                    l = 0,
                    a = i,
                    c = i === 0 ? 0 : o / i; switch (i) { case s: l = 0; break; case e: l = (n - r) / o + (n < r ? 6 : 0); break; case n: l = (r - e) / o + 2; break; case r: l = (e - n) / o + 4; } return { h: 60 * l % 360, s: ye(100 * c, 0, 100), v: ye(100 * a, 0, 100) };
            }, t.hsvToHsl = function (t) {
                let e = t.s / 100,
                    n = t.v / 100,
                    r = (2 - e) * n,
                    i = r <= 1 ? r : 2 - r,
                    s = i < 1e-9 ? 0 : e * n / i; return { h: t.h, s: ye(100 * s, 0, 100), l: ye(50 * r, 0, 100) };
            }, t.hslToHsv = function (t) {
                let e = 2 * t.l,
                    n = t.s * (e <= 100 ? e : 200 - e) / 100,
                    r = e + n < 1e-9 ? 0 : 2 * n / (e + n); return { h: t.h, s: ye(100 * r, 0, 100), v: ye((e + n) / 2, 0, 100) };
            }, t.kelvinToRgb = function (t) {
                let e,
                    n,
                    r,
                    i = t / 100; return i < 66 ? (e = 255, n = -155.25485562709179 - 0.44596950469579133 * (n = i - 2) + 104.49216199393888 * be(n), r = i < 20 ? 0 : 0.8274096064007395 * (r = i - 10) - 254.76935184120902 + 115.67994401066147 * be(r)) : (e = 351.97690566805693 + 0.114206453784165 * (e = i - 55) - 40.25366309332127 * be(e), n = 325.4494125711974 + 0.07943456536662342 * (n = i - 50) - 28.0852963507957 * be(n), r = 255), { r: ye(ve(e), 0, 255), g: ye(ve(n), 0, 255), b: ye(ve(r), 0, 255) };
            }, t.rgbToKelvin = function (e) { for (var n, { r } = e, i = e.b, s = 2e3, o = 4e4; o - s > 0.4;) { n = 0.5 * (o + s); const l = t.kelvinToRgb(n); l.b / l.r >= i / r ? o = n : s = n; } return n; }, e = t, n = [{
 key: "hsv",
get() { const t = this.$; return { h: t.h, s: t.s, v: t.v }; },
set(t) {
 const e = this.$; if (t = ee({}, e, t), this.onChange) {
 const n = {
                h: !1, v: !1, s: !1, a: !1, 
            }; for (const r in e) { n[r] = t[r] != e[r]; } this.$ = t, (n.h || n.s || n.v || n.a) && this.onChange(this, n); 
} else { this.$ = t; } 
} 
}, { key: "hsva", get() { return ee({}, this.$); }, set(t) { this.hsv = t; } }, { key: "hue", get() { return this.$.h; }, set(t) { this.hsv = { h: t }; } }, { key: "saturation", get() { return this.$.s; }, set(t) { this.hsv = { s: t }; } }, { key: "value", get() { return this.$.v; }, set(t) { this.hsv = { v: t }; } }, { key: "alpha", get() { return this.$.a; }, set(t) { this.hsv = ee({}, this.hsv, { a: t }); } }, { key: "kelvin", get() { return t.rgbToKelvin(this.rgb); }, set(e) { this.rgb = t.kelvinToRgb(e); } }, { key: "red", get() { return this.rgb.r; }, set(t) { this.rgb = ee({}, this.rgb, { r: t }); } }, { key: "green", get() { return this.rgb.g; }, set(t) { this.rgb = ee({}, this.rgb, { g: t }); } }, { key: "blue", get() { return this.rgb.b; }, set(t) { this.rgb = ee({}, this.rgb, { b: t }); } }, {
 key: "rgb",
get() {
 const e = t.hsvToRgb(this.$),
                n = e.r,
                r = e.g,
                i = e.b; return { r: me(n), g: me(r), b: me(i) }; 
},
set(e) { this.hsv = ee({}, t.rgbToHsv(e), { a: void 0 === e.a ? 1 : e.a }); } 
}, { key: "rgba", get() { return ee({}, this.rgb, { a: this.alpha }); }, set(t) { this.rgb = t; } }, {
 key: "hsl",
get() {
 let e = t.hsvToHsl(this.$),
                n = e.h,
                r = e.s,
                i = e.l; return { h: me(n), s: me(r), l: me(i) }; 
},
set(e) { this.hsv = ee({}, t.hslToHsv(e), { a: void 0 === e.a ? 1 : e.a }); } 
}, { key: "hsla", get() { return ee({}, this.hsl, { a: this.alpha }); }, set(t) { this.hsl = t; } }, {
 key: "rgbString",
get() { const t = this.rgb; return `rgb(${t.r }, ${t.g }, ${t.b })`; },
set(t) {
 let e,
                n,
                r,
                i,
                s = 1; if ((e = se.exec(t)) ? (n = we(e[1], 255), r = we(e[2], 255), i = we(e[3], 255)) : (e = oe.exec(t)) && (n = we(e[1], 255), r = we(e[2], 255), i = we(e[3], 255), s = we(e[4], 1)), !e) { throw new Error("Invalid rgb string"); } this.rgb = {
                r: n, g: r, b: i, a: s, 
            }; 
} 
}, { key: "rgbaString", get() { const t = this.rgba; return `rgba(${t.r }, ${t.g }, ${t.b }, ${t.a })`; }, set(t) { this.rgbString = t; } }, {
 key: "hexString",
get() { const t = this.rgb; return `#${ke(t.r) }${ke(t.g) }${ke(t.b)}`; },
set(t) {
 let e,
                n,
                r,
                i,
                s = 255; if ((e = de.exec(t)) ? (n = 17 * xe(e[1]), r = 17 * xe(e[2]), i = 17 * xe(e[3])) : (e = pe.exec(t)) ? (n = 17 * xe(e[1]), r = 17 * xe(e[2]), i = 17 * xe(e[3]), s = 17 * xe(e[4])) : (e = fe.exec(t)) ? (n = xe(e[1]), r = xe(e[2]), i = xe(e[3])) : (e = ge.exec(t)) && (n = xe(e[1]), r = xe(e[2]), i = xe(e[3]), s = xe(e[4])), !e) { throw new Error("Invalid hex string"); } this.rgb = {
                r: n, g: r, b: i, a: s / 255, 
            }; 
} 
}, { key: "hex8String", get() { const t = this.rgba; return `#${ke(t.r) }${ke(t.g) }${ke(t.b) }${ke(ve(255 * t.a))}`; }, set(t) { this.hexString = t; } }, {
 key: "hslString",
get() { const t = this.hsl; return `hsl(${t.h }, ${t.s }%, ${t.l }%)`; },
set(t) {
 let e,
                n,
                r,
                i,
                s = 1; if ((e = le.exec(t)) ? (n = we(e[1], 360), r = we(e[2], 100), i = we(e[3], 100)) : (e = ae.exec(t)) && (n = we(e[1], 360), r = we(e[2], 100), i = we(e[3], 100), s = we(e[4], 1)), !e) { throw new Error("Invalid hsl string"); } this.hsl = {
                h: n, s: r, l: i, a: s, 
            }; 
} 
}, { key: "hslaString", get() { const t = this.hsla; return `hsla(${t.h }, ${t.s }%, ${t.l }%, ${t.a })`; }, set(t) { this.hslString = t; } }], n && te(e.prototype, n), t;
        }()); function _e(t) {
            let e,
                n = t.width,
                r = t.sliderSize,
                i = t.borderWidth,
                s = t.handleRadius,
                o = t.padding,
                l = t.sliderShape,
                a = t.layoutDirection === "horizontal"; return r = (e = r) != null ? e : 2 * o + 2 * s, l === "circle" ? {
                handleStart: t.padding + t.handleRadius, handleRange: n - 2 * o - 2 * s, width: n, height: n, cx: n / 2, cy: n / 2, radius: n / 2 - i / 2,
            } : {
                handleStart: r / 2, handleRange: n - r, radius: r / 2, x: 0, y: 0, width: a ? r : n, height: a ? n : r,
            };
        } let Te,
            Ne = 2 * Math.PI,
            Ae = function (t, e) { return (t % e + e) % e; },
            Le = function (t, e) { return Math.sqrt(t * t + e * e); }; function Se(t) { return t.width / 2 - t.padding - t.handleRadius - t.borderWidth; } function Ee(t) {
            const e = t.width / 2; return {
                width: t.width, radius: e - t.borderWidth, cx: e, cy: e,
            };
        } function je(t, e, n) {
            const r = t.wheelAngle,
                i = t.wheelDirection; return n && i === "clockwise" ? e = r + e : i === "clockwise" ? e = 360 - r + e : n && i === "anticlockwise" ? e = r + 180 - e : i === "anticlockwise" && (e = r - e), Ae(e, 360);
        } function qe(t, e, n) {
            const r = Ee(t),
                i = r.cx,
                s = r.cy,
                o = Se(t); e = i - e, n = s - n; const l = je(t, Math.atan2(-n, -e) * (360 / Ne)),
                a = Math.min(Le(e, n), o); return { h: Math.round(l), s: Math.round(100 / o * a) };
        } function Me(t) {
            const e = t.width,
                n = t.boxHeight; return { width: e, height: n != null ? n : e, radius: t.padding + t.handleRadius };
        } function Be(t, e, n) {
            const r = Me(t),
                i = r.width,
                s = r.height,
                o = r.radius,
                l = (e - o) / (i - 2 * o) * 100,
                a = (n - o) / (s - 2 * o) * 100; return { s: Math.max(0, Math.min(l, 100)), v: Math.max(0, Math.min(100 - a, 100)) };
        } function Oe(t) {
            Te || (Te = document.getElementsByTagName("base")); const e = window.navigator.userAgent,
                n = /^((?!chrome|android).)*safari/i.test(e),
                r = /iPhone|iPod|iPad/i.test(e),
                i = window.location; return (n || r) && Te.length > 0 ? `${i.protocol}//${i.host}${i.pathname}${i.search}${t}` : t;
        } function Re(t, e, n, r) {
            for (let i = 0; i < r.length; i++) {
                const s = r[i].x - e,
                    o = r[i].y - n; if (Math.sqrt(s * s + o * o) < t.handleRadius) { return i; }
            } return null;
        } function Pe(t) { return { boxSizing: "border-box", border: `${t.borderWidth}px solid ${t.borderColor}` }; } function Ie(t, e, n) { return `${t}-gradient(${e}, ${n.map(((t) => { const e = t[0]; return `${t[1]} ${e}%`; })).join(",")})`; } function De(t) { return typeof t === "string" ? t : `${t}px`; } const ze = ["mousemove", "touchmove", "mouseup", "touchend"],
            He = (function (t) {
                function e(e) { t.call(this, e), this.uid = (Math.random() + 1).toString(36).substring(5); } return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.render = function (t) {
                    const e = this.handleEvent.bind(this),
                        n = { onMouseDown: e, ontouchstart: e },
                        r = t.layoutDirection === "horizontal",
                        i = t.margin === null ? t.sliderMargin : t.margin,
                        s = { overflow: "visible", display: r ? "inline-block" : "block" }; return t.index > 0 && (s[r ? "marginLeft" : "marginTop"] = i), Ot(Pt, null, t.children(this.uid, n, s));
                }, e.prototype.handleEvent = function (t) {
                    let e = this,
                        n = this.props.onInput,
                        r = this.base.getBoundingClientRect(); t.preventDefault(); const i = t.touches ? t.changedTouches[0] : t,
                        s = i.clientX - r.left,
                        o = i.clientY - r.top; switch (t.type) { case "mousedown": case "touchstart": !1 !== n(s, o, 0) && ze.forEach(((t) => { document.addEventListener(t, e, { passive: !1 }); })); break; case "mousemove": case "touchmove": n(s, o, 1); break; case "mouseup": case "touchend": n(s, o, 2), ze.forEach(((t) => { document.removeEventListener(t, e, { passive: !1 }); })); }
                }, e;
            }(It)); function Fe(t) {
            const e = t.r,
                n = t.url,
                r = e,
                i = e; return Ot("svg", {
                className: `IroHandle IroHandle--${t.index} ${t.isActive ? "IroHandle--isActive" : ""}`,
                style: {
                    "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0);", transform: `translate(${De(t.x)}, ${De(t.y)})`, willChange: "transform", top: De(-e), left: De(-e), width: De(2 * e), height: De(2 * e), position: "absolute", overflow: "visible",
                },
            }, n && Ot("use", Object.assign({ xlinkHref: Oe(n) }, t.props)), !n && Ot("circle", {
                cx: r, cy: i, r: e, fill: "none", "stroke-width": 2, stroke: "#000",
            }), !n && Ot("circle", {
                cx: r, cy: i, r: e - 2, fill: t.fill, "stroke-width": 2, stroke: "#fff",
            }));
        } function Ve(t) {
            const e = t.activeIndex,
                n = void 0 !== e && e < t.colors.length ? t.colors[e] : t.color,
                r = _e(t),
                i = r.width,
                s = r.height,
                o = r.radius,
                l = (function (t, e) {
                    let n = _e(t),
                        r = n.width,
                        i = n.height,
                        s = n.handleRange,
                        o = n.handleStart,
                        l = t.layoutDirection === "horizontal",
                        a = (function (t, e) {
 let n = e.hsva,
                            r = e.rgb; switch (t.sliderType) {
 case "red": return r.r / 2.55; case "green": return r.g / 2.55; case "blue": return r.b / 2.55; case "alpha": return 100 * n.a; case "kelvin": var i = t.minTemperature,
                            s = t.maxTemperature - i,
                            o = (e.kelvin - i) / s * 100; return Math.max(0, Math.min(o, 100)); case "hue": return n.h /= 3.6; case "saturation": return n.s; default: return n.v; 
} 
}(t, e)),
                        c = l ? r / 2 : i / 2,
                        u = o + a / 100 * s; return l && (u = -1 * u + s + 2 * o), { x: l ? c : u, y: l ? u : c };
                }(t, n)),
                a = (function (t, e) {
                    let n = e.hsv,
                        r = e.rgb; switch (t.sliderType) {
                    case "red": return [[0, `rgb(0,${r.g},${r.b})`], [100, `rgb(255,${r.g},${r.b})`]]; case "green": return [[0, `rgb(${r.r},0,${r.b})`], [100, `rgb(${r.r},255,${r.b})`]]; case "blue": return [[0, `rgb(${r.r},${r.g},0)`], [100, `rgb(${r.r},${r.g},255)`]]; case "alpha": return [[0, `rgba(${r.r},${r.g},${r.b},0)`], [100, `rgb(${r.r},${r.g},${r.b})`]]; case "kelvin": for (var i = [], s = t.minTemperature, o = t.maxTemperature, l = o - s, a = s, c = 0; a < o; a += l / 8, c += 1) {
                        const u = Ce.kelvinToRgb(a),
                            h = u.r,
                            d = u.g,
                            p = u.b; i.push([12.5 * c, `rgb(${h},${d},${p})`]);
                    } return i; case "hue": return [[0, "#f00"], [16.666, "#ff0"], [33.333, "#0f0"], [50, "#0ff"], [66.666, "#00f"], [83.333, "#f0f"], [100, "#f00"]]; case "saturation": var f = Ce.hsvToHsl({ h: n.h, s: 0, v: n.v }),
                        g = Ce.hsvToHsl({ h: n.h, s: 100, v: n.v }); return [[0, `hsl(${f.h},${f.s}%,${f.l}%)`], [100, `hsl(${g.h},${g.s}%,${g.l}%)`]]; default: var b = Ce.hsvToHsl({ h: n.h, s: n.s, v: 100 }); return [[0, "#000"], [100, `hsl(${b.h},${b.s}%,${b.l}%)`]];
                    }
                }(t, n)); return Ot(He, Object.assign({}, t, {
 onInput(e, r, i) {
 const s = (function (t, e, n) {
 let r,
                i = _e(t),
                s = i.handleRange,
                o = i.handleStart; r = t.layoutDirection === "horizontal" ? -1 * n + s + o : e - o, r = Math.max(Math.min(r, s), 0); const l = Math.round(100 / s * r); switch (t.sliderType) { case "kelvin": var a = t.minTemperature; return a + (t.maxTemperature - a) * (l / 100); case "alpha": return l / 100; case "hue": return 3.6 * l; case "red": case "blue": case "green": return 2.55 * l; default: return l; } 
}(t, e, r)); t.parent.inputActive = !0, n[t.sliderType] = s, t.onInput(i, t.id); 
} 
}), ((e, r, c) => Ot("div", Object.assign({}, r, {
 className: "IroSlider",
style: Object.assign({}, {
                position: "relative", width: De(i), height: De(s), borderRadius: De(o), background: "conic-gradient(#ccc 25%, #fff 0 50%, #ccc 0 75%, #fff 0)", backgroundSize: "8px 8px", 
            }, c) 
}), Ot("div", {
 className: "IroSliderGradient",
style: Object.assign({}, {
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: De(o), background: Ie("linear", t.layoutDirection === "horizontal" ? "to top" : "to right", a), 
            }, Pe(t)) 
}), Ot(Fe, {
                isActive: !0, index: n.index, r: t.handleRadius, url: t.handleSvg, props: t.handleProps, x: l.x, y: l.y, 
            }))));
        } function Ue(t) {
            const e = Me(t),
                n = e.width,
                r = e.height,
                i = e.radius,
                s = t.colors,
                o = t.parent,
                l = t.activeIndex,
                a = void 0 !== l && l < t.colors.length ? t.colors[l] : t.color,
                c = [[[0, "#fff"], [100, `hsl(${a.hue},100%,50%)`]], [[0, "rgba(0,0,0,0)"], [100, "#000"]]],
                u = s.map((e => (function (t, e) { let n = Me(t), 
r = n.width, 
i = n.height, 
s = n.radius, 
o = e.hsv, 
l = s, 
a = r - 2 * s, 
c = i - 2 * s; return { x: l + o.s / 100 * a, y: l + (c - o.v / 100 * c) }; }(t, e)))); return Ot(He, Object.assign({}, t, { onInput(e, n, r) { if (r === 0) { const i = Re(t, e, n, u); i !== null ? o.setActiveColor(i) : (o.inputActive = !0, a.hsv = Be(t, e, n), t.onInput(r, t.id)); } else { r === 1 && (o.inputActive = !0, a.hsv = Be(t, e, n)); } t.onInput(r, t.id); } }), ((e, o, l) => Ot("div", Object.assign({}, o, { className: "IroBox", style: Object.assign({}, { width: De(n), height: De(r), position: "relative" }, l) }), Ot("div", { className: "IroBox", style: Object.assign({}, { width: "100%", height: "100%", borderRadius: De(i) }, Pe(t), { background: `${Ie("linear", "to bottom", c[1]) },${Ie("linear", "to right", c[0])}` }) }), s.filter((t => t !== a)).map((e => Ot(Fe, { isActive: !1, index: e.index, fill: e.hslString, r: t.handleRadius, url: t.handleSvg, props: t.handleProps, x: u[e.index].x, y: u[e.index].y }))), Ot(Fe, {
                isActive: !0, index: a.index, fill: a.hslString, r: t.activeHandleRadius || t.handleRadius, url: t.handleSvg, props: t.handleProps, x: u[a.index].x, y: u[a.index].y, 
            }))));
        } function We(t) {
            let e = Ee(t).width,
                n = t.colors,
                r = (t.borderWidth, t.parent),
                i = t.color,
                s = i.hsv,
                o = n.map((e => (function (t, e) { let n = e.hsv, 
r = Ee(t), 
i = r.cx, 
s = r.cy, 
o = Se(t), 
l = (180 + je(t, n.h, !0)) * (Ne / 360), 
a = n.s / 100 * o, 
c = t.wheelDirection === "clockwise" ? -1 : 1; return { x: i + a * Math.cos(l) * c, y: s + a * Math.sin(l) * c }; }(t, e)))),
                l = {
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "50%", boxSizing: "border-box",
                }; return Ot(He, Object.assign({}, t, {
 onInput(e, n, s) {
 if (s === 0) {
 if (!(function (t, e, n) {
 const r = Ee(t),
                i = r.cx,
                s = r.cy,
                o = t.width / 2; return Le(i - e, s - n) < o; 
}(t, e, n))) { return !1; } const l = Re(t, e, n, o); l !== null ? r.setActiveColor(l) : (r.inputActive = !0, i.hsv = qe(t, e, n), t.onInput(s, t.id)); 
} else { s === 1 && (r.inputActive = !0, i.hsv = qe(t, e, n)); } t.onInput(s, t.id); 
} 
}), ((r, a, c) => Ot("div", Object.assign({}, a, { className: "IroWheel", style: Object.assign({}, { width: De(e), height: De(e), position: "relative" }, c) }), Ot("div", { className: "IroWheelHue", style: Object.assign({}, l, { transform: `rotateZ(${t.wheelAngle + 90 }deg)`, background: t.wheelDirection === "clockwise" ? "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" : "conic-gradient(red, magenta, blue, aqua, lime, yellow, red)" }) }), Ot("div", { className: "IroWheelSaturation", style: Object.assign({}, l, { background: "radial-gradient(circle closest-side, #fff, transparent)" }) }), t.wheelLightness && Ot("div", { className: "IroWheelLightness", style: Object.assign({}, l, { background: "#000", opacity: 1 - s.v / 100 }) }), Ot("div", { className: "IroWheelBorder", style: Object.assign({}, l, Pe(t)) }), n.filter((t => t !== i)).map((e => Ot(Fe, { isActive: !1, index: e.index, fill: e.hslString, r: t.handleRadius, url: t.handleSvg, props: t.handleProps, x: o[e.index].x, y: o[e.index].y }))), Ot(Fe, {
                isActive: !0, index: i.index, fill: i.hslString, r: t.activeHandleRadius || t.handleRadius, url: t.handleSvg, props: t.handleProps, x: o[i.index].x, y: o[i.index].y, 
            }))));
        }Fe.defaultProps = {
            fill: "none", x: 0, y: 0, r: 8, url: null, props: { x: 0, y: 0 },
        }, Ve.defaultProps = Object.assign({}, {
            sliderShape: "bar", sliderType: "value", minTemperature: 2200, maxTemperature: 11e3,
        }); const $e = (function (t) {
            function e(e) { const n = this; t.call(this, e), this.colors = [], this.inputActive = !1, this.events = {}, this.activeEvents = {}, this.deferredEvents = {}, this.id = e.id, (e.colors.length > 0 ? e.colors : [e.color]).forEach((t => n.addColor(t))), this.setActiveColor(0), this.state = Object.assign({}, e, { color: this.color, colors: this.colors, layout: e.layout }); } return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.addColor = function (t, e) { void 0 === e && (e = this.colors.length); const n = new Ce(t, this.onColorChange.bind(this)); this.colors.splice(e, 0, n), this.colors.forEach(((t, e) => t.index = e)), this.state && this.setState({ colors: this.colors }), this.deferredEmit("color:init", n); }, e.prototype.removeColor = function (t) { const e = this.colors.splice(t, 1)[0]; e.unbind(), this.colors.forEach(((t, e) => t.index = e)), this.state && this.setState({ colors: this.colors }), e.index === this.color.index && this.setActiveColor(0), this.emit("color:remove", e); }, e.prototype.setActiveColor = function (t) { this.color = this.colors[t], this.state && this.setState({ color: this.color }), this.emit("color:setActive", this.color); }, e.prototype.setColors = function (t, e) { const n = this; void 0 === e && (e = 0), this.colors.forEach((t => t.unbind())), this.colors = [], t.forEach((t => n.addColor(t))), this.setActiveColor(e), this.emit("color:setAll", this.colors); }, e.prototype.on = function (t, e) {
                const n = this,
                    r = this.events; (Array.isArray(t) ? t : [t]).forEach(((t) => { (r[t] || (r[t] = [])).push(e), n.deferredEvents[t] && (n.deferredEvents[t].forEach(((t) => { e.apply(null, t); })), n.deferredEvents[t] = []); }));
            }, e.prototype.off = function (t, e) { const n = this; (Array.isArray(t) ? t : [t]).forEach(((t) => { const r = n.events[t]; r && r.splice(r.indexOf(e), 1); })); }, e.prototype.emit = function (t) { for (var e = this, n = [], r = arguments.length - 1; r-- > 0;) { n[r] = arguments[r + 1]; } const i = this.activeEvents; i.hasOwnProperty(t) && i[t] || (i[t] = !0, (this.events[t] || []).forEach((t => t.apply(e, n))), i[t] = !1); }, e.prototype.deferredEmit = function (t) { for (var e, n = [], r = arguments.length - 1; r-- > 0;) { n[r] = arguments[r + 1]; } const i = this.deferredEvents; (e = this).emit.apply(e, [t].concat(n)), (i[t] || (i[t] = [])).push(n); }, e.prototype.setOptions = function (t) { this.setState(t); }, e.prototype.resize = function (t) { this.setOptions({ width: t }); }, e.prototype.reset = function () { this.colors.forEach((t => t.reset())), this.setState({ colors: this.colors }); }, e.prototype.onMount = function (t) { this.el = t, this.deferredEmit("mount", this); }, e.prototype.onColorChange = function (t, e) { this.setState({ color: this.color }), this.inputActive && (this.inputActive = !1, this.emit("input:change", t, e)), this.emit("color:change", t, e); }, e.prototype.emitInputEvent = function (t, e) { t === 0 ? this.emit("input:start", this.color, e) : t === 1 ? this.emit("input:move", this.color, e) : t === 2 && this.emit("input:end", this.color, e); }, e.prototype.render = function (t, e) {
                let n = this,
                    r = e.layout; return Array.isArray(r) || (r = [{ component: We }, { component: Ve }], e.transparency && r.push({ component: Ve, options: { sliderType: "alpha" } })), Ot("div", { class: "IroColorPicker", id: e.id, style: { display: e.display } }, r.map(((t, r) => {
 const i = t.component,
                    s = t.options; return Ot(i, Object.assign({}, e, s, {
                    ref: void 0, onInput: n.emitInputEvent.bind(n), parent: n, index: r, 
                })); 
})));
            }, e;
        }(It)); $e.defaultProps = Object.assign({}, {
            width: 300, height: 300, color: "#fff", colors: [], padding: 6, layoutDirection: "vertical", borderColor: "#fff", borderWidth: 0, handleRadius: 8, activeHandleRadius: null, handleSvg: null, handleProps: { x: 0, y: 0 }, wheelLightness: !0, wheelAngle: 0, wheelDirection: "anticlockwise", sliderSize: null, sliderMargin: 12, boxHeight: null,
        }, {
            colors: [], display: "block", id: null, layout: "default", margin: null,
        }); let Ge,
            Ke,
            Ye,
            Ze = (Ke = function (t, e) {
                let n,
                    r = document.createElement("div"); function i() { const e = t instanceof Element ? t : document.querySelector(t); e.appendChild(n.base), n.onMount(e); } return (function (t, e, n) {
                    let r,
                        i,
                        s; xt.__p && xt.__p(t, e), i = (r = n === Tt) ? null : e.__k, t = Ot(Pt, null, [t]), s = [], Kt(e, e.__k = t, i || Et, Et, void 0 !== e.ownerSVGElement, i ? null : jt.slice.call(e.childNodes), s, !1, Et, r), Yt(s, t);
                }(Ot(Ge, Object.assign({}, { ref(t) { return n = t; } }, e)), r)), document.readyState !== "loading" ? i() : document.addEventListener("DOMContentLoaded", i), n;
            }, Ke.prototype = (Ge = $e).prototype, Object.assign(Ke, Ge), Ke.__component = Ge, Ke); !(function (t) { let e; t.version = "5.5.2", t.Color = Ce, t.ColorPicker = Ze, (e = t.ui || (t.ui = {})).h = Ot, e.ComponentBase = He, e.Handle = Fe, e.Slider = Ve, e.Wheel = We, e.Box = Ue; }(Ye || (Ye = {}))); const Xe = Ye, Je = [{ icon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M43 11L16.875 37L5 25.1818\" stroke=\"#008a00\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", label: "save" }, { icon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8 8L40 40\" stroke=\"#db3700\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M8 40L40 8\" stroke=\"#db3700\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", label: "cancel" }],
            Qe = [{ value: "#000000", describe: "black" }, { value: "#4d4d4d", describe: "dimGrey" }, { value: "#808080", describe: "grey" }, { value: "#e6e6e6", describe: "lightGrey" }, { value: "#ffffff", describe: "white" }, { value: "#ff0000", describe: "red" }, { value: "#ffa500", describe: "orange" }, { value: "#ffff00", describe: "yellow" }, { value: "#99e64d", describe: "lightGreen" }, { value: "#008000", describe: "green" }, { value: "#7fffd4", describe: "aquamarine" }, { value: "#40e0d0", describe: "turquoise" }, { value: "#4d99e6", describe: "lightBlue" }, { value: "#0000ff", describe: "blue" }, { value: "#800080", describe: "purple" }]; let tn,
            en = class {
                constructor(t, e) { this.tableMenus = t, this.options = e, this.attrs = Object.assign({}, e.attribute), this.borderForm = [], this.saveButton = null, this.form = this.createPropertiesForm(e); }

                checkBtnsAction(t) { t === "save" && this.saveAction(this.options.type), this.removePropertiesForm(), this.tableMenus.showMenus(), this.tableMenus.updateMenus(); }

                createActionBtns(t, e) {
                    const n = this.getUseLanguage(),
                        r = document.createElement("div"),
                        i = document.createDocumentFragment(); r.classList.add("properties-form-action-row"); for (const { icon: t, label: r } of Je) {
                        const s = document.createElement("button"),
                            o = document.createElement("span"); if (o.innerHTML = t, s.appendChild(o), I(s, { label: r }), e) { const t = document.createElement("span"); t.innerText = n(r), s.appendChild(t); }i.appendChild(s);
                    } return r.addEventListener("click", (e => t(e))), r.appendChild(i), r;
                }

                createCheckBtns(t) {
                    const { menus: e, propertyName: n } = t,
                        r = document.createElement("div"),
                        i = document.createDocumentFragment(); for (const { icon: t, describe: r, align: s } of e) { const e = document.createElement("span"); e.innerHTML = t, e.setAttribute("data-align", s), e.classList.add("ql-table-tooltip-hover"), this.options.attribute[n] === s && e.classList.add("ql-table-btns-checked"); const o = C(r); e.appendChild(o), i.appendChild(e); } return r.classList.add("ql-table-check-container"), r.appendChild(i), r.addEventListener("click", ((t) => {
                        const e = t.target.closest("span.ql-table-tooltip-hover"),
                            i = e.getAttribute("data-align"); this.switchButton(r, e), this.setAttribute(n, i);
                    })), r;
                }

                createColorContainer(t) {
                    const e = document.createElement("div"); e.classList.add("ql-table-color-container"); const n = this.createColorInput(t),
                        r = this.createColorPicker(t); return e.appendChild(n), e.appendChild(r), e;
                }

                createColorInput(t) { const e = this.createInput(t); return e.classList.add("label-field-view-color"), e; }

                createColorList(t) {
                    const e = this.getUseLanguage(),
                        n = document.createElement("ul"),
                        r = document.createDocumentFragment(); n.classList.add("color-list"); for (const { value: t, describe: n } of Qe) {
                        const i = document.createElement("li"),
                            s = C(e(n)); i.setAttribute("data-color", t), i.classList.add("ql-table-tooltip-hover"), D(i, { "background-color": t }), i.appendChild(s), r.appendChild(i);
                    } return n.appendChild(r), n.addEventListener("click", ((e) => {
                        const r = e.target,
                            i = (r.tagName === "DIV" ? r.parentElement : r).getAttribute("data-color"); this.setAttribute(t, i, n), this.updateInputStatus(n, !1, !0);
                    })), n;
                }

                createColorPicker(t) {
                    const { propertyName: e, value: n } = t,
                        r = document.createElement("span"),
                        i = document.createElement("span"); r.classList.add("color-picker"), i.classList.add("color-button"), n ? D(i, { "background-color": n }) : i.classList.add("color-unselected"); const s = this.createColorPickerSelect(e); return i.addEventListener("click", (() => {
                        this.toggleHidden(s); const t = this.getColorClosest(r),
                            e = t == null ? void 0 : t.querySelector(".property-input"); this.updateSelectedStatus(s, e == null ? void 0 : e.value, "color");
                    })), r.appendChild(i), r.appendChild(s), r;
                }

                createColorPickerIcon(t, e, n) {
                    const r = document.createElement("div"),
                        i = document.createElement("span"),
                        s = document.createElement("button"); return i.innerHTML = t, s.innerText = e, r.classList.add("erase-container"), r.appendChild(i), r.appendChild(s), r.addEventListener("click", n), r;
                }

                createColorPickerSelect(t) {
                    const e = this.getUseLanguage(),
                        n = document.createElement("div"),
                        r = this.createColorPickerIcon("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M4 42H44\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M31 4L7 28L13 34H21L41 14L31 4Z\" fill=\"none\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", e("removeColor"), (() => { this.setAttribute(t, "", n), this.updateInputStatus(n, !1, !0); })),
                        i = this.createColorList(t),
                        s = this.createPalette(t, e, n); return n.classList.add("color-picker-select", "ql-hidden"), n.appendChild(r), n.appendChild(i), n.appendChild(s), n;
                }

                createDropdown(t, e) {
                    const n = document.createElement("div"),
                        r = document.createElement("span"),
                        i = document.createElement("span"); return e === "dropdown" && (i.innerHTML = St, i.classList.add("ql-table-dropdown-icon")), t && (r.innerText = t), n.classList.add("ql-table-dropdown-properties"), r.classList.add("ql-table-dropdown-text"), n.appendChild(r), e === "dropdown" && n.appendChild(i), { dropdown: n, dropText: r };
                }

                createInput(t) {
                    const {
                            attribute: e, message: n, propertyName: r, value: i, valid: s,
                        } = t,
                        { placeholder: o = "" } = e,
                        l = document.createElement("div"),
                        a = document.createElement("div"),
                        c = document.createElement("label"),
                        u = document.createElement("input"),
                        h = document.createElement("div"); return l.classList.add("label-field-view"), a.classList.add("label-field-view-input-wrapper"), c.innerText = o, I(u, e), u.classList.add("property-input"), u.value = i, u.addEventListener("input", ((t) => { const e = t.target.value; s && this.switchHidden(h, s(e)), this.updateInputStatus(a, s && !s(e)), this.setAttribute(r, e, l); })), h.classList.add("label-field-view-status", "ql-hidden"), n && (h.innerText = n), a.appendChild(u), a.appendChild(c), l.appendChild(a), s && l.appendChild(h), l;
                }

                createList(t, e) { const { options: n, propertyName: r } = t; if (!n.length) { return null; } const i = document.createElement("ul"); for (const t of n) { const e = document.createElement("li"); e.innerText = t, i.appendChild(e); } return i.classList.add("ql-table-dropdown-list", "ql-hidden"), i.addEventListener("click", ((t) => { const n = t.target.innerText; e.innerText = n, this.toggleBorderDisabled(n), this.setAttribute(r, n); })), i; }

                createPalette(t, e, n) {
                    const r = document.createElement("div"),
                        i = document.createElement("div"),
                        s = document.createElement("div"),
                        o = document.createElement("div"),
                        l = new Xe.ColorPicker(o, { width: 110, layout: [{ component: Xe.ui.Wheel, options: {} }] }),
                        a = this.createColorPickerIcon("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M24 44C29.9601 44 26.3359 35.136 30 31C33.1264 27.4709 44 29.0856 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z\" fill=\"none\" stroke=\"#333\" stroke-width=\"4\" stroke-linejoin=\"round\"/><path d=\"M28 17C29.6569 17 31 15.6569 31 14C31 12.3431 29.6569 11 28 11C26.3431 11 25 12.3431 25 14C25 15.6569 26.3431 17 28 17Z\" fill=\"none\" stroke=\"#333\" stroke-width=\"4\" stroke-linejoin=\"round\"/><path d=\"M16 21C17.6569 21 19 19.6569 19 18C19 16.3431 17.6569 15 16 15C14.3431 15 13 16.3431 13 18C13 19.6569 14.3431 21 16 21Z\" fill=\"none\" stroke=\"#333\" stroke-width=\"4\" stroke-linejoin=\"round\"/><path d=\"M17 34C18.6569 34 20 32.6569 20 31C20 29.3431 18.6569 28 17 28C15.3431 28 14 29.3431 14 31C14 32.6569 15.3431 34 17 34Z\" fill=\"none\" stroke=\"#333\" stroke-width=\"4\" stroke-linejoin=\"round\"/></svg>", e("colorPicker"), (() => this.toggleHidden(i))),
                        c = this.createActionBtns(((e) => { const s = e.target.closest("button"); s && (s.getAttribute("label") === "save" && (this.setAttribute(t, l.color.hexString, n), this.updateInputStatus(r, !1, !0)), i.classList.add("ql-hidden"), n.classList.add("ql-hidden")); }), !1); return i.classList.add("color-picker-palette", "ql-hidden"), s.classList.add("color-picker-wrap"), o.classList.add("iro-container"), s.appendChild(o), s.appendChild(c), i.appendChild(s), r.appendChild(a), r.appendChild(i), r;
                }

                createProperty(t) {
                    const { content: e, children: n } = t,
                        r = this.getUseLanguage(),
                        i = document.createElement("div"),
                        s = document.createElement("label"); s.innerText = e, s.classList.add("ql-table-dropdown-label"), i.classList.add("properties-form-row"), n.length === 1 && i.classList.add("properties-form-row-full"), i.appendChild(s); for (const t of n) { const n = this.createPropertyChild(t); n && i.appendChild(n), n && e === r("border") && this.borderForm.push(n); } return i;
                }

                createPropertyChild(t) {
                    const { category: e, value: n } = t; switch (e) {
                    case "dropdown": const { dropdown: r, dropText: i } = this.createDropdown(n, e),
                        s = this.createList(t, i); return r.appendChild(s), r.addEventListener("click", (() => { this.toggleHidden(s), this.updateSelectedStatus(r, i.innerText, "dropdown"); })), r; case "color": return this.createColorContainer(t); case "menus": return this.createCheckBtns(t); case "input": return this.createInput(t);
                    }
                }

                createPropertiesForm(t) {
                    const e = this.getUseLanguage(),
                        { title: n, properties: r } = (function ({ type: t, attribute: e }, n) {
 return t === "table" ? (function (t, e) {
 return {
 title: e("tblProps"),
properties: [{
 content: e("border"),
children: [{
                            category: "dropdown", propertyName: "border-style", value: t["border-style"], options: ["dashed", "dotted", "double", "groove", "inset", "none", "outset", "ridge", "solid"], 
                        }, {
                            category: "color", propertyName: "border-color", value: t["border-color"], attribute: { type: "text", placeholder: e("color") }, valid: R, message: e("colorMsg"), 
                        }, {
                            category: "input", propertyName: "border-width", value: k(t["border-width"]), attribute: { type: "text", placeholder: e("width") }, valid: P, message: e("dimsMsg"), 
                        }] 
}, {
 content: e("background"),
children: [{
                            category: "color", propertyName: "background-color", value: t["background-color"], attribute: { type: "text", placeholder: e("color") }, valid: R, message: e("colorMsg"), 
                        }] 
}, {
 content: e("dimsAlm"),
children: [{
                            category: "input", propertyName: "width", value: k(t.width), attribute: { type: "text", placeholder: e("width") }, valid: P, message: e("dimsMsg"), 
                        }, {
                            category: "input", propertyName: "height", value: k(t.height), attribute: { type: "text", placeholder: e("height") }, valid: P, message: e("dimsMsg"), 
                        }, {
                            category: "menus", propertyName: "align", value: t.align, menus: [{ icon: l, describe: e("alTblL"), align: "left" }, { icon: o, describe: e("tblC"), align: "center" }, { icon: a, describe: e("alTblR"), align: "right" }], 
                        }] 
}] 
}; 
}(e, n)) : (function (t, e) {
 return {
 title: e("cellProps"),
properties: [{
 content: e("border"),
children: [{
                            category: "dropdown", propertyName: "border-style", value: t["border-style"], options: ["dashed", "dotted", "double", "groove", "inset", "none", "outset", "ridge", "solid"], 
                        }, {
                            category: "color", propertyName: "border-color", value: t["border-color"], attribute: { type: "text", placeholder: e("color") }, valid: R, message: e("colorMsg"), 
                        }, {
                            category: "input", propertyName: "border-width", value: k(t["border-width"]), attribute: { type: "text", placeholder: e("width") }, valid: P, message: e("dimsMsg"), 
                        }] 
}, {
 content: e("background"),
children: [{
                            category: "color", propertyName: "background-color", value: t["background-color"], attribute: { type: "text", placeholder: e("color") }, valid: R, message: e("colorMsg"), 
                        }] 
}, {
 content: e("dims"),
children: [{
                            category: "input", propertyName: "width", value: k(t.width), attribute: { type: "text", placeholder: e("width") }, valid: P, message: e("dimsMsg"), 
                        }, {
                            category: "input", propertyName: "height", value: k(t.height), attribute: { type: "text", placeholder: e("height") }, valid: P, message: e("dimsMsg"), 
                        }, {
                            category: "input", propertyName: "padding", value: k(t.padding), attribute: { type: "text", placeholder: e("padding") }, valid: P, message: e("dimsMsg"), 
                        }] 
}, {
 content: e("tblCellTxtAlm"),
children: [{
                            category: "menus", propertyName: "text-align", value: t["text-align"], menus: [{ icon: l, describe: e("alCellTxtL"), align: "left" }, { icon: o, describe: e("alCellTxtC"), align: "center" }, { icon: a, describe: e("alCellTxtR"), align: "right" }, { icon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M42 19H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 9H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 29H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M42 39H6\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", describe: e("jusfCellTxt"), align: "justify" }], 
                        }, {
                            category: "menus", propertyName: "vertical-align", value: t["vertical-align"], menus: [{ icon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6 36.3056H42\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M6 42H42\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M30 12L24 6L18 12V12\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M24 6V29\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", describe: e("alCellTxtT"), align: "top" }, { icon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18 36L24 30L30 36\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M23.9999 30.9998V43.9998\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M18 12L24 18L30 12\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M23.9999 17.0002V4.00022\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M6 24.0004H42\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", describe: e("alCellTxtM"), align: "middle" }, { icon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6 36.3056H42\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M6 42H42\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M30 23L24 29L18 23V23\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M24 6V29\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", describe: e("alCellTxtB"), align: "bottom" }], 
                        }] 
}] 
}; 
}(e, n)); 
}(t, e)),
                        i = document.createElement("div"); i.classList.add("ql-table-properties-form"); const s = document.createElement("h2"),
                        c = this.createActionBtns(((t) => { const e = t.target.closest("button"); e && this.checkBtnsAction(e.getAttribute("label")); }), !0); s.innerText = n, s.classList.add("properties-form-header"), i.appendChild(s); for (const t of r) { const e = this.createProperty(t); i.appendChild(e); } return i.appendChild(c), this.setBorderDisabled(), this.tableMenus.quill.container.appendChild(i), this.updatePropertiesForm(i, t.type), this.setSaveButton(c), i.addEventListener("click", ((t) => { const e = t.target; this.hiddenSelectList(e); })), i;
                }

                getCellStyle(t, e) { const n = (t.getAttribute("style") || "").split(";").filter((t => t.trim())).reduce(((t, e) => { const n = e.split(":"); return Object.assign(Object.assign({}, t), { [n[0].trim()]: n[1].trim() }); }), {}); return Object.assign(n, e), Object.keys(n).reduce(((t, e) => `${t}${e}: ${n[e]}; `), ""); }

                getColorClosest(t) { return L(t, ".ql-table-color-container"); }

                getComputeBounds(t) {
                    if (t === "table") {
                        const { table: t } = this.tableMenus,
                            [e, n] = this.tableMenus.getCorrectBounds(t); return e.bottom > n.bottom ? Object.assign(Object.assign({}, e), { bottom: n.height }) : e;
                    } { const { computeBounds: t } = this.tableMenus.getSelectedTdsInfo(); return t; }
                }

                getDiffProperties() {
                    const t = this.attrs,
                        e = this.options.attribute; return Object.keys(t).reduce(((n, r) => (t[r] !== e[r] && (n[r] = (function (t) { return !(!t.endsWith("width") && !t.endsWith("height")); }(r)) ? (function (t) { if (!t) { return t; } const e = t.slice(-2); return e !== "px" && e !== "em" ? `${t}px` : t; }(t[r])) : t[r]), n)), {});
                }

                getUseLanguage() { const { language: t } = this.tableMenus.tableBetter; return t.useLanguage.bind(t); }

                getViewportSize() { return { viewWidth: document.documentElement.clientWidth, viewHeight: document.documentElement.clientHeight }; }

                hiddenSelectList(t) {
                    let e,
                        n; const r = ".ql-table-dropdown-properties",
                        i = ".color-picker",
                        s = this.form.querySelectorAll(".ql-table-dropdown-list"),
                        o = this.form.querySelectorAll(".color-picker-select"); for (const l of [...s, ...o]) { ((e = l.closest(r)) === null || void 0 === e ? void 0 : e.isEqualNode(t.closest(r))) || ((n = l.closest(i)) === null || void 0 === n ? void 0 : n.isEqualNode(t.closest(i))) || l.classList.add("ql-hidden"); }
                }

                removePropertiesForm() { this.form.remove(), this.borderForm = []; }

                saveAction(t) { t === "table" ? this.saveTableAction() : this.saveCellAction(); }

                saveCellAction() {
                    const { selectedTds: t } = this.tableMenus.tableBetter.cellSelection,
                        { quill: n, table: r } = this.tableMenus,
                        i = e().find(r).colgroup(),
                        s = this.getDiffProperties(),
                        o = parseFloat(s.width),
                        l = s["text-align"]; l && delete s["text-align"]; const a = []; if (i && o) {
                        delete s.width; const { computeBounds: t } = this.tableMenus.getSelectedTdsInfo(),
                            e = E(t, r, n.container); for (const t of e) { t.setAttribute("width", `${o}`); }
                    } for (const n of t) {
                        const t = e().find(n),
                            r = t.statics.blotName,
                            i = t.formats()[r],
                            o = this.getCellStyle(n, s); if (l) { const e = l === "left" ? "" : l; t.children.forEach(((t) => { t.statics.blotName === m.blotName ? t.children.forEach(((t) => { t.format && t.format("align", e); })) : t.format("align", e); })); } const c = t.replaceWith(r, Object.assign(Object.assign({}, i), { style: o })); a.push(c.domNode);
                    } this.tableMenus.tableBetter.cellSelection.setSelectedTds(a);
                }

                saveTableAction() {
                    let t; const { table: n, tableBetter: r } = this.tableMenus,
                        i = (t = e().find(n).temporary()) === null || void 0 === t ? void 0 : t.domNode,
                        s = n.querySelector("td"),
                        o = this.getDiffProperties(),
                        l = o.align; switch (delete o.align, l) { case "center": Object.assign(o, { margin: "0 auto" }); break; case "left": Object.assign(o, { margin: "" }); break; case "right": Object.assign(o, { "margin-left": "auto", "margin-right": "" }); }D(i || n, o), r.cellSelection.setSelected(s);
                }

                setAttribute(t, e, n) { this.attrs[t] = e, t.includes("-color") && this.updateSelectColor(this.getColorClosest(n), e); }

                setBorderDisabled() {
                    const [t] = this.borderForm,
                        e = t.querySelector(".ql-table-dropdown-text").innerText; this.toggleBorderDisabled(e);
                }

                setSaveButton(t) { const e = t.querySelector("button[label=\"save\"]"); this.saveButton = e; }

                setSaveButtonDisabled(t) { this.saveButton && (t ? this.saveButton.setAttribute("disabled", "true") : this.saveButton.removeAttribute("disabled")); }

                switchButton(t, e) { const n = t.querySelectorAll("span.ql-table-tooltip-hover"); for (const t of n) { t.classList.remove("ql-table-btns-checked"); }e.classList.add("ql-table-btns-checked"); }

                switchHidden(t, e) { e ? t.classList.add("ql-hidden") : t.classList.remove("ql-hidden"); }

                toggleBorderDisabled(t) { const [, e, n] = this.borderForm; t !== "none" && t ? (e.classList.remove("ql-table-disabled"), n.classList.remove("ql-table-disabled")) : (this.attrs["border-color"] = "", this.attrs["border-width"] = "", this.updateSelectColor(e, ""), this.updateInputValue(n, ""), e.classList.add("ql-table-disabled"), n.classList.add("ql-table-disabled")); }

                toggleHidden(t) { t.classList.toggle("ql-hidden"); }

                updateInputValue(t, e) { t.querySelector(".property-input").value = e; }

                updateInputStatus(t, e, n) { const r = (n ? this.getColorClosest(t) : L(t, ".label-field-view")).querySelector(".label-field-view-input-wrapper"); e ? (r.classList.add("label-field-view-error"), this.setSaveButtonDisabled(!0)) : (r.classList.remove("label-field-view-error"), this.form.querySelectorAll(".label-field-view-error").length || this.setSaveButtonDisabled(!1)); }

                updatePropertiesForm(t, e) {
                    t.classList.remove("ql-table-triangle-none"); const { height: n, width: r } = t.getBoundingClientRect(),
                        i = this.tableMenus.quill.container.getBoundingClientRect(),
                        {
                            top: s, left: o, right: l, bottom: a,
                        } = this.getComputeBounds(e),
                        { viewHeight: c } = this.getViewportSize(); let u = a + 10,
                        h = o + l - r >> 1; u + i.top + n > c ? (u = s - n - 10, u < 0 ? (u = i.height - n >> 1, t.classList.add("ql-table-triangle-none")) : (t.classList.add("ql-table-triangle-up"), t.classList.remove("ql-table-triangle-down"))) : (t.classList.add("ql-table-triangle-down"), t.classList.remove("ql-table-triangle-up")), h < i.left ? (h = 0, t.classList.add("ql-table-triangle-none")) : h + r > i.right && (h = i.right - r, t.classList.add("ql-table-triangle-none")), D(t, { left: `${h}px`, top: `${u}px` });
                }

                updateSelectColor(t, e) {
                    const n = t.querySelector(".property-input"),
                        r = t.querySelector(".color-button"),
                        i = t.querySelector(".color-picker-select"),
                        s = t.querySelector(".label-field-view-status"); e ? r.classList.remove("color-unselected") : r.classList.add("color-unselected"), n.value = e, D(r, { "background-color": e }), i.classList.add("ql-hidden"), this.switchHidden(s, R(e));
                }

                updateSelectedStatus(t, e, n) {
                    const r = n === "color" ? ".color-list" : ".ql-table-dropdown-list",
                        i = t.querySelector(r); if (!i) { return; } const s = Array.from(i.querySelectorAll("li")); for (const t of s) { t.classList.remove(`ql-table-${n}-selected`); } const o = s.find((t => (n === "color" ? t.getAttribute("data-color") : t.innerText) === e)); o && o.classList.add(`ql-table-${n}-selected`);
                }
            }; !(function (t) { t.left = "margin-left", t.right = "margin-right"; }(tn || (tn = {}))); const nn = class {
                constructor(t, e) { this.quill = t, this.table = null, this.prevList = null, this.prevTooltip = null, this.scroll = !1, this.tableBetter = e, this.tablePropertiesForm = null, this.quill.root.addEventListener("click", this.handleClick.bind(this)), this.root = this.createMenus(); }

                copyTable() {
                    return (function (t, e, n, r) { return new (n || (n = Promise))((((i, s) => { function o(t) { try { a(r.next(t)); } catch (t) { s(t); } } function l(t) { try { a(r.throw(t)); } catch (t) { s(t); } } function a(t) { let e; t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n((((t) => { t(e); })))).then(o, l); }a((r = r.apply(t, e || [])).next()); }))); }(this, void 0, void 0, (function* () {
                        if (!this.table) { return; } const t = e().find(this.table); if (!t) { return; } const n = `<p><br></p>${t.getCopyTable()}`,
                            r = this.tableBetter.cellSelection.getText(n),
                            i = new ClipboardItem({ "text/html": new Blob([n], { type: "text/html" }), "text/plain": new Blob([r], { type: "text/plain" }) }); try {
                            yield navigator.clipboard.write([i]); const n = this.quill.getIndex(t),
                                r = t.length(); this.quill.setSelection(n + r, e().sources.SILENT), this.tableBetter.hideTools(), this.quill.scrollSelectionIntoView();
                        } catch (t) { console.error("Failed to copy table:", t); }
                    })));
                }

                createList(t) {
                    if (!t) { return null; } const e = document.createElement("ul"); for (const [, n] of Object.entries(t)) {
                        const { content: t, handler: r } = n,
                            i = document.createElement("li"); i.innerText = t, i.addEventListener("click", r.bind(this)), e.appendChild(i);
                    } return e.classList.add("ql-table-dropdown-list", "ql-hidden"), e;
                }

                createMenu(t, e, n) {
                    const r = document.createElement("div"),
                        i = document.createElement("span"); return i.innerHTML = n ? t + e : t, r.classList.add("ql-table-dropdown"), i.classList.add("ql-table-tooltip-hover"), r.appendChild(i), r;
                }

                createMenus() {
                    const { language: t, options: e = {} } = this.tableBetter,
                        { menus: n } = e,
                        r = t.useLanguage.bind(t),
                        i = document.createElement("div"); i.classList.add("ql-table-menus-container", "ql-hidden"); for (const [, t] of Object.entries(function (t, e) {
                        const n = {
                                column: {
                                    content: t("col"),
                                    icon: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1692084271333\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2200\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"16\" height=\"16\"><path d=\"M9.14372835 1039.20071111L1020.26808889 1039.20071111l0-1048.576L9.14372835-9.37528889 9.14372835 1039.20071111z m252.77672107-711.53454649l1e-8-262.144 175.00150897 0 0 262.144L261.92044942 327.66616462zM942.48705138 702.1592576l0 262.14400001-178.89289103-1e-8 1e-8-262.144 178.89289102 0z m-256.66810311 0l0 262.144-171.11595236 0 0-262.144 171.11595236 0z m-248.89698987 0l0 262.144L261.92044943 964.3032576l-1e-8-262.144 175.00150898 0z m505.56509298-299.59563948L942.48705139 627.26180409l-178.89289104 0 0-224.69818596 178.89289103-1e-8z m-256.66810311 1e-8L685.81894827 627.26180409l-171.11595236 0 0-224.69818596 171.11595236 0z m-248.89698987 0L436.9219584 627.26180409 261.92044943 627.26180409l0-224.69818596 175.00150897 0z m505.56509298-337.04145352l0 262.14400001-178.89289102 0-1e-8-262.144 178.89289103-1e-8z m-256.66810311 1e-8l0 262.144-171.11595236 0 0-262.144 171.11595236 0z\" fill=\"#515151\" p-id=\"2201\"></path></svg>",
                                    handler(t, e) { this.toggleAttribute(t, e); },
                                    children: {
                                        left: {
                                            content: t("insColL"),
                                            handler() {
                                                const { leftTd: t } = this.getSelectedTdsInfo(),
                                                    e = this.table.getBoundingClientRect(); this.insertColumn(t, 0), z(this.table, e, 72), this.updateMenus();
                                            },
                                        },
                                        right: {
                                            content: t("insColR"),
                                            handler() {
                                                const { rightTd: t } = this.getSelectedTdsInfo(),
                                                    e = this.table.getBoundingClientRect(); this.insertColumn(t, 1), z(this.table, e, 72), this.updateMenus();
                                            },
                                        },
                                        delete: { content: t("delCol"), handler() { this.deleteColumn(); } },
                                    },
                                },
                                row: {
                                    content: t("row"), icon: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1692084279720\" class=\"icon\" viewBox=\"0 0 1181 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2344\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"18.453125\" height=\"16\"><path d=\"M1142.15367111 0H39.38417778C7.99630222 0 0 8.27050667 0 39.38531555v945.2293689C0 1015.72949333 7.99516445 1024 39.38531555 1024h1102.76835556c31.39128889 0 39.38417778-8.27050667 39.38417778-39.38531555V39.38531555c0-31.11480889-7.99516445-39.38531555-39.38417778-39.38531555zM354.46328889 945.23050667l-276.992 3.26997333V749.568l276.992-1.25952v196.92202667z m0-275.69265778H78.76835555V472.61468445h275.69265778v196.92316444z m0-275.69152H78.76835555V236.30848h275.69265778v157.53671111z m393.84632889 551.38417778H433.23050667V748.30848h315.07683555v196.92202667z m0-275.69265778H433.23050667V472.61468445h315.07683555v196.92316444z m0-275.69152H433.23050667V236.30848h315.07683555v157.53671111z m354.46101333 551.38417778H827.07683555V748.30848h275.69265778v196.92202667z m0-275.69265778H827.07683555V472.61468445h275.69265778v196.92316444z m0-275.69152H827.07683555V236.30848h275.69265778v157.53671111z\" fill=\"#515151\" p-id=\"2345\"></path></svg>", handler(t, e) { this.toggleAttribute(t, e); }, children: { above: { content: t("insRowAbv"), handler() { const { leftTd: t } = this.getSelectedTdsInfo(); this.insertRow(t, 0), this.updateMenus(); } }, below: { content: t("insRowBlw"), handler() { const { rightTd: t } = this.getSelectedTdsInfo(); this.insertRow(t, 1), this.updateMenus(); } }, delete: { content: t("delRow"), handler() { this.deleteRow(); } } },
                                },
                                merge: {
                                    content: t("mCells"), icon: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1692084199654\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1975\" width=\"16\" height=\"16\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M776.08580741 364.42263703c-15.53445925-7.76722963-31.06891852-7.76722963-46.60337778 0L589.6722963 512l139.81013333 147.57736297c15.53445925 7.76722963 31.06891852 7.76722963 46.60337778 0 15.53445925-15.53445925 15.53445925-31.06891852 0-46.60337779L706.18074075 543.06891852h163.11182222c15.53445925 0 31.06891852-15.53445925 31.06891851-31.06891852s-15.53445925-31.06891852-31.06891851-31.06891852H706.18074075l69.90506666-69.90506666c7.76722963-15.53445925 7.76722963-31.06891852 0-46.60337779z m-528.17161482 0c-15.53445925 15.53445925-15.53445925 31.06891852 0 46.60337779l69.90506666 69.90506666H154.70743703c-15.53445925 0-31.06891852 15.53445925-31.06891851 31.06891852s15.53445925 31.06891852 31.06891851 31.06891852H317.81925925l-69.90506666 69.90506666c-15.53445925 15.53445925-15.53445925 31.06891852 0 46.60337779 15.53445925 7.76722963 31.06891852 7.76722963 46.60337778 0L434.3277037 512 294.51757037 364.42263703c-15.53445925-7.76722963-31.06891852-7.76722963-46.60337778 0z\" fill=\"#515151\" p-id=\"1976\"></path><path d=\"M317.81925925 939.19762963H84.80237037V84.80237037h233.01688888v116.50844445h77.6722963V7.13007408H7.13007408v1009.73985184h388.36148147V822.68918518h-77.6722963zM628.50844445 7.13007408v194.18074074h77.6722963v-116.50844445h233.01688888v854.39525926H706.18074075v-116.50844445h-77.6722963v194.18074074h388.36148147V7.13007408z\" fill=\"#515151\" p-id=\"1977\"></path></svg>", handler(t, e) { this.toggleAttribute(t, e); }, children: { merge: { content: t("mCells"), handler() { this.mergeCells(), this.updateMenus(); } }, split: { content: t("sCell"), handler() { this.splitCell(), this.updateMenus(); } } },
                                },
                                table: { content: t("tblProps"), icon: Lt, handler(t, e) { const n = Object.assign(Object.assign({}, O(this.table, p)), { align: this.getTableAlignment(this.table) }); this.toggleAttribute(t, e), this.tablePropertiesForm = new en(this, { attribute: n, type: "table" }), this.hideMenus(); } },
                                cell: {
                                    content: t("cellProps"),
                                    icon: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1692084286647\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2488\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"16\" height=\"16\"><path d=\"M1058.13333333 0v1024H-34.13333333V0h1092.26666666zM460.8 563.2H68.26666667V921.6h392.53333333V563.2z m494.93333333 0H563.2V921.6h392.53333333V563.2zM460.8 102.4H68.26666667v358.4h392.53333333V102.4z\" fill=\"#515151\" p-id=\"2489\"></path></svg>",
                                    handler(t, e) {
                                        const { selectedTds: n } = this.tableBetter.cellSelection,
                                            r = n.length > 1 ? this.getSelectedTdsAttrs(n) : this.getSelectedTdAttrs(n[0]); this.toggleAttribute(t, e), this.tablePropertiesForm = new en(this, { attribute: r, type: "cell" }), this.hideMenus();
                                    },
                                },
                                wrap: {
                                    content: t("insParaOTbl"), icon: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1692084879007\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"968\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"16\" height=\"16\"><path d=\"M512 332.57913685H49.39294151c-20.56031346 0-41.12062691-17.13359531-41.12062805-41.12062692V44.73474502c0-20.56031346 17.13359531-41.12062691 41.12062805-41.12062691H512c20.56031346 0 41.12062691 17.13359531 41.12062691 41.12062691v246.72376491c0 23.98703275-17.13359531 41.12062691-41.12062691 41.12062692zM90.51356843 250.33788188h380.36580466V85.85537308H90.51356843v164.4825088z m884.09349006 757.30488889h-925.21411698c-20.56031346 0-41.12062691-17.13359531-41.12062805-41.12062692v-246.72376491c0-20.56031346 17.13359531-41.12062691 41.12062805-41.12062691h921.78739883c20.56031346 0 41.12062691 17.13359531 41.12062691 41.12062691v246.72376491c0 23.98703275-17.13359531 41.12062691-37.69390876 41.12062692zM90.51356843 928.82823509h842.97286314v-164.48250994H90.51356843v164.48250994z\" fill=\"#515151\" p-id=\"969\"></path><path d=\"M974.60705849 1017.92292864h-925.21411698c-27.41375203 0-47.97406549-20.56031346-47.97406549-47.97406549v-246.72376491c0-27.41375203 20.56031346-47.97406549 47.97406549-47.97406549h921.78739883c27.41375203 0 47.97406549 20.56031346 47.97406435 47.97406549v246.72376491c3.42671929 23.98703275-20.56031346 47.97406549-44.5473462 47.97406549z m-925.21411698-325.53830173c-17.13359531 0-30.84047019 13.70687602-30.84047132 30.84047133v246.72376491c0 17.13359531 13.70687602 30.84047019 30.84047132 30.84047018h921.78739883c17.13359531 0 30.84047019-13.70687602 30.84047019-30.84047018v-246.72376491c0-17.13359531-13.70687602-30.84047019-30.84047019-30.84047133H49.39294151z m890.9469275 243.29704675h-856.67973802v-181.61610523h860.10645731v181.61610523h-3.42671929zM100.79372515 921.97479765h825.83926784V774.62588188H100.79372515v147.34891577z m411.20627485-582.54222223H49.39294151c-27.41375203 0-47.97406549-20.56031346-47.97406549-47.97406549V44.73474502c0-27.41375203 20.56031346-47.97406549 47.97406549-47.97406549H512c27.41375203 0 47.97406549 20.56031346 47.97406549 47.97406549v246.72376491c0 27.41375203-20.56031346 47.97406549-47.97406549 47.97406549zM49.39294151 13.89427484c-17.13359531 0-30.84047019 13.70687602-30.84047132 30.84047018v246.72376491c0 17.13359531 13.70687602 30.84047019 30.84047132 30.84047019H512c17.13359531 0 30.84047019-13.70687602 30.84047019-30.84047019V44.73474502c0-17.13359531-13.70687602-30.84047019-30.84047019-30.84047018H49.39294151zM481.15952981 260.61803974H83.66013099V79.00193451h397.49939882V260.61803974zM100.79372515 243.48444444h363.23220936V96.13552981H100.79372515v147.34891463z\" fill=\"#515151\" p-id=\"970\"></path><path d=\"M974.60705849 130.40271929H628.50844445c-6.85343744 0-10.28015673 3.42671929-10.28015674 10.28015672v58.25422223c0 6.85343744 3.42671929 10.28015673 10.28015674 10.28015673h304.97798712V466.2211766H546.26718947l27.41375204-20.56031345c3.42671929-3.42671929 6.85343744-10.28015673 6.85343744-17.13359531v-58.25422223c0-6.85343744-3.42671929-10.28015673-10.28015673-10.28015672-3.42671929 0-3.42671929 0-6.85343744 3.42671928L409.19843157 486.78149006c-10.28015673 6.85343744-10.28015673 20.56031346-3.42671928 27.41375203l3.42671928 3.42671816 157.62907136 130.21532045c3.42671929 3.42671929 10.28015673 3.42671929 13.70687602 0 0-3.42671929 3.42671929-3.42671929 3.42671929-6.85343744v-61.6809415c0-6.85343744-3.42671929-10.28015673-6.85343858-13.70687602l-20.56031345-17.13359417h421.48643157c20.56031346 0 41.12062691-17.13359531 41.12062691-41.12062805V168.09662691c-6.85343744-20.56031346-23.98703275-37.69390877-44.5473462-37.69390762z\" fill=\"#515151\" p-id=\"971\"></path><path d=\"M573.68094151 661.54415673c-3.42671929 0-6.85343744 0-10.28015673-3.42671929l-157.62907249-130.21531933-3.4267193-3.42671928c-3.42671929-6.85343744-6.85343744-13.70687602-6.85343744-20.56031346 0-6.85343744 3.42671929-13.70687602 10.28015674-20.5603146l157.62907249-126.78860117c3.42671929-3.42671929 6.85343744-3.42671929 10.28015673-3.42671815 10.28015673 0 17.13359531 6.85343744 17.13359417 17.13359416v58.25422223c0 10.28015673-3.42671929 17.13359531-10.28015673 23.98703275l-10.28015673 6.85343744H923.20627485v-239.87032634h-294.6978304c-10.28015673 0-17.13359531-6.85343744-17.13359531-17.13359416V140.68287601c0-10.28015673 6.85343744-17.13359531 17.13359531-17.13359531h346.09861404c27.41375203 0 47.97406549 20.56031346 47.97406549 47.9740655v335.81845732c0 27.41375203-20.56031346 47.97406549-47.97406549 47.97406549H577.10765966l3.42671929 3.42671929c6.85343744 6.85343744 10.28015673 13.70687602 10.28015673 20.56031346v61.6809415c0 3.42671929 0 6.85343744-3.42671815 10.28015674-3.42671929 6.85343744-10.28015673 10.28015673-13.70687602 10.28015673z m0-291.27111112l-157.6290725 126.78860117c-3.42671929 3.42671929-3.42671929 3.42671929-3.42671815 6.85343859s0 6.85343744 3.42671815 10.28015672l157.6290725 130.21532047h3.42671815v-61.68094151c0-3.42671929 0-6.85343744-3.42671815-10.28015673l-41.12062805-34.26718948h442.04674503c17.13359531 0 30.84047019-13.70687602 30.84047132-30.84047132V168.09662691c0-17.13359531-13.70687602-30.84047019-30.84047132-30.84047018H628.50844445v61.68094151h311.83142456v274.1375158H522.28015673l47.97406549-37.69390763c3.42671929-3.42671929 3.42671929-6.85343744 3.42671929-10.28015787v-54.82750293z\" fill=\"#515151\" p-id=\"972\"></path></svg>", handler(t, e) { this.toggleAttribute(t, e); }, children: { before: { content: t("insB4"), handler() { this.insertParagraph(-1); } }, after: { content: t("insAft"), handler() { this.insertParagraph(1); } } },
                                },
                                delete: { content: t("delTable"), icon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9 10V44H39V10H9Z\" fill=\"none\" stroke=\"#333\" stroke-width=\"4\" stroke-linejoin=\"round\"/><path d=\"M20 20V33\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M28 20V33\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 10H44\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M16 10L19.289 4H28.7771L32 10H16Z\" fill=\"none\" stroke=\"#333\" stroke-width=\"4\" stroke-linejoin=\"round\"/></svg>", handler() { this.deleteTable(); } },
                            },
                            r = { copy: { content: t("copyTable"), icon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"16\" height=\"16\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163\" stroke=\"#333\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z\" fill=\"none\" stroke=\"#333\" stroke-width=\"4\" stroke-linejoin=\"round\"/></svg>", handler() { this.copyTable(); } } }; return (e == null ? void 0 : e.length) ? Object.values(e).reduce(((t, e) => (t[e] = Object.assign({}, n, r)[e], t)), {}) : n;
                    }(r, n))) {
                        const {
                                content: e, icon: n, children: r, handler: s,
                            } = t,
                            o = this.createList(r),
                            l = C(e),
                            a = this.createMenu(n, St, !!r); a.appendChild(l), o && a.appendChild(o), i.appendChild(a), a.addEventListener("click", s.bind(this, o, l));
                    } return this.quill.container.appendChild(i), i;
                }

                deleteColumn(t = !1) {
                    const { computeBounds: n, leftTd: r, rightTd: i } = this.getSelectedTdsInfo(),
                        s = this.table.getBoundingClientRect(),
                        o = j(n, this.table, this.quill.container, "column"),
                        l = E(n, this.table, this.quill.container),
                        a = e().find(r).table(),
                        { changeTds: c, delTds: u } = this.getCorrectTds(o, n, r, i); t && u.length !== this.tableBetter.cellSelection.selectedTds.length || (this.tableBetter.cellSelection.updateSelected("column"), a.deleteColumn(c, u, this.deleteTable.bind(this), l), z(this.table, s, n.left - n.right), this.updateMenus());
                }

                deleteRow(t = !1) {
                    const n = this.tableBetter.cellSelection.selectedTds,
                        r = {}; for (const t of n) {
                        let n = ~~t.getAttribute("rowspan") || 1,
                            i = e().find(t.parentElement); if (n > 1) { for (;i && n;) { const t = i.children.head.domNode.getAttribute("data-row"); r[t] || (r[t] = i), i = i.next, n--; } } else { const e = t.getAttribute("data-row"); r[e] || (r[e] = i); }
                    } const i = Object.values(r); if (t) { if (i.reduce(((t, e) => t + e.children.length), 0) !== n.length) { return; } } this.tableBetter.cellSelection.updateSelected("row"), e().find(n[0]).table().deleteRow(i, this.deleteTable.bind(this)), this.updateMenus();
                }

                deleteTable() { const t = e().find(this.table); if (!t) { return; } const n = t.offset(this.quill.scroll); t.remove(), this.tableBetter.hideTools(), this.quill.setSelection(n - 1, 0, e().sources.USER); }

                destroyTablePropertiesForm() { this.tablePropertiesForm && (this.tablePropertiesForm.removePropertiesForm(), this.tablePropertiesForm = null); }

                getCellsOffset(t, n, r, i) {
                    const s = e().find(this.table).descendants($),
                        o = Math.max(n.left, t.left),
                        l = Math.min(n.right, t.right),
                        a = new Map(),
                        c = new Map(),
                        u = new Map(); for (const e of s) { const { left: r, right: i } = M(e.domNode, this.quill.container); r + 2 >= o && i <= l + 2 ? this.setCellsMap(e, a) : r + 2 >= t.left && i <= n.left + 2 ? this.setCellsMap(e, c) : r + 2 >= n.right && i <= t.right + 2 && this.setCellsMap(e, u); } return this.getDiffOffset(a) || this.getDiffOffset(c, r) + this.getDiffOffset(u, i);
                }

                getColsOffset(t, e, n) {
                    let r = t.children.head; const i = Math.max(n.left, e.left),
                        s = Math.min(n.right, e.right); let o = null,
                        l = null,
                        a = 0; for (;r;) { const { width: t } = r.domNode.getBoundingClientRect(); if (o || l ? (o = l, l += t) : (o = M(r.domNode, this.quill.container).left, l = o + t), o > s) { break; } o >= i && l <= s && a--, r = r.next; } return a;
                }

                getCorrectBounds(t) {
                    const e = this.quill.container.getBoundingClientRect(),
                        n = M(t, this.quill.container); return n.width >= e.width ? [Object.assign(Object.assign({}, n), { left: 0, right: e.width }), e] : [n, e];
                }

                getCorrectTds(t, n, r, i) {
                    const s = [],
                        o = [],
                        l = e().find(r).table().colgroup(),
                        a = ~~r.getAttribute("colspan") || 1,
                        c = ~~i.getAttribute("colspan") || 1; if (l) { for (const e of t) { const t = M(e, this.quill.container); if (t.left + 2 >= n.left && t.right <= n.right + 2) { o.push(e); } else { const r = this.getColsOffset(l, n, t); s.push([e, r]); } } } else { for (const e of t) { const t = M(e, this.quill.container); if (t.left + 2 >= n.left && t.right <= n.right + 2) { o.push(e); } else { const r = this.getCellsOffset(n, t, a, c); s.push([e, r]); } } } return { changeTds: s, delTds: o };
                }

                getDiffOffset(t, e) { let n = 0; const r = this.getTdsFromMap(t); if (r.length) { if (e) { for (const t of r) { n += ~~t.getAttribute("colspan") || 1; }n -= e; } else { for (const t of r) { n -= ~~t.getAttribute("colspan") || 1; } } } return n; }

                getRefInfo(t, e) { let n = null; if (!t) { return { id: tt(), ref: n }; } let r = t.children.head; const i = r.domNode.getAttribute("data-row"); for (;r;) { const { left: t } = r.domNode.getBoundingClientRect(); if (Math.abs(t - e) <= 2) { return { id: i, ref: r }; } Math.abs(t - e) >= 2 && !n && (n = r), r = r.next; } return { id: i, ref: n }; }

                getSelectedTdAttrs(t) {
                    const n = (function (t) {
                        const e = "left"; let n = null; const r = t.descendants(W),
                            i = t.descendants(v),
                            s = t.descendants(x); function o(t) { for (const e of t.domNode.classList) { if (/ql-align-/.test(e)) { return e.split("ql-align-")[1]; } } return e; } for (const t of [...r, ...i, ...s]) { const r = o(t); if ((l = n) != null && l !== r) { return e; } n = r; } let l; return n != null ? n : e;
                    }(e().find(t))); return n ? Object.assign(Object.assign({}, O(t, h)), { "text-align": n }) : O(t, h);
                }

                getSelectedTdsAttrs(t) { const e = new Map(); let n = null; for (const r of t) { const t = this.getSelectedTdAttrs(r); if (n) { for (const r of Object.keys(n)) { e.has(r) || t[r] !== n[r] && e.set(r, !1); } } else { n = t; } } for (const t of Object.keys(n)) { e.has(t) && (n[t] = u[t]); } return n; }

                getSelectedTdsInfo() {
                    const { startTd: t, endTd: e } = this.tableBetter.cellSelection,
                        n = M(t, this.quill.container),
                        r = M(e, this.quill.container),
                        i = S(n, r); return n.left <= r.left && n.top <= r.top ? { computeBounds: i, leftTd: t, rightTd: e } : { computeBounds: i, leftTd: e, rightTd: t };
                }

                getTableAlignment(t) { const e = t.getAttribute("align"); if (!e) { const { [tn.left]: e, [tn.right]: n } = O(t, [tn.left, tn.right]); return e === "auto" ? n === "auto" ? "center" : "right" : "left"; } return e || "center"; }

                getTdsFromMap(t) { return Object.values(Object.fromEntries(t)).reduce(((t, e) => (t.length > e.length ? t : e)), []); }

                handleClick(t) { const e = t.target.closest("table"); if (this.prevList && this.prevList.classList.add("ql-hidden"), this.prevTooltip && this.prevTooltip.classList.remove("ql-table-tooltip-hidden"), this.prevList = null, this.prevTooltip = null, !e && !this.tableBetter.cellSelection.selectedTds.length) { return this.hideMenus(), void this.destroyTablePropertiesForm(); } this.tablePropertiesForm || (this.showMenus(), this.updateMenus(e), (e && !e.isEqualNode(this.table) || this.scroll) && this.updateScroll(!1), this.table = e); }

                hideMenus() { this.root.classList.add("ql-hidden"); }

                insertColumn(t, n) {
                    const { left: r, right: i, width: s } = t.getBoundingClientRect(),
                        o = e().find(t).table(),
                        l = t.parentElement.lastChild.isEqualNode(t),
                        a = n > 0 ? i : r; o.insertColumn(a, l, s, n), this.quill.scrollSelectionIntoView();
                }

                insertParagraph(t) {
                    const n = e().find(this.table),
                        r = this.quill.getIndex(n),
                        i = t > 0 ? n.length() : 0,
                        o = (new (s())()).retain(r + i).insert("\n"); this.quill.updateContents(o, e().sources.USER), this.quill.setSelection(r + i, e().sources.SILENT), this.tableBetter.hideTools(), this.quill.scrollSelectionIntoView();
                }

                insertRow(t, n) {
                    const r = e().find(t),
                        i = r.rowOffset(),
                        s = r.table(); if (n > 0) { const e = ~~t.getAttribute("rowspan") || 1; s.insertRow(i + n + e - 1, n); } else { s.insertRow(i + n, n); } this.quill.scrollSelectionIntoView();
                }

                mergeCells() {
                    let t,
                        n; const { selectedTds: r } = this.tableBetter.cellSelection,
                        { computeBounds: i, leftTd: s } = this.getSelectedTdsInfo(),
                        o = e().find(s),
                        [l, a] = N(o),
                        c = o.children.head,
                        u = o.table().tbody().children,
                        h = o.row(),
                        d = h.children.reduce(((t, e) => { const n = M(e.domNode, this.quill.container); return n.left >= i.left && n.right <= i.right && (t += ~~e.domNode.getAttribute("colspan") || 1), t; }), 0),
                        p = u.reduce(((t, e) => { const n = M(e.domNode, this.quill.container); if (n.top >= i.top && n.bottom <= i.bottom) { let n = Number.MAX_VALUE; e.children.forEach(((t) => { const e = ~~t.domNode.getAttribute("rowspan") || 1; n = Math.min(n, e); })), t += n; } return t; }), 0); let f = 0; for (const i of r) { if (s.isEqualNode(i)) { continue; } const r = e().find(i); r.moveChildren(o), r.remove(), ((n = (t = r.parent) === null || void 0 === t ? void 0 : t.children) === null || void 0 === n ? void 0 : n.length) || f++; }f && h.children.forEach(((t) => {
                        if (t.domNode.isEqualNode(s)) { return; } const e = t.domNode.getAttribute("rowspan"),
                            [n] = N(t); t.replaceWith(t.statics.blotName, Object.assign(Object.assign({}, n), { rowspan: e - f }));
                    })), o.setChildrenId(a), c.format(o.statics.blotName, Object.assign(Object.assign({}, l), { colspan: d, rowspan: p - f })), this.tableBetter.cellSelection.setSelected(c.parent.domNode), this.quill.scrollSelectionIntoView();
                }

                setCellsMap(t, e) { const n = t.domNode.getAttribute("data-row"); e.has(n) ? e.set(n, [...e.get(n), t.domNode]) : e.set(n, [t.domNode]); }

                showMenus() { this.root.classList.remove("ql-hidden"); }

                splitCell() {
                    const { selectedTds: t } = this.tableBetter.cellSelection,
                        { leftTd: n } = this.getSelectedTdsInfo(),
                        r = e().find(n).children.head; for (const n of t) {
                        const t = ~~n.getAttribute("colspan") || 1,
                            r = ~~n.getAttribute("rowspan") || 1; if (t === 1 && r === 1) { continue; } const i = [],
                            { width: s, right: o } = n.getBoundingClientRect(),
                            l = e().find(n),
                            a = l.table(),
                            c = l.next,
                            u = l.row(); if (r > 1) { if (t > 1) { let e = u.next; for (let n = 1; n < r; n++) { const { ref: n, id: r } = this.getRefInfo(e, o); for (let s = 0; s < t; s++) { i.push([e, r, n]); }e && (e = e.next); } } else { let t = u.next; for (let e = 1; e < r; e++) { const { ref: e, id: n } = this.getRefInfo(t, o); i.push([t, n, e]), t && (t = t.next); } } } if (t > 1) { const e = n.getAttribute("data-row"); for (let n = 1; n < t; n++) { i.push([u, e, c]); } } for (const [t, e, n] of i) { a.insertColumnCell(t, e, n); } const [h] = N(l); l.replaceWith(l.statics.blotName, Object.assign(Object.assign({}, h), { width: ~~(s / t), colspan: null, rowspan: null }));
                    } this.tableBetter.cellSelection.setSelected(r.parent.domNode), this.quill.scrollSelectionIntoView();
                }

                toggleAttribute(t, e) { this.prevList && !this.prevList.isEqualNode(t) && (this.prevList.classList.add("ql-hidden"), this.prevTooltip.classList.remove("ql-table-tooltip-hidden")), t && (t.classList.toggle("ql-hidden"), e.classList.toggle("ql-table-tooltip-hidden"), this.prevList = t, this.prevTooltip = e); }

                updateMenus(t = this.table) {
                    t && requestAnimationFrame((() => {
                        this.root.classList.remove("ql-table-triangle-none"); const [e, n] = this.getCorrectBounds(t),
                            {
                                left: r, right: i, top: s, bottom: o,
                            } = e,
                            { height: l, width: a } = this.root.getBoundingClientRect(),
                            c = this.quill.getModule("toolbar"),
                            u = getComputedStyle(c.container); let h = s - l - 10,
                            d = r + i - a >> 1; h > -parseInt(u.paddingBottom) ? (this.root.classList.add("ql-table-triangle-up"), this.root.classList.remove("ql-table-triangle-down")) : (h = o > n.height ? n.height + 10 : o + 10, this.root.classList.add("ql-table-triangle-down"), this.root.classList.remove("ql-table-triangle-up")), d < n.left ? (d = 0, this.root.classList.add("ql-table-triangle-none")) : d + a > n.right && (d = n.right - a, this.root.classList.add("ql-table-triangle-none")), D(this.root, { left: `${d}px`, top: `${h}px` });
                    }));
                }

                updateScroll(t) { this.scroll = t; }

                updateTable(t) { this.table = t; }
            }, rn = e().import("blots/inline"); e().import("ui/icons")["table-better"] = Lt; class sn extends rn {} class on {
            constructor() { this.computeChildren = [], this.root = this.createContainer(); }

            clearSelected(t) { for (const e of t) { e.classList && e.classList.remove("ql-cell-selected"); } this.computeChildren = [], this.root && this.setLabelContent(this.root.lastElementChild, null); }

            createContainer() {
                const t = document.createElement("div"),
                    e = document.createElement("div"),
                    n = document.createElement("div"),
                    r = document.createDocumentFragment(); for (let t = 1; t <= 10; t++) { for (let e = 1; e <= 10; e++) { const n = document.createElement("span"); n.setAttribute("row", `${t}`), n.setAttribute("column", `${e}`), r.appendChild(n); } } return n.innerHTML = "0 x 0", t.classList.add("ql-table-select-container", "ql-hidden"), e.classList.add("ql-table-select-list"), n.classList.add("ql-table-select-label"), e.appendChild(r), t.appendChild(e), t.appendChild(n), t.addEventListener("mousemove", (e => this.handleMouseMove(e, t))), t;
            }

            getComputeChildren(t, e) {
                const n = [],
                    { clientX: r, clientY: i } = e; for (const e of t) { const { left: t, top: s } = e.getBoundingClientRect(); r >= t && i >= s && n.push(e); } return n;
            }

            getSelectAttrs(t) { return [~~t.getAttribute("row"), ~~t.getAttribute("column")]; }

            handleClick(t, e) { this.toggle(this.root); const n = t.target.closest("span[row]"); if (n) { this.insertTable(n, e); } else { const t = this.computeChildren[this.computeChildren.length - 1]; t && this.insertTable(t, e); } }

            handleMouseMove(t, e) { const n = e.firstElementChild.children; this.clearSelected(this.computeChildren); const r = this.getComputeChildren(n, t); for (const t of r) { t.classList && t.classList.add("ql-cell-selected"); } this.computeChildren = r, this.setLabelContent(e.lastElementChild, r[r.length - 1]); }

            hide(t) { this.clearSelected(this.computeChildren), t && t.classList.add("ql-hidden"); }

            insertTable(t, e) { const [n, r] = this.getSelectAttrs(t); e(n, r), this.hide(this.root); }

            setLabelContent(t, e) { if (e) { const [n, r] = this.getSelectAttrs(e); t.innerHTML = `${n} x ${r}`; } else { t.innerHTML = "0 x 0"; } }

            show(t) { this.clearSelected(this.computeChildren), t && t.classList.remove("ql-hidden"); }

            toggle(t) { this.clearSelected(this.computeChildren), t && t.classList.toggle("ql-hidden"); }
        } const ln = r(696), an = e().import("blots/container"),
            cn = e().import("modules/toolbar"); class un extends cn {
            attach(t) { let e = Array.from(t.classList).find((t => t.indexOf("ql-") === 0)); if (!e) { return; } if (e = e.slice(3), t.tagName === "BUTTON" && t.setAttribute("type", "button"), this.handlers[e] == null && this.quill.scroll.query(e) == null) { return void console.warn("ignoring attaching to nonexistent format", e, t); } const n = t.tagName === "SELECT" ? "change" : "click"; t.addEventListener(n, ((n) => { let r; const { cellSelection: i } = this.getTableBetter(); ((r = i == null ? void 0 : i.selectedTds) === null || void 0 === r ? void 0 : r.length) > 1 ? this.cellSelectionAttach(t, e, n, i) : this.toolbarAttach(t, e, n); })), this.controls.push([e, t]); }

            cellSelectionAttach(t, e, n, r) {
                if (t.tagName === "SELECT") {
                    if (t.selectedIndex < 0) { return; } const n = t.options[t.selectedIndex],
                        i = typeof (n == null ? void 0 : n.value) !== "string" || (n == null ? void 0 : n.value),
                        s = r.getCorrectValue(e, i); r.setSelectedTdsFormat(e, s);
                } else {
                    const i = (t == null ? void 0 : t.value) || !0,
                        s = r.getCorrectValue(e, i); r.setSelectedTdsFormat(e, s), n.preventDefault();
                }
            }

            getTableBetter() { return this.quill.getModule("table-better") || {}; }

            setTableFormat(t, n, r, i, s) {
                let o = null; const { cellSelection: l, tableMenus: a } = this.getTableBetter(),
                    c = (function (t, n, r) {
 if (n.length === 1) {
 const i = (function (t, e = 0, n = Number.MAX_VALUE) {
 const r = (t, e, n) => {
 let i = [],
                        s = n; return t.children.forEachAt(e, n, ((t, e, n) => { t instanceof an && (i.push(t), i = i.concat(r(t, e, s))), s -= n; })), i; 
}; return r(t, e, n); 
}(e().find(n[0]), t.index, t.length)); return dn(i) === dn(r); 
} return !!(n.length > 1); 
}(t, n, s)); for (const t of s) { const e = hn(n, i, t, c); o = t.format(i, r, e); } if (n.length < 2) { if (c || s.length === 1) { const t = B(o); Promise.resolve().then((() => { t && this.quill.root.contains(t.domNode) ? l.setSelected(t.domNode, !1) : l.setSelected(n[0], !1); })); } else { l.setSelected(n[0], !1); } this.quill.setSelection(t, e().sources.SILENT); } return a.updateMenus(), o;
            }

            toolbarAttach(t, n, r) { let i; if (t.tagName === "SELECT") { if (t.selectedIndex < 0) { return; } const e = t.options[t.selectedIndex]; i = !e.hasAttribute("selected") && (e.value || !1); } else { i = !t.classList.contains("ql-active") && (t.value || !t.hasAttribute("value")), r.preventDefault(); } this.quill.focus(); const [o] = this.quill.selection.getRange(); if (this.handlers[n] != null) { this.handlers[n].call(this, i); } else if (this.quill.scroll.query(n).prototype instanceof ln.EmbedBlot) { if (i = prompt(`Enter ${n}`), !i) { return; } this.quill.updateContents((new (s())()).retain(o.index).delete(o.length).insert({ [n]: i }), e().sources.USER); } else { this.quill.format(n, i, e().sources.USER); } this.update(o); }
        } function hn(t, e, n, r) { return t.length === 1 && e === "list" && n.statics.blotName === x.blotName || r; } function dn(t) { return t.reduce(((t, e) => t + e.length()), 0); } function pn(t, e, n, r) { const i = this.quill.getSelection(); if (!r) { if (i.length || e.length !== 1) { r = this.quill.getLines(i); } else { const [t] = this.quill.getLine(i.index); r = [t]; } } return this.setTableFormat(i, e, t, n, r); }un.DEFAULTS = nt()({}, cn.DEFAULTS, {
            handlers: {
                header(t, n) {
                    const { cellSelection: r } = this.getTableBetter(),
                        i = r == null ? void 0 : r.selectedTds; if (i == null ? void 0 : i.length) { return pn.call(this, t, i, "header", n); } this.quill.format("header", t, e().sources.USER);
                },
                list(t, n) {
                    const { cellSelection: r } = this.getTableBetter(),
                        i = r == null ? void 0 : r.selectedTds; if (i == null ? void 0 : i.length) {
                        if (i.length === 1) {
                            const e = this.quill.getSelection(!0),
                                n = this.quill.getFormat(e); t = r.getListCorrectValue("list", t, n);
                        } return pn.call(this, t, i, "list", n);
                    } const s = this.quill.getSelection(!0),
                        o = this.quill.getFormat(s); t === "check" ? o.list === "checked" || o.list === "unchecked" ? this.quill.format("list", !1, e().sources.USER) : this.quill.format("list", "unchecked", e().sources.USER) : this.quill.format("list", t, e().sources.USER);
                },
                "table-better": function () {},
            },
        }); const fn = un, gn = ["error", "warn", "log", "info"]; let bn = "warn"; function mn(t) { if (bn && gn.indexOf(t) <= gn.indexOf(bn)) { for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) { n[r - 1] = arguments[r]; }console[t](...n); } } function vn(t) { return gn.reduce(((e, n) => (e[n] = mn.bind(console, n, t), e)), {}); }vn.level = (t) => { bn = t; }, mn.level = vn.level; const yn = vn, wn = e().import("modules/clipboard"),
            xn = yn("quill:clipboard"), kn = class extends wn {
                onPaste(t, { text: n, html: r }) {
                    const i = this.quill.getFormat(t.index),
                        o = this.getTableDelta({ text: n, html: r }, i); xn.log("onPaste", o, { text: n, html: r }); const l = (new (s())()).retain(t.index).delete(t.length).concat(o); this.quill.updateContents(l, e().sources.USER), this.quill.setSelection(l.length() - t.length, e().sources.SILENT), this.quill.scrollSelectionIntoView();
                }

                getTableDelta({ html: t, text: e }, n) {
                    let r,
                        i,
                        o; const l = this.convert({ text: e, html: t }, n); if (n[W.blotName]) { for (const t of l.ops) { if ((t == null ? void 0 : t.attributes) && (t.attributes[Y.blotName] || t.attributes[W.blotName])) { return new (s())(); } (((r = t == null ? void 0 : t.attributes) === null || void 0 === r ? void 0 : r.header) || ((i = t == null ? void 0 : t.attributes) === null || void 0 === i ? void 0 : i.list) || !((o = t == null ? void 0 : t.attributes) === null || void 0 === o ? void 0 : o[W.blotName])) && (t.attributes = Object.assign(Object.assign({}, t.attributes), n)); } } return l;
                }
            }, Cn = e().import("core/module"); class _n extends Cn {
            static register() { e().register(W, !0), e().register($, !0), e().register(G, !0), e().register(K, !0), e().register(Y, !0), e().register(J, !0), e().register(Z, !0), e().register(X, !0), e().register("modules/toolbar", fn, !0), e().register("modules/clipboard", kn, !0); }

            constructor(t, e) { super(t, e), t.clipboard.addMatcher("td, th", ot), t.clipboard.addMatcher("tr", st), t.clipboard.addMatcher("col", lt), t.clipboard.addMatcher("table", at), this.language = new gt(e == null ? void 0 : e.language), this.cellSelection = new Nt(t, this), this.operateLine = new At(t, this), this.tableMenus = new nn(t, this), this.tableSelect = new on(), t.root.addEventListener("keyup", this.handleKeyup.bind(this)), t.root.addEventListener("mousedown", this.handleMousedown.bind(this)), t.root.addEventListener("scroll", this.handleScroll.bind(this)), this.registerToolbarTable(e == null ? void 0 : e.toolbarTable); }

            clearHistorySelected() { const [t] = this.getTable(); if (!t) { return; } const e = Array.from(t.domNode.querySelectorAll("td.ql-cell-focused, td.ql-cell-selected")); for (const t of e) { t.classList && t.classList.remove("ql-cell-focused", "ql-cell-selected"); } }

            deleteTable() { const [t] = this.getTable(); if (t == null) { return; } const n = t.offset(); t.remove(), this.hideTools(), this.quill.update(e().sources.USER), this.quill.setSelection(n, e().sources.SILENT); }

            deleteTableTemporary() { const t = this.quill.scroll.descendants(Y); for (const e of t) { e.remove(); } this.hideTools(); }

            getTable(t = this.quill.getSelection()) {
                if (t == null) { return [null, null, null, -1]; } const [e, n] = this.quill.getLine(t.index); if (e == null || e.statics.blotName !== W.blotName) { return [null, null, null, -1]; } const r = e.parent,
                    i = r.parent; return [i.parent.parent, i, r, n];
            }

            handleKeyup(t) { this.cellSelection.handleKeyup(t), !t.ctrlKey || t.key !== "z" && t.key !== "y" || (this.hideTools(), this.clearHistorySelected()), this.updateMenus(t); }

            handleMousedown(t) { let e; if ((e = this.tableSelect) === null || void 0 === e || e.hide(this.tableSelect.root), !t.target.closest("table")) { return this.hideTools(); } this.cellSelection.handleMousedown(t), this.cellSelection.setDisabled(!0); }

            handleScroll() { let t; this.hideTools(), (t = this.tableMenus) === null || void 0 === t || t.updateScroll(!0); }

            hideTools() {
                let t,
                    e,
                    n,
                    r,
                    i,
                    s,
                    o; (t = this.cellSelection) === null || void 0 === t || t.clearSelected(), (e = this.cellSelection) === null || void 0 === e || e.setDisabled(!1), (n = this.operateLine) === null || void 0 === n || n.hideDragBlock(), (r = this.operateLine) === null || void 0 === r || r.hideDragTable(), (i = this.operateLine) === null || void 0 === i || i.hideLine(), (s = this.tableMenus) === null || void 0 === s || s.hideMenus(), (o = this.tableMenus) === null || void 0 === o || o.destroyTablePropertiesForm();
            }

            insertTable(t, n) {
                const r = this.quill.getSelection(!0); if (r == null) { return; } if (this.isTable(r)) { return; } const i = this.quill.getFormat(r.index - 1),
                    [, o] = this.quill.getLine(r.index),
                    l = !!i[W.blotName] || o !== 0,
                    a = l ? 2 : 1,
                    c = l ? (new (s())()).insert("\n") : new (s())(),
                    u = (new (s())()).retain(r.index).delete(r.length).concat(c)
                        .insert("\n", { [Y.blotName]: {} }),
                    h = new Array(t).fill(0).reduce(((t) => { const e = tt(); return new Array(n).fill("\n").reduce(((t, n) => t.insert(n, { [W.blotName]: Q(), [$.blotName]: { "data-row": e, width: "72" } })), t); }), u); this.quill.updateContents(h, e().sources.USER), this.quill.setSelection(r.index + a, e().sources.SILENT), this.showTools();
            }

            isTable(t) { return !!this.quill.getFormat(t.index)[W.blotName]; }

            registerToolbarTable(t) { if (!t) { return; } e().register("formats/table-better", sn, !0); const n = this.quill.getModule("toolbar").container.querySelector("button.ql-table-better"); n && this.tableSelect.root && (n.appendChild(this.tableSelect.root), n.addEventListener("click", ((t) => { this.tableSelect.handleClick(t, this.insertTable.bind(this)); })), document.addEventListener("click", ((t) => { t.composedPath().includes(n) || this.tableSelect.root.classList.contains("ql-hidden") || this.tableSelect.hide(this.tableSelect.root); }))); }

            showTools(t) { const [e,, n] = this.getTable(); e && n && (this.cellSelection.setDisabled(!0), this.cellSelection.setSelected(n.domNode, t), this.tableMenus.showMenus(), this.tableMenus.updateMenus(e.domNode), this.tableMenus.updateTable(e.domNode)); }

            updateMenus(t) { this.cellSelection.selectedTds.length && (t.key === "Enter" || t.ctrlKey && t.key === "v") && this.tableMenus.updateMenus(); }
        } const Tn = {
            "table-cell down": An(!1),
            "table-cell up": An(!0),
            "table-cell-block backspace": Nn("Backspace"),
            "table-cell-block delete": Nn("Delete"),
            "table-header backspace": Ln("Backspace"),
            "table-header delete": Ln("Delete"),
            "table-header enter": {
                key: "Enter",
                collapsed: !0,
                format: ["table-header"],
                suffix: /^$/,
                handler(t, n) {
                    const [r, i] = this.quill.getLine(t.index),
                        o = (new (s())()).retain(t.index).insert("\n", n.format).retain(r.length() - i - 1)
                            .retain(1, { header: null }); this.quill.updateContents(o, e().sources.USER), this.quill.setSelection(t.index + 1, e().sources.SILENT), this.quill.scrollSelectionIntoView();
                },
            },
            "table-list backspace": Sn("Backspace"),
            "table-list delete": Sn("Delete"),
            "table-list empty enter": {
                key: "Enter",
                collapsed: !0,
                format: ["table-list"],
                empty: !0,
                handler(t, e) {
                    const { line: n } = e,
                        { cellId: r } = n.parent.formats()[n.parent.statics.blotName],
                        i = n.replaceWith(W.blotName, r),
                        s = this.quill.getModule("table-better"),
                        o = B(i); o && s.cellSelection.setSelected(o.domNode, !1);
                },
            },
        }; function Nn(t) {
            return {
                key: t,
                format: ["table-cell-block"],
                collapsed: !0,
                handler(e, n) {
                    let r; const [i] = this.quill.getLine(e.index),
                        { offset: s, suffix: o } = n; if (s === 0 && !i.prev) { return !1; } const l = (r = i.prev) === null || void 0 === r ? void 0 : r.statics.blotName; return s !== 0 || l !== m.blotName && l !== W.blotName && l !== x.blotName ? !(s !== 0 && !o && t === "Delete") : En.call(this, i, e);
                },
            };
        } function An(t) {
            return {
                key: t ? "ArrowUp" : "ArrowDown", collapsed: !0, format: ["table-cell"], handler() { return !1; },
            };
        } function Ln(t) {
            return {
                key: t, format: ["table-header"], collapsed: !0, empty: !0, handler(t, e) { const [n] = this.quill.getLine(t.index); if (n.prev) { return En.call(this, n, t); } { const t = A(n.formats()[n.statics.blotName]); n.replaceWith(W.blotName, t); } },
            };
        } function Sn(t) {
            return {
                key: t,
                format: ["table-list"],
                collapsed: !0,
                empty: !0,
                handler(t, e) {
                    const [n] = this.quill.getLine(t.index),
                        r = A(n.parent.formats()[n.parent.statics.blotName]); n.replaceWith(W.blotName, r);
                },
            };
        } function En(t, n) { const r = this.quill.getModule("table-better"); return t.remove(), r == null || r.tableMenus.updateMenus(), this.quill.setSelection(n.index - 1, e().sources.SILENT), !1; }_n.keyboardBindings = Tn; var jn = _n;
    }()), i.default;
}()))));