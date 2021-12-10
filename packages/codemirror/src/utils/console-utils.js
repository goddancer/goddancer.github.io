import { getEl } from './el.js';

export function formatArray(t) {
  for (var e = "", r = 0, n = t.length; r < n; r++) {
    "string" == typeof t[r] ? e += '"' + t[r] + '"' : Array.isArray(t[r]) ? (e += "Array [",
    e += formatArray(t[r]),
    e += "]") : e += formatOutput(t[r]),
    r < t.length - 1 && (e += ", ");
  }
  return e
}
export function formatObject(t) {
  var e = t.constructor ? t.constructor.name : t;
  if ("String" === e) {
    return `String { "${t.valueOf()}" }`;
  }
  if (t === JSON) {
    return "JSON {}";
  }
  if (e.match && e.match(/^(ArrayBuffer|SharedArrayBuffer|DataView)$/)) {
    return e + " {}";
  }
  if (e.match && e.match(/^(Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array|Float64Array|BigInt64Array|BigUint64Array)$/)) {
    return t.length > 0 ? e + " [" + formatArray(t) + "]" : e + " []";
  }
  if ("Symbol" === e && void 0 !== t) {
    return t.toString();
  }
  if ("Object" === e) {
    var r = "", n = !0;
    for (var i in t) {
      t.hasOwnProperty(i) && (n ? n = !1 : r += ", ", r = r + i + ": " + formatOutput(t[i]));
    }
    return e + " { " + r + " }"
  }
  if (!e.constructor || !e.prototype) {
    r = "", n = !0;
    for (var i in t) {
      n ? n = !1 : r += ", ", r = r + i + ": " + formatOutput(t[i]);
    }
    return "Object { " + r + " }"
  }
  return t
}
export function formatOutput(t) {
  return void 0 === t || null === t || "boolean" == typeof t ? String(t) : "number" == typeof t ? Object.is(t, -0) ? "-0" : String(t) : "bigint" == typeof t ? String(t) + "n" : "string" == typeof t ? t.includes('"') ? "'" + t + "'" : '"' + t + '"' : Array.isArray(t) ? "Array [" + formatArray(t) + "]" : formatObject(t)
}
export function writeOutput(text) {
  const { consoleCodeEl } = getEl();
  const oldText = consoleCodeEl.textContent;
  const newText = `> ${text}\n`;
  consoleCodeEl.textContent = oldText + newText
}