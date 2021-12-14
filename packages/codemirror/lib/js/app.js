(()=>{"use strict";var e,r={590:(e,r,t)=>{var n=t(631),o=t.n(n);t(876);function i(){const e=document.querySelector("#live"),r=document.querySelector("#editor"),t=document.querySelector("#execute"),n=document.querySelector("#reset"),o=document.querySelector("#console"),a=document.querySelector("#console code"),c=self.frameElement;if(![e,r,t,n,o,a].every((e=>!!e)))throw new Error("[CodeMirror init]: init el err!");i=()=>({liveEl:e,editorEl:r,executeEl:t,resetEl:n,consoleEl:o,consoleCodeEl:a,iframeEl:c})}function a(e){for(var r="",t=0,n=e.length;t<n;t++)"string"==typeof e[t]?r+='"'+e[t]+'"':Array.isArray(e[t])?(r+="Array [",r+=a(e[t]),r+="]"):r+=c(e[t]),t<e.length-1&&(r+=", ");return r}function c(e){return null==e||"boolean"==typeof e?String(e):"number"==typeof e?Object.is(e,-0)?"-0":String(e):"bigint"==typeof e?String(e)+"n":"string"==typeof e?e.includes('"')?"'"+e+"'":'"'+e+'"':Array.isArray(e)?"Array ["+a(e)+"]":function(e){var r=e.constructor?e.constructor.name:e;if("String"===r)return`String { "${e.valueOf()}" }`;if(e===JSON)return"JSON {}";if(r.match&&r.match(/^(ArrayBuffer|SharedArrayBuffer|DataView)$/))return r+" {}";if(r.match&&r.match(/^(Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array|Float64Array|BigInt64Array|BigUint64Array)$/))return e.length>0?r+" ["+a(e)+"]":r+" []";if("Symbol"===r&&void 0!==e)return e.toString();if("Object"===r){var t="",n=!0;for(var o in e)e.hasOwnProperty(o)&&(n?n=!1:t+=", ",t=t+o+": "+c(e[o]));return r+" { "+t+" }"}if(!r.constructor||!r.prototype){for(var o in t="",n=!0,e)n?n=!1:t+=", ",t=t+o+": "+c(e[o]);return"Object { "+t+" }"}return e}(e)}function l(e){const{consoleCodeEl:r}=i(),t=r.textContent,n=`> ${e}\n`;r.textContent=t+n}let u=null;function s(){const{iframeEl:e}=i(),r=new URL(window.location.href),t=new URLSearchParams(r.search);let n="",o="console.log('hola CodeMirror');";var a;e&&(e.getAttribute("title")&&(n=e.getAttribute("title")),e.textContent&&(o=e.textContent.trim().replaceAll("&gt;",">"))),!n&&(n=t.get("title")),n&&function(e){const{liveEl:r}=i();r.querySelector("header h4").innerHTML=e}(n),a=o,u&&u.setValue(a)}i(),function(){const e=console.log,r=console.error;console.error=function(e){l(e),r.apply(console,arguments)},console.log=function(...r){l(r.map((e=>c(e))).join(" ")),e.apply(console,r)}}(),function(){const{editorEl:e}=i();return new Promise((r=>{setTimeout((()=>{u=o().fromTextArea(e,{mode:"javascript",tabSize:2,lineNumbers:!0,lineWrapping:!0,undoDepth:5,tabindex:0}),r()}),0)}))}().then((()=>{!function(){const{executeEl:e,resetEl:r,consoleCodeEl:t}=i();e.addEventListener("click",(function(){t.textContent="";const e=u.getDoc().getValue();t.classList.add("fade-in");try{new Function(e)()}catch(e){t.textContent="Error: "+e.message}t.addEventListener("animationend",(function(){t.classList.remove("fade-in")}),!1)}),!1),r.addEventListener("click",(function(){window.location.reload()}),!1)}(),s()}))}},t={};function n(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return r[e].call(i.exports,i,i.exports,n),i.exports}n.m=r,e=[],n.O=(r,t,o,i)=>{if(!t){var a=1/0;for(s=0;s<e.length;s++){for(var[t,o,i]=e[s],c=!0,l=0;l<t.length;l++)(!1&i||a>=i)&&Object.keys(n.O).every((e=>n.O[e](t[l])))?t.splice(l--,1):(c=!1,i<a&&(a=i));if(c){e.splice(s--,1);var u=o();void 0!==u&&(r=u)}}return r}i=i||0;for(var s=e.length;s>0&&e[s-1][2]>i;s--)e[s]=e[s-1];e[s]=[t,o,i]},n.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return n.d(r,{a:r}),r},n.d=(e,r)=>{for(var t in r)n.o(r,t)&&!n.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},n.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),(()=>{var e={143:0};n.O.j=r=>0===e[r];var r=(r,t)=>{var o,i,[a,c,l]=t,u=0;if(a.some((r=>0!==e[r]))){for(o in c)n.o(c,o)&&(n.m[o]=c[o]);if(l)var s=l(n)}for(r&&r(t);u<a.length;u++)i=a[u],n.o(e,i)&&e[i]&&e[i][0](),e[a[u]]=0;return n.O(s)},t=self.webpackChunk_jico_codemirror=self.webpackChunk_jico_codemirror||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})();var o=n.O(void 0,[216],(()=>n(590)));o=n.O(o)})();