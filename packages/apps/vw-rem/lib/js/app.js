(()=>{"use strict";var t={951:(t,n)=>{var e,a,i,d,o,r,c,u=function(t,n){if(!t)return!1;var e=t.match(new RegExp("".concat(n,"=([\\d\\.]+)"),"i"));return!!e&&Math.abs(parseInt(e[1]))};function h(){var t=document.querySelector('meta[name="vw-rem"]'),n=null==t?void 0:t.getAttribute("content");return{baseCell:u(n,"base-cell")||10,uiWidth:u(n,"ui-width")||375,minWidth:u(n,"min-width")||320,maxWidth:u(n,"max-width")||540}}e=h(),a=e.uiWidth,i=e.baseCell,d=e.minWidth,o=e.maxWidth,r=a/i,(c=document.createElement("style")).appendChild(document.createTextNode("\n    html {\n      font-size: ".concat(r,"px;\n    }\n    body {\n      max-width: ").concat(i,"rem;\n      margin: 0 auto;\n    }\n    @media screen and (max-width: ").concat(d,"px) {\n      html {\n        font-size: ").concat(r*d/a,"px;\n      }\n    }\n    @media screen and (min-width: ").concat(o,"px) {\n      html {\n        font-size: ").concat(r*o/a,"px;\n      }\n    }\n  "))),document.head.appendChild(c)}},n={};function e(a){var i=n[a];if(void 0!==i)return i.exports;var d=n[a]={exports:{}};return t[a](d,d.exports,e),d.exports}(()=>{e(951);document.body.innerHTML+='\n  <hr></hr>\n  <button data-width="320px">width 320</button>\n  <button data-width="375px">width 375</button>\n  <button data-width="540px">width 540</button>\n  <button data-width="100%">width 100%</button>\n',document.querySelector("body").addEventListener("click",(function(t){self.frameElement&&(self.frameElement.style.width="".concat(t.target.getAttribute("data-width")))}),!1)})()})();