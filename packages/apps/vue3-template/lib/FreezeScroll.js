"use strict";(self.webpackChunk_jico_vue3_template=self.webpackChunk_jico_vue3_template||[]).push([[332],{5022:(e,t)=>{var n=function(){function e(e){void 0===e&&(e=document.body),this._scrollTop=0,this._originalStyles="",this._freezeStatus=!1,this._el=e}return e.prototype._resetStyles=function(){this._originalStyles?this._el.setAttribute("style",this._originalStyles):this._el.removeAttribute("style")},Object.defineProperty(e.prototype,"freezeStatus",{get:function(){return this._freezeStatus},enumerable:!1,configurable:!0}),e.prototype.enable=function(){this._originalStyles=this._el.getAttribute("style"),this._el.style.position="fixed",this._el.style.overflow="hidden",this._freezeStatus=!0},e.prototype.disable=function(){this._resetStyles(),this._freezeStatus=!1},e}();t.Z=n},9022:(e,t)=>{t.MV=void 0;var n=function(){function e(e){void 0===e&&(e=document.body),this._dataAttrKey="data-prevent-scroll",this._passiveSupported=!1,this._preventStatus=!1,this._checkPassive(),!this._passiveSupported&&["[object HTMLBodyElement]","[object HTMLDocument]","[object Window]"].includes(Object.prototype.toString.call(e))&&(null===console||void 0===console||console.warn("[preventScroll]: take no effect cause passive is not supported!")),this._el=e}return e.prototype._checkPassive=function(){var e=this;try{window.addEventListener("__passive_check__",null,Object.create({get passive(){return e._passiveSupported=!0,!0},once:!0}))}catch(e){}},e.prototype._catchViewScrolling=function(e){e?this._el.addEventListener("touchmove",this._preventScrolling,!!this._passiveSupported&&{passive:!1}):this._el.removeEventListener("touchmove",this._preventScrolling,!!this._passiveSupported&&{passive:!1})},e.prototype._preventScrolling=function(e){e.preventDefault()},Object.defineProperty(e.prototype,"canPrevent",{get:function(){return this._passiveSupported},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"preventStatus",{get:function(){return this._preventStatus},enumerable:!1,configurable:!0}),e.prototype.enable=function(){this._el.setAttribute(this._dataAttrKey,"true"),this._catchViewScrolling(!0),this._preventStatus=!0},e.prototype.disable=function(){this._el.removeAttribute(this._dataAttrKey),this._catchViewScrolling(!1),this._preventStatus=!1},e}();t.MV=new n},1466:(e,t,n)=>{n.r(t),n.d(t,{default:()=>v});var r=n(5455),i=n(7333),o={class:"container"},s={class:"outer-wrap",ref:"scrollWrap"},l={class:"inner-wrap"};var a=n(3708),u=n(9022),c=n(5022);const p={name:"Index",data:function(){return{}},setup:function(){var e=(0,r.f3)("t"),t=(0,a.iH)(u.MV.preventStatus),n=(0,a.iH)(null),i=(0,a.iH)({}),o=(0,a.iH)(!1);return(0,r.Y3)((function(){i.value=new c.Z(n.value),o.value=i.value.freezeStatus})),{t:e,preventStatus:t,freezeStatus:o,scrollWrap:n,togglePrevent:function(){u.MV.preventStatus?u.MV.disable():u.MV.enable(),o.value=u.MV.preventStatus},toggleFreeze:function(){i.value.freezeStatus?i.value.disable():i.value.enable()}}},methods:{}};const v=(0,n(3744).Z)(p,[["render",function(e,t,n,a){return(0,r.wg)(),(0,r.iD)("div",o,[(0,r._)("button",{onClick:t[0]||(t[0]=function(){return a.togglePrevent&&a.togglePrevent.apply(a,arguments)})},"toggle prevent: "+(0,i.toDisplayString)(a.freezeStatus),1),(0,r._)("button",{onClick:t[1]||(t[1]=function(){return a.toggleFreeze&&a.toggleFreeze.apply(a,arguments)})},"toggle freeze: "+(0,i.toDisplayString)(a.freezeStatus),1),(0,r._)("div",s,[(0,r._)("div",l,[((0,r.wg)(),(0,r.iD)(r.HY,null,(0,r.Ko)(20,(function(e){return(0,r._)("p",null,(0,i.toDisplayString)(e),1)})),64))])],512)])}]])}}]);