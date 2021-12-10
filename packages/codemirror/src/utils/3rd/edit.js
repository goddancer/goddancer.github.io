!function() {
    return function t(e, r, n) {
        function i(s, a) {
            if (!r[s]) {
                if (!e[s]) {
                    var c = "function" == typeof require && require;
                    if (!a && c)
                        return c(s, !0);
                    if (o)
                        return o(s, !0);
                    var d = new Error("Cannot find module '" + s + "'");
                    throw d.code = "MODULE_NOT_FOUND",
                    d
                }
                var l = r[s] = {
                    exports: {}
                };
                e[s][0].call(l.exports, function(t) {
                    return i(e[s][1][t] || t)
                }, l, l.exports, t, e, r, n)
            }
            return r[s].exports
        }
        for (var o = "function" == typeof require && require, s = 0; s < n.length; s++)
            i(n[s]);
        return i
    }
}()({
    1: [function(t, e, r) {
        !function() {
            "use strict";
            var e, r, n = t("./editor-libs/feature-detector.js"), i = t("./editor-libs/console"), o = t("./editor-libs/events.js"), s = (t("./editor-libs/mce-utils"),
            document.getElementById("static-js")), a = s.dataset.feature, c = document.getElementById("execute"), d = document.querySelector("#console code"), l = document.getElementById("reset");
            function u() {
                !function(t) {
                    d.classList.add("fade-in");
                    try {
                        new Function(t)()
                    } catch (t) {
                        d.textContent = "Error: " + t.message
                    }
                    d.addEventListener("animationend", function() {
                        d.classList.remove("fade-in")
                    })
                }(e.getDoc().getValue())
            }
            !document.all && n.isDefined(a) && (document.documentElement.classList.add("js"),
            s.dataset.height && document.getElementById("editor").classList.add(s.dataset.height),
            document.getElementById("static").classList.add("hidden"),
            document.getElementById("live").classList.remove("hidden"),
            i(),
            o.register(),
            r = document.getElementById("editor"),
            e = CodeMirror(r, {
                inputStyle: "contenteditable",
                lineNumbers: !0,
                mode: "javascript",
                undoDepth: 5,
                tabindex: 0,
                value: s.textContent
            }),
            c.addEventListener("click", function() {
                d.textContent = "",
                u()
            }),
            l.addEventListener("click", function() {
                window.location.reload()
            }))
        }()
    }
    , {
        "./editor-libs/console": 4,
        "./editor-libs/events.js": 6,
        "./editor-libs/feature-detector.js": 7,
        "./editor-libs/mce-utils": 8
    }],
    2: [function(t, e, r) {
        var n = t("./mce-utils");
        e.exports = {
            addClippy: function() {
                "use strict";
                new Clipboard(".copy",{
                    target: function(t) {
                        var e = t.dataset.clipboardTarget;
                        return e ? document.querySelector(e) : n.findParentChoiceElem(t).getElementsByTagName("code")[0]
                    }
                }).on("success", function(t) {
                    var e = document.getElementById("user-message");
                    e.classList.add("show"),
                    e.setAttribute("aria-hidden", !1),
                    function(t, e) {
                        var r = t.trigger
                          , n = r.offsetParent.offsetTop + r.clientHeight + 10 + "px"
                          , i = r.offsetLeft + "px";
                        e.style.top = n,
                        e.style.left = i
                    }(t, e),
                    window.setTimeout(function() {
                        e.classList.remove("show"),
                        e.setAttribute("aria-hidden", !0)
                    }, 1e3),
                    t.clearSelection()
                })
            },
            toggleClippy: function(t) {
                "use strict";
                for (var e = t.querySelector(".copy"), r = document.querySelectorAll(".copy"), n = 0, i = r.length; n < i; n++)
                    r[n].classList.add("hidden"),
                    r[n].setAttribute("aria-hidden", !0);
                e.classList.remove("hidden"),
                e.setAttribute("aria-hidden", !1)
            }
        }
    }
    , {
        "./mce-utils": 8
    }],
    3: [function(t, e, r) {
        e.exports = {
            formatArray: function(t) {
                "use strict";
                for (var e = "", r = 0, n = t.length; r < n; r++)
                    "string" == typeof t[r] ? e += '"' + t[r] + '"' : Array.isArray(t[r]) ? (e += "Array [",
                    e += this.formatArray(t[r]),
                    e += "]") : e += this.formatOutput(t[r]),
                    r < t.length - 1 && (e += ", ");
                return e
            },
            formatObject: function(t) {
                var e = t.constructor ? t.constructor.name : t;
                if ("String" === e)
                    return `String { "${t.valueOf()}" }`;
                if (t === JSON)
                    return "JSON {}";
                if (e.match && e.match(/^(ArrayBuffer|SharedArrayBuffer|DataView)$/))
                    return e + " {}";
                if (e.match && e.match(/^(Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array|Float64Array|BigInt64Array|BigUint64Array)$/))
                    return t.length > 0 ? e + " [" + this.formatArray(t) + "]" : e + " []";
                if ("Symbol" === e && void 0 !== t)
                    return t.toString();
                if ("Object" === e) {
                    var r = ""
                      , n = !0;
                    for (var i in t)
                        t.hasOwnProperty(i) && (n ? n = !1 : r += ", ",
                        r = r + i + ": " + this.formatOutput(t[i]));
                    return e + " { " + r + " }"
                }
                if (!e.constructor || !e.prototype) {
                    r = "",
                    n = !0;
                    for (var i in t)
                        n ? n = !1 : r += ", ",
                        r = r + i + ": " + this.formatOutput(t[i]);
                    return "Object { " + r + " }"
                }
                return t
            },
            formatOutput: function(t) {
                "use strict";
                return void 0 === t || null === t || "boolean" == typeof t ? String(t) : "number" == typeof t ? Object.is(t, -0) ? "-0" : String(t) : "bigint" == typeof t ? String(t) + "n" : "string" == typeof t ? t.includes('"') ? "'" + t + "'" : '"' + t + '"' : Array.isArray(t) ? "Array [" + this.formatArray(t) + "]" : this.formatObject(t)
            },
            writeOutput: function(t) {
                "use strict";
                var e = document.querySelector("#console code")
                  , r = e.textContent
                  , n = "> " + t + "\n";
                e.textContent = r + n
            }
        }
    }
    , {}],
    4: [function(t, e, r) {
        e.exports = function() {
            "use strict";
            var e = t("./console-utils")
              , r = console.log
              , n = console.error;
            console.error = function(t) {
                e.writeOutput(t),
                n.apply(console, arguments)
            }
            ,
            console.log = function() {
                for (var t = [], n = 0, i = arguments.length; n < i; n++) {
                    var o = e.formatOutput(arguments[n]);
                    t.push(o)
                }
                var s = t.join(" ");
                e.writeOutput(s),
                r.apply(console, arguments)
            }
        }
    }
    , {
        "./console-utils": 3
    }],
    5: [function(t, e, r) {
        e.exports = {
            editTimer: void 0,
            applyCode: function(t, e, r) {
                var n = r || document.getElementById("example-element");
                t.replace(/(\/\*)[\s\S]+(\*\/)/g, ""),
                n.style.cssText = t,
                clearTimeout(this.editTimer),
                this.editTimer = setTimeout(function() {
                    n.style.cssText ? e.parentNode.classList.remove("invalid") : e.parentNode.classList.add("invalid")
                }, 500)
            },
            choose: function(t) {
                var r = t.querySelector("code");
                t.classList.add("selected"),
                r.setAttribute("contentEditable", !0),
                r.setAttribute("spellcheck", !1),
                e.exports.applyCode(r.textContent, t)
            },
            resetDefault: function() {
                var t = document.getElementById("default-example")
                  , r = document.getElementById("output");
                if (t.classList.contains("hidden")) {
                    for (var n = r.querySelectorAll("section"), i = 0, o = n.length; i < o; i++)
                        n[i].classList.add("hidden"),
                        n[i].setAttribute("aria-hidden", !0);
                    t.classList.remove("hidden"),
                    t.setAttribute("aria-hidden", !1)
                }
                e.exports.resetUIState()
            },
            resetUIState: function() {
                for (var t = document.getElementById("example-choice-list").querySelectorAll(".example-choice"), e = 0, r = t.length; e < r; e++)
                    t[e].classList.remove("selected")
            }
        }
    }
    , {}],
    6: [function(t, e, r) {
        var n = t("./clippy")
          , i = t("./css-editor-utils");
        function o(t) {
            "use strict";
            var e = window.getSelection().getRangeAt(0);
            t.preventDefault(),
            t.stopPropagation(),
            t.clipboardData.setData("text/plain", e.toString()),
            t.clipboardData.setData("text/html", e.toString())
        }
        function s(t) {
            "use strict";
            var e = t.clipboardData.getData("text/plain")
              , r = t.target.offsetParent.querySelector("code")
              , n = r.textContent;
            t.preventDefault(),
            t.stopPropagation(),
            r.innerText = n + "\n" + e,
            Prism.highlightElement(r)
        }
        function a() {
            e.exports.onChoose(this)
        }
        e.exports = {
            onChoose: function(t) {
                var e = document.querySelector(".selected");
                if (e && !t.classList.contains("selected")) {
                    var r = Prism.highlight(e.firstChild.textContent, Prism.languages.css);
                    e.firstChild.innerHTML = r,
                    i.resetDefault()
                }
                i.choose(t),
                n.toggleClippy(t)
            },
            register: function() {
                "use strict";
                var t = document.getElementById("example-choice-list");
                !function() {
                    window.onerror = function(t, e, r, n, i) {
                        ["URL: " + e, "Line: " + r, "Column: " + n, "Error object: " + JSON.stringify(i)].join(" - ")
                    }
                }(),
                function() {
                    window.addEventListener("message", function(t) {
                        if (void 0 !== t.data.smallViewport) {
                            var e = document.querySelector(".editor-wrapper");
                            t.data.smallViewport ? e.classList.add("small-desktop-and-below") : e.classList.remove("small-desktop-and-below")
                        }
                        void 0 !== t.data.theme && document.querySelector("body").classList.add(t.data.theme)
                    }, !1)
                }(),
                t && function(t) {
                    t.addEventListener("cut", o),
                    t.addEventListener("copy", o),
                    t.addEventListener("paste", s),
                    t.addEventListener("keyup", function(t) {
                        var e = t.target.parentElement;
                        i.applyCode(e.textContent, e)
                    });
                    var e = t.querySelectorAll(".example-choice");
                    Array.from(e).forEach(t=>{
                        t.addEventListener("click", a)
                    }
                    )
                }(t)
            }
        }
    }
    , {
        "./clippy": 2,
        "./css-editor-utils": 5
    }],
    7: [function(t, e, r) {
        e.exports = {
            isDefined: function(t) {
                "use strict";
                return void 0 === t || void 0 !== function(t) {
                    var e = void 0;
                    switch (t) {
                    case "array-entries":
                        e = Array.prototype.entries;
                        break;
                    case "shared-array-buffer":
                        e = window.SharedArrayBuffer
                    }
                    return e
                }(t)
            }
        }
    }
    , {}],
    8: [function(t, e, r) {
        e.exports = {
            findParentChoiceElem: function(t) {
                "use strict";
                for (var e = t.parentElement, r = e.classList; e && !r.contains("example-choice"); )
                    r = (e = e.parentElement).classList;
                return e
            },
            isPropertySupported: function(t) {
                "use strict";
                if (void 0 === t.property)
                    return !0;
                for (var e = t.property.split(" "), r = !1, n = document.createElement("div"), i = 0, o = e.length; i < o; i++)
                    void 0 !== n.style[e[i]] && (r = !0);
                return r
            },
            openLinksInNewTab: function(t) {
                t.forEach(function(t) {
                    t.addEventListener("click", function(e) {
                        e.preventDefault(),
                        window.open(t.href)
                    })
                })
            },
            scrollToAnchors: function(t, e) {
                e.forEach(function(e) {
                    e.addEventListener("click", function(r) {
                        r.preventDefault(),
                        t.querySelector(e.hash).scrollIntoView()
                    })
                })
            },
            showCustomExampleHTML: function(t) {
                "use strict";
                var e = document.getElementById("default-example");
                e.classList.add("hidden"),
                e.setAttribute("aria-hidden", !0),
                t.classList.remove("hidden"),
                t.setAttribute("aria-hidden", !1)
            }
        }
    }
    , {}]
}, {}, [1]);
