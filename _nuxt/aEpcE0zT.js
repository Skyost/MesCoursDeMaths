import{M as we,t as Re,r as De,o as Ze,N as ct,O as q,P as ft,Q as vt,e as C,I as bt,R as pt,S as yt,T as ht,U as mt,g as u,V as gt,d as Ye,m as Xe,b as E,c as J,W as Qe,y as kt,X as wt,Y as Tt,Z as St,$ as Ct,a0 as Ft,a1 as $e,a2 as Bt,a3 as Nt,a4 as Et,a5 as ie,a6 as At,a7 as Rt,a8 as pe,i as j,w as z,a9 as Me,z as H,aa as _e,a as ye,ab as Dt,n as G,s as O,ac as x,ad as X,v as It,E as he,A as me,F as Vt,k as P,f as Pt,ae as Ke,af as Ot,ag as xt}from"./DMOaezB_.js";import{i as Lt,_ as Be}from"./jCVBOyiR.js";import{a as Ne}from"./P1YHraTj.js";function $t(r){return ht()?(mt(r),!0):!1}function Ie(r){return typeof r=="function"?r():u(r)}typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const Mt=r=>r!=null;function _t(r){var e;const t=Ie(r);return(e=t==null?void 0:t.$el)!=null?e:t}/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var Je=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"],Te=Je.join(","),et=typeof Element>"u",Z=et?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Se=!et&&Element.prototype.getRootNode?function(r){var e;return r==null||(e=r.getRootNode)===null||e===void 0?void 0:e.call(r)}:function(r){return r==null?void 0:r.ownerDocument},Ce=function r(e,t){var n;t===void 0&&(t=!0);var a=e==null||(n=e.getAttribute)===null||n===void 0?void 0:n.call(e,"inert"),s=a===""||a==="true",o=s||t&&e&&r(e.parentNode);return o},Kt=function(e){var t,n=e==null||(t=e.getAttribute)===null||t===void 0?void 0:t.call(e,"contenteditable");return n===""||n==="true"},tt=function(e,t,n){if(Ce(e))return[];var a=Array.prototype.slice.apply(e.querySelectorAll(Te));return t&&Z.call(e,Te)&&a.unshift(e),a=a.filter(n),a},at=function r(e,t,n){for(var a=[],s=Array.from(e);s.length;){var o=s.shift();if(!Ce(o,!1))if(o.tagName==="SLOT"){var f=o.assignedElements(),c=f.length?f:o.children,v=r(c,!0,n);n.flatten?a.push.apply(a,v):a.push({scopeParent:o,candidates:v})}else{var p=Z.call(o,Te);p&&n.filter(o)&&(t||!e.includes(o))&&a.push(o);var y=o.shadowRoot||typeof n.getShadowRoot=="function"&&n.getShadowRoot(o),h=!Ce(y,!1)&&(!n.shadowRootFilter||n.shadowRootFilter(o));if(y&&h){var I=r(y===!0?o.children:y.children,!0,n);n.flatten?a.push.apply(a,I):a.push({scopeParent:o,candidates:I})}else s.unshift.apply(s,o.children)}}return a},nt=function(e){return!isNaN(parseInt(e.getAttribute("tabindex"),10))},W=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||Kt(e))&&!nt(e)?0:e.tabIndex},jt=function(e,t){var n=W(e);return n<0&&t&&!nt(e)?0:n},zt=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},rt=function(e){return e.tagName==="INPUT"},Ht=function(e){return rt(e)&&e.type==="hidden"},Gt=function(e){var t=e.tagName==="DETAILS"&&Array.prototype.slice.apply(e.children).some(function(n){return n.tagName==="SUMMARY"});return t},Ut=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]},Wt=function(e){if(!e.name)return!0;var t=e.form||Se(e),n=function(f){return t.querySelectorAll('input[type="radio"][name="'+f+'"]')},a;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")a=n(window.CSS.escape(e.name));else try{a=n(e.name)}catch(o){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",o.message),!1}var s=Ut(a,e.form);return!s||s===e},qt=function(e){return rt(e)&&e.type==="radio"},Zt=function(e){return qt(e)&&!Wt(e)},Yt=function(e){var t,n=e&&Se(e),a=(t=n)===null||t===void 0?void 0:t.host,s=!1;if(n&&n!==e){var o,f,c;for(s=!!((o=a)!==null&&o!==void 0&&(f=o.ownerDocument)!==null&&f!==void 0&&f.contains(a)||e!=null&&(c=e.ownerDocument)!==null&&c!==void 0&&c.contains(e));!s&&a;){var v,p,y;n=Se(a),a=(v=n)===null||v===void 0?void 0:v.host,s=!!((p=a)!==null&&p!==void 0&&(y=p.ownerDocument)!==null&&y!==void 0&&y.contains(a))}}return s},je=function(e){var t=e.getBoundingClientRect(),n=t.width,a=t.height;return n===0&&a===0},Xt=function(e,t){var n=t.displayCheck,a=t.getShadowRoot;if(getComputedStyle(e).visibility==="hidden")return!0;var s=Z.call(e,"details>summary:first-of-type"),o=s?e.parentElement:e;if(Z.call(o,"details:not([open]) *"))return!0;if(!n||n==="full"||n==="legacy-full"){if(typeof a=="function"){for(var f=e;e;){var c=e.parentElement,v=Se(e);if(c&&!c.shadowRoot&&a(c)===!0)return je(e);e.assignedSlot?e=e.assignedSlot:!c&&v!==e.ownerDocument?e=v.host:e=c}e=f}if(Yt(e))return!e.getClientRects().length;if(n!=="legacy-full")return!0}else if(n==="non-zero-area")return je(e);return!1},Qt=function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if(t.tagName==="FIELDSET"&&t.disabled){for(var n=0;n<t.children.length;n++){var a=t.children.item(n);if(a.tagName==="LEGEND")return Z.call(t,"fieldset[disabled] *")?!0:!a.contains(e)}return!0}t=t.parentElement}return!1},Fe=function(e,t){return!(t.disabled||Ce(t)||Ht(t)||Xt(t,e)||Gt(t)||Qt(t))},Ve=function(e,t){return!(Zt(t)||W(t)<0||!Fe(e,t))},Jt=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return!!(isNaN(t)||t>=0)},ea=function r(e){var t=[],n=[];return e.forEach(function(a,s){var o=!!a.scopeParent,f=o?a.scopeParent:a,c=jt(f,o),v=o?r(a.candidates):f;c===0?o?t.push.apply(t,v):t.push(f):n.push({documentOrder:s,tabIndex:c,item:a,isScope:o,content:v})}),n.sort(zt).reduce(function(a,s){return s.isScope?a.push.apply(a,s.content):a.push(s.content),a},[]).concat(t)},ta=function(e,t){t=t||{};var n;return t.getShadowRoot?n=at([e],t.includeContainer,{filter:Ve.bind(null,t),flatten:!1,getShadowRoot:t.getShadowRoot,shadowRootFilter:Jt}):n=tt(e,t.includeContainer,Ve.bind(null,t)),ea(n)},aa=function(e,t){t=t||{};var n;return t.getShadowRoot?n=at([e],t.includeContainer,{filter:Fe.bind(null,t),flatten:!0,getShadowRoot:t.getShadowRoot}):n=tt(e,t.includeContainer,Fe.bind(null,t)),n},Q=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return Z.call(e,Te)===!1?!1:Ve(t,e)},na=Je.concat("iframe").join(","),Ee=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return Z.call(e,na)===!1?!1:Fe(t,e)};/*!
* focus-trap 7.6.2
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/function Pe(r,e){(e==null||e>r.length)&&(e=r.length);for(var t=0,n=Array(e);t<e;t++)n[t]=r[t];return n}function ra(r){if(Array.isArray(r))return Pe(r)}function oa(r,e,t){return(e=da(e))in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}function ia(r){if(typeof Symbol<"u"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}function la(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ze(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);e&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(r,a).enumerable})),t.push.apply(t,n)}return t}function He(r){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?ze(Object(t),!0).forEach(function(n){oa(r,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):ze(Object(t)).forEach(function(n){Object.defineProperty(r,n,Object.getOwnPropertyDescriptor(t,n))})}return r}function sa(r){return ra(r)||ia(r)||ca(r)||la()}function ua(r,e){if(typeof r!="object"||!r)return r;var t=r[Symbol.toPrimitive];if(t!==void 0){var n=t.call(r,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(r)}function da(r){var e=ua(r,"string");return typeof e=="symbol"?e:e+""}function ca(r,e){if(r){if(typeof r=="string")return Pe(r,e);var t={}.toString.call(r).slice(8,-1);return t==="Object"&&r.constructor&&(t=r.constructor.name),t==="Map"||t==="Set"?Array.from(r):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?Pe(r,e):void 0}}var Ge={activateTrap:function(e,t){if(e.length>0){var n=e[e.length-1];n!==t&&n.pause()}var a=e.indexOf(t);a===-1||e.splice(a,1),e.push(t)},deactivateTrap:function(e,t){var n=e.indexOf(t);n!==-1&&e.splice(n,1),e.length>0&&e[e.length-1].unpause()}},fa=function(e){return e.tagName&&e.tagName.toLowerCase()==="input"&&typeof e.select=="function"},va=function(e){return(e==null?void 0:e.key)==="Escape"||(e==null?void 0:e.key)==="Esc"||(e==null?void 0:e.keyCode)===27},se=function(e){return(e==null?void 0:e.key)==="Tab"||(e==null?void 0:e.keyCode)===9},ba=function(e){return se(e)&&!e.shiftKey},pa=function(e){return se(e)&&e.shiftKey},Ue=function(e){return setTimeout(e,0)},le=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return typeof e=="function"?e.apply(void 0,n):e},ge=function(e){return e.target.shadowRoot&&typeof e.composedPath=="function"?e.composedPath()[0]:e.target},ya=[],ha=function(e,t){var n=(t==null?void 0:t.document)||document,a=(t==null?void 0:t.trapStack)||ya,s=He({returnFocusOnDeactivate:!0,escapeDeactivates:!0,delayInitialFocus:!0,isKeyForward:ba,isKeyBackward:pa},t),o={containers:[],containerGroups:[],tabbableGroups:[],nodeFocusedBeforeActivation:null,mostRecentlyFocusedNode:null,active:!1,paused:!1,delayInitialFocusTimer:void 0,recentNavEvent:void 0},f,c=function(i,l,d){return i&&i[l]!==void 0?i[l]:s[d||l]},v=function(i,l){var d=typeof(l==null?void 0:l.composedPath)=="function"?l.composedPath():void 0;return o.containerGroups.findIndex(function(m){var g=m.container,w=m.tabbableNodes;return g.contains(i)||(d==null?void 0:d.includes(g))||w.find(function(b){return b===i})})},p=function(i){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},d=l.hasFallback,m=d===void 0?!1:d,g=l.params,w=g===void 0?[]:g,b=s[i];if(typeof b=="function"&&(b=b.apply(void 0,sa(w))),b===!0&&(b=void 0),!b){if(b===void 0||b===!1)return b;throw new Error("`".concat(i,"` was specified but was not a node, or did not return a node"))}var T=b;if(typeof b=="string"){try{T=n.querySelector(b)}catch(S){throw new Error("`".concat(i,'` appears to be an invalid selector; error="').concat(S.message,'"'))}if(!T&&!m)throw new Error("`".concat(i,"` as selector refers to no known node"))}return T},y=function(){var i=p("initialFocus",{hasFallback:!0});if(i===!1)return!1;if(i===void 0||i&&!Ee(i,s.tabbableOptions))if(v(n.activeElement)>=0)i=n.activeElement;else{var l=o.tabbableGroups[0],d=l&&l.firstTabbableNode;i=d||p("fallbackFocus")}else i===null&&(i=p("fallbackFocus"));if(!i)throw new Error("Your focus-trap needs to have at least one focusable element");return i},h=function(){if(o.containerGroups=o.containers.map(function(i){var l=ta(i,s.tabbableOptions),d=aa(i,s.tabbableOptions),m=l.length>0?l[0]:void 0,g=l.length>0?l[l.length-1]:void 0,w=d.find(function(S){return Q(S)}),b=d.slice().reverse().find(function(S){return Q(S)}),T=!!l.find(function(S){return W(S)>0});return{container:i,tabbableNodes:l,focusableNodes:d,posTabIndexesFound:T,firstTabbableNode:m,lastTabbableNode:g,firstDomTabbableNode:w,lastDomTabbableNode:b,nextTabbableNode:function(V){var M=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0,D=l.indexOf(V);return D<0?M?d.slice(d.indexOf(V)+1).find(function(_){return Q(_)}):d.slice(0,d.indexOf(V)).reverse().find(function(_){return Q(_)}):l[D+(M?1:-1)]}}}),o.tabbableGroups=o.containerGroups.filter(function(i){return i.tabbableNodes.length>0}),o.tabbableGroups.length<=0&&!p("fallbackFocus"))throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");if(o.containerGroups.find(function(i){return i.posTabIndexesFound})&&o.containerGroups.length>1)throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.")},I=function(i){var l=i.activeElement;if(l)return l.shadowRoot&&l.shadowRoot.activeElement!==null?I(l.shadowRoot):l},B=function(i){if(i!==!1&&i!==I(document)){if(!i||!i.focus){B(y());return}i.focus({preventScroll:!!s.preventScroll}),o.mostRecentlyFocusedNode=i,fa(i)&&i.select()}},ee=function(i){var l=p("setReturnFocus",{params:[i]});return l||(l===!1?!1:i)},A=function(i){var l=i.target,d=i.event,m=i.isBackward,g=m===void 0?!1:m;l=l||ge(d),h();var w=null;if(o.tabbableGroups.length>0){var b=v(l,d),T=b>=0?o.containerGroups[b]:void 0;if(b<0)g?w=o.tabbableGroups[o.tabbableGroups.length-1].lastTabbableNode:w=o.tabbableGroups[0].firstTabbableNode;else if(g){var S=o.tabbableGroups.findIndex(function(ne){var re=ne.firstTabbableNode;return l===re});if(S<0&&(T.container===l||Ee(l,s.tabbableOptions)&&!Q(l,s.tabbableOptions)&&!T.nextTabbableNode(l,!1))&&(S=b),S>=0){var V=S===0?o.tabbableGroups.length-1:S-1,M=o.tabbableGroups[V];w=W(l)>=0?M.lastTabbableNode:M.lastDomTabbableNode}else se(d)||(w=T.nextTabbableNode(l,!1))}else{var D=o.tabbableGroups.findIndex(function(ne){var re=ne.lastTabbableNode;return l===re});if(D<0&&(T.container===l||Ee(l,s.tabbableOptions)&&!Q(l,s.tabbableOptions)&&!T.nextTabbableNode(l))&&(D=b),D>=0){var _=D===o.tabbableGroups.length-1?0:D+1,ae=o.tabbableGroups[_];w=W(l)>=0?ae.firstTabbableNode:ae.firstDomTabbableNode}else se(d)||(w=T.nextTabbableNode(l))}}else w=p("fallbackFocus");return w},Y=function(i){var l=ge(i);if(!(v(l,i)>=0)){if(le(s.clickOutsideDeactivates,i)){f.deactivate({returnFocus:s.returnFocusOnDeactivate});return}le(s.allowOutsideClick,i)||i.preventDefault()}},ue=function(i){var l=ge(i),d=v(l,i)>=0;if(d||l instanceof Document)d&&(o.mostRecentlyFocusedNode=l);else{i.stopImmediatePropagation();var m,g=!0;if(o.mostRecentlyFocusedNode)if(W(o.mostRecentlyFocusedNode)>0){var w=v(o.mostRecentlyFocusedNode),b=o.containerGroups[w].tabbableNodes;if(b.length>0){var T=b.findIndex(function(S){return S===o.mostRecentlyFocusedNode});T>=0&&(s.isKeyForward(o.recentNavEvent)?T+1<b.length&&(m=b[T+1],g=!1):T-1>=0&&(m=b[T-1],g=!1))}}else o.containerGroups.some(function(S){return S.tabbableNodes.some(function(V){return W(V)>0})})||(g=!1);else g=!1;g&&(m=A({target:o.mostRecentlyFocusedNode,isBackward:s.isKeyBackward(o.recentNavEvent)})),B(m||o.mostRecentlyFocusedNode||y())}o.recentNavEvent=void 0},F=function(i){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;o.recentNavEvent=i;var d=A({event:i,isBackward:l});d&&(se(i)&&i.preventDefault(),B(d))},de=function(i){(s.isKeyForward(i)||s.isKeyBackward(i))&&F(i,s.isKeyBackward(i))},ce=function(i){va(i)&&le(s.escapeDeactivates,i)!==!1&&(i.preventDefault(),f.deactivate())},L=function(i){var l=ge(i);v(l,i)>=0||le(s.clickOutsideDeactivates,i)||le(s.allowOutsideClick,i)||(i.preventDefault(),i.stopImmediatePropagation())},fe=function(){if(o.active)return Ge.activateTrap(a,f),o.delayInitialFocusTimer=s.delayInitialFocus?Ue(function(){B(y())}):B(y()),n.addEventListener("focusin",ue,!0),n.addEventListener("mousedown",Y,{capture:!0,passive:!1}),n.addEventListener("touchstart",Y,{capture:!0,passive:!1}),n.addEventListener("click",L,{capture:!0,passive:!1}),n.addEventListener("keydown",de,{capture:!0,passive:!1}),n.addEventListener("keydown",ce),f},ve=function(){if(o.active)return n.removeEventListener("focusin",ue,!0),n.removeEventListener("mousedown",Y,!0),n.removeEventListener("touchstart",Y,!0),n.removeEventListener("click",L,!0),n.removeEventListener("keydown",de,!0),n.removeEventListener("keydown",ce),f},be=function(i){var l=i.some(function(d){var m=Array.from(d.removedNodes);return m.some(function(g){return g===o.mostRecentlyFocusedNode})});l&&B(y())},te=typeof window<"u"&&"MutationObserver"in window?new MutationObserver(be):void 0,$=function(){te&&(te.disconnect(),o.active&&!o.paused&&o.containers.map(function(i){te.observe(i,{subtree:!0,childList:!0})}))};return f={get active(){return o.active},get paused(){return o.paused},activate:function(i){if(o.active)return this;var l=c(i,"onActivate"),d=c(i,"onPostActivate"),m=c(i,"checkCanFocusTrap");m||h(),o.active=!0,o.paused=!1,o.nodeFocusedBeforeActivation=n.activeElement,l==null||l();var g=function(){m&&h(),fe(),$(),d==null||d()};return m?(m(o.containers.concat()).then(g,g),this):(g(),this)},deactivate:function(i){if(!o.active)return this;var l=He({onDeactivate:s.onDeactivate,onPostDeactivate:s.onPostDeactivate,checkCanReturnFocus:s.checkCanReturnFocus},i);clearTimeout(o.delayInitialFocusTimer),o.delayInitialFocusTimer=void 0,ve(),o.active=!1,o.paused=!1,$(),Ge.deactivateTrap(a,f);var d=c(l,"onDeactivate"),m=c(l,"onPostDeactivate"),g=c(l,"checkCanReturnFocus"),w=c(l,"returnFocus","returnFocusOnDeactivate");d==null||d();var b=function(){Ue(function(){w&&B(ee(o.nodeFocusedBeforeActivation)),m==null||m()})};return w&&g?(g(ee(o.nodeFocusedBeforeActivation)).then(b,b),this):(b(),this)},pause:function(i){if(o.paused||!o.active)return this;var l=c(i,"onPause"),d=c(i,"onPostPause");return o.paused=!0,l==null||l(),ve(),$(),d==null||d(),this},unpause:function(i){if(!o.paused||!o.active)return this;var l=c(i,"onUnpause"),d=c(i,"onPostUnpause");return o.paused=!1,l==null||l(),h(),fe(),$(),d==null||d(),this},updateContainerElements:function(i){var l=[].concat(i).filter(Boolean);return o.containers=l.map(function(d){return typeof d=="string"?n.querySelector(d):d}),o.active&&h(),$(),this}},f.updateContainerElements(e),f};function ma(r,e={}){let t;const{immediate:n,...a}=e,s=De(!1),o=De(!1),f=h=>t&&t.activate(h),c=h=>t&&t.deactivate(h),v=()=>{t&&(t.pause(),o.value=!0)},p=()=>{t&&(t.unpause(),o.value=!1)},y=C(()=>{const h=Ie(r);return(Array.isArray(h)?h:[h]).map(I=>{const B=Ie(I);return typeof B=="string"?B:_t(B)}).filter(Mt)});return q(y,h=>{h.length&&(t=ha(h,{...a,onActivate(){s.value=!0,e.onActivate&&e.onActivate()},onDeactivate(){s.value=!1,e.onDeactivate&&e.onDeactivate()}}),n&&f())},{flush:"post"}),$t(()=>c()),{hasFocus:s,isPaused:o,activate:f,deactivate:c,pause:v,unpause:p}}const ga=({element:r,isActive:e,noTrap:t,fallbackFocus:n},a={allowOutsideClick:!0,fallbackFocus:n.ref.value??void 0,escapeDeactivates:!1})=>{const s=we(Re(e)),o=we(Re(t)),f=()=>{var p;const y=(p=r.value)==null?void 0:p.querySelectorAll(`a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]):not(.${n.classSelector})`);return!y||y.length===0},c=De(f());Ze(()=>{ct(r,()=>{c.value=f()},{childList:!0,subtree:!0})});const v=ma(r,a);return q(s,async p=>{await ft(),p&&o.value===!1?v.activate():v.deactivate()}),q(o,p=>{p===!0&&v.deactivate()}),{needsFallback:we(c)}},ka=yt(gt);let ke="";const U=new Map,wa=(r,e)=>{const t=we(Re(r)),n=vt(),a=C(()=>!bt(e)),s=ka(typeof document<"u"?document.body:null,t.value&&a.value);Ze(()=>{typeof document>"u"||(U.set(n,!1),q([t,a],([o,f])=>{const c=window.innerWidth-document.documentElement.clientWidth,v=Array.from(U.values()).some(h=>h===!0),p=o&&f;U.set(n,p),p&&!v&&!s.value&&(s.value=!0,c>0&&(ke=document.body.style.paddingRight,document.body.style.paddingRight=`${c+ke}px`));const y=Array.from(U.values()).some(h=>h===!0);v&&!y&&(U.set(n,!1),s.value=!1,document.body.style.paddingRight=ke)},{immediate:!0}))}),pt(()=>{U.delete(n),Array.from(U.values()).some(f=>f===!0)||(document.body.style.paddingRight=ke,s.value=!1)})},Ta=["type","disabled","aria-label"],Sa=Ye({__name:"BCloseButton",props:{ariaLabel:{default:"Close"},disabled:{type:Boolean,default:!1},type:{default:"button"}},emits:["click"],setup(r,{emit:e}){const n=Xe(r,"BCloseButton"),a=e;return(s,o)=>(E(),J("button",{type:u(n).type,class:"btn-close",disabled:u(n).disabled,"aria-label":u(n).ariaLabel,onClick:o[0]||(o[0]=f=>a("click",f))},null,8,Ta))}}),Ae="modal-open",Ca=()=>{const r=kt(wt),e=n=>{r==null||r.removeStack(n),r==null||r.removeRegistry(n)},t=Tt("updateHTMLAttrs",(n,a,s)=>{const o=typeof n=="string"?window==null?void 0:window.document.querySelector(n):Ct(n);o&&(a==="class"?o.classList.toggle(Ae,s===Ae):o.setAttribute(a,s))});return Qe(()=>{t("body","class","")}),q(()=>r==null?void 0:r.countStack.value,n=>{n!==void 0&&t("body","class",n>0?Ae:"")}),{...r,dispose:e}},Fa=(r,e)=>{const{pushRegistry:t,pushStack:n,removeStack:a,stack:s,dispose:o,countStack:f}=Ca(),c=St();if(!c||c.type.__name!=="BModal")throw new Error("useModalManager must only use in BModal component");t==null||t(c),Qe(()=>{o(c)});const v=(p,y)=>{p?n==null||n(c):y&&!p&&(a==null||a(c))};return v(e,e),q(r,v),{activePosition:C(()=>s==null?void 0:s.value.findIndex(p=>{var y,h;return((y=p.exposed)==null?void 0:y.id)===((h=c.exposed)==null?void 0:h.id)})),activeModalCount:f,stackWithoutSelf:C(()=>(s==null?void 0:s.value.filter(p=>{var y,h;return((y=p.exposed)==null?void 0:y.id)!==((h=c.exposed)==null?void 0:h.id)}))??[])}},Ba=["id","aria-labelledby","aria-describedby"],Na=["id"],We="modal-fallback-focus",qe=1056,Ea=Ye({inheritAttrs:!1,__name:"BModal",props:$e({autofocus:{type:Boolean,default:!0},autofocusButton:{default:void 0},backdropFirst:{type:Boolean,default:!1},body:{default:void 0},bodyAttrs:{default:void 0},bodyBgVariant:{default:null},bodyClass:{default:null},bodyScrolling:{type:Boolean,default:!1},bodyTextVariant:{default:null},bodyVariant:{default:null},busy:{type:Boolean,default:!1},buttonSize:{default:"md"},cancelDisabled:{type:Boolean,default:!1},cancelTitle:{default:"Cancel"},cancelVariant:{default:"secondary"},centered:{type:Boolean,default:!1},contentClass:{default:void 0},dialogClass:{default:void 0},footerBgVariant:{default:null},footerBorderVariant:{default:null},footerClass:{default:void 0},footerTextVariant:{default:null},footerVariant:{default:null},fullscreen:{type:[Boolean,String],default:!1},headerBgVariant:{default:null},headerBorderVariant:{default:null},headerClass:{default:void 0},headerCloseClass:{default:void 0},headerCloseLabel:{default:"Close"},headerCloseVariant:{default:"secondary"},headerTextVariant:{default:null},headerVariant:{default:null},noBackdrop:{type:Boolean,default:!1},noFooter:{type:Boolean,default:!1},noHeader:{type:Boolean,default:!1},noHeaderClose:{type:Boolean,default:!1},id:{default:void 0},modalClass:{default:void 0},noCloseOnBackdrop:{type:Boolean,default:!1},noCloseOnEsc:{type:Boolean,default:!1},noTrap:{type:Boolean,default:!1},noStacking:{type:Boolean},okDisabled:{type:Boolean,default:!1},okOnly:{type:Boolean,default:!1},okTitle:{default:"OK"},okVariant:{default:"primary"},scrollable:{type:Boolean,default:!1},size:{default:"md"},title:{default:void 0},titleClass:{default:void 0},titleVisuallyHidden:{type:Boolean,default:!1},titleTag:{default:"h5"},teleportDisabled:{type:Boolean,default:!1},teleportTo:{default:"body"},initialAnimation:{type:Boolean,default:!1},noAnimation:{type:Boolean},noFade:{type:Boolean,default:!1},lazy:{type:Boolean,default:!1},unmountLazy:{type:Boolean,default:!1},show:{type:Boolean,default:!1},transProps:{default:void 0},visible:{type:Boolean,default:!1}},{modelValue:{type:Boolean,default:!1},modelModifiers:{}}),emits:$e(["backdrop","cancel","close","esc","ok","hide","hide-prevented","hidden","show","show-prevented","shown","toggle","toggle-prevented"],["update:modelValue"]),setup(r,{expose:e,emit:t}){const a=Xe(r,"BModal"),s=t,o=Bt(),f=Nt(()=>a.id,"modal"),c=Et(r,"modelValue"),v=ie("_element"),p=ie("_fallbackFocusElement"),y=ie("_okButton"),h=ie("_cancelButton"),I=ie("_closeButton"),B=()=>{a.autofocus!==!1&&(a.autofocusButton==="ok"?g.value=!0:a.autofocusButton==="close"?b.value=!0:a.autofocusButton==="cancel"?w.value=!0:m.value=!0)},ee=()=>{B()},{showRef:A,renderRef:Y,renderBackdropRef:ue,hide:F,show:de,toggle:ce,computedNoAnimation:L,transitionProps:fe,backdropTransitionProps:ve,isLeaving:be,isVisible:te,trapActive:$,contentShowing:k,backdropReady:i,backdropVisible:l}=At(c,a,s,v,f,{transitionProps:{onAfterEnter:ee}}),{needsFallback:d}=ga({element:v,isActive:$,noTrap:()=>a.noTrap,fallbackFocus:{ref:p,classSelector:We}});Rt("Escape",()=>{F("esc")},{target:v}),wa(A,()=>a.bodyScrolling);const{focused:m}=pe(v,{initialValue:c.value&&a.autofocusButton===void 0&&a.autofocus===!0}),{focused:g}=pe(y,{initialValue:c.value&&a.autofocusButton==="ok"&&a.autofocus===!0}),{focused:w}=pe(h,{initialValue:c.value&&a.autofocusButton==="cancel"&&a.autofocus===!0}),{focused:b}=pe(I,{initialValue:c.value&&a.autofocusButton==="close"&&a.autofocus===!0}),T=C(()=>!Lt(o["header-close"])),S=C(()=>[a.dialogClass,{"modal-fullscreen":a.fullscreen===!0,[`modal-fullscreen-${a.fullscreen}-down`]:typeof a.fullscreen=="string",[`modal-${a.size}`]:a.size!=="md","modal-dialog-centered":a.centered,"modal-dialog-scrollable":a.scrollable}]),V=Ne(()=>({bgVariant:a.bodyBgVariant,textVariant:a.bodyTextVariant,variant:a.bodyVariant})),M=C(()=>[a.bodyClass,V.value]),D=Ne(()=>({bgVariant:a.headerBgVariant,textVariant:a.headerTextVariant,variant:a.headerVariant,borderVariant:a.headerBorderVariant})),_=C(()=>[a.headerClass,D.value]),ae=C(()=>({variant:T.value?a.headerCloseVariant:void 0,class:a.headerCloseClass})),ne=Ne(()=>({bgVariant:a.footerBgVariant,textVariant:a.footerTextVariant,variant:a.footerVariant,borderVariant:a.footerBorderVariant})),re=C(()=>[a.footerClass,ne.value]),ot=C(()=>[a.titleClass,{"visually-hidden":a.titleVisuallyHidden}]),it=C(()=>a.cancelDisabled||a.busy),lt=C(()=>a.okDisabled||a.busy),{activePosition:Oe,activeModalCount:xe,stackWithoutSelf:st}=Fa(A,c.value);q(st,(R,N)=>{R.length>N.length&&A.value===!0&&a.noStacking===!0&&F()});const Le=C(()=>A.value||be.value?qe-(((xe==null?void 0:xe.value)??0)*2-((Oe==null?void 0:Oe.value)??0)*2):qe),ut=C(()=>({"z-index":Le.value})),dt=C(()=>({"z-index":Le.value-1})),K=C(()=>({cancel:()=>{F("cancel")},close:()=>{F("close")},hide:F,ok:()=>{F("ok")},active:A.value,visible:A.value}));return e({hide:F,id:f,show:de,toggle:ce}),(R,N)=>(E(),j(xt,{to:u(a).teleportTo,disabled:u(a).teleportDisabled},{default:z(()=>[u(Y)||u(k)?(E(),j(Me,H({key:0},u(fe),{appear:c.value||u(a).visible,onAfterEnter:ee}),{default:z(()=>[_e(ye("div",H({id:u(f),ref:"_element",class:["modal",[u(a).modalClass,{fade:!u(L),show:u(te)}]],role:"dialog","aria-labelledby":u(a).noHeader?void 0:`${u(f)}-label`,"aria-describedby":`${u(f)}-body`,tabindex:"-1"},R.$attrs,{style:ut.value,onClick:N[4]||(N[4]=Dt(oe=>u(F)("backdrop"),["self"]))}),[ye("div",{class:G(["modal-dialog",S.value])},[u(k)?(E(),J("div",{key:0,class:G(["modal-content",u(a).contentClass])},[u(a).noHeader?P("",!0):(E(),J("div",{key:0,class:G(["modal-header",_.value])},[O(R.$slots,"header",x(X(K.value)),()=>[(E(),j(It(u(a).titleTag),{id:`${u(f)}-label`,class:G(["modal-title",ot.value])},{default:z(()=>[O(R.$slots,"title",x(X(K.value)),()=>[he(me(u(a).title),1)],!0)]),_:3},8,["id","class"])),u(a).noHeaderClose?P("",!0):(E(),J(Vt,{key:0},[T.value?(E(),j(Be,H({key:0},ae.value,{onClick:N[0]||(N[0]=oe=>u(F)("close"))}),{default:z(()=>[O(R.$slots,"header-close",{},void 0,!0)]),_:3},16)):(E(),j(Sa,H({key:1,"aria-label":u(a).headerCloseLabel},ae.value,{onClick:N[1]||(N[1]=oe=>u(F)("close"))}),null,16,["aria-label"]))],64))],!0)],2)),ye("div",H({id:`${u(f)}-body`,class:["modal-body",M.value]},u(a).bodyAttrs),[O(R.$slots,"default",x(X(K.value)),()=>[he(me(u(a).body),1)],!0)],16,Na),u(a).noFooter?P("",!0):(E(),J("div",{key:1,class:G(["modal-footer",re.value])},[O(R.$slots,"footer",x(X(K.value)),()=>[O(R.$slots,"cancel",x(X(K.value)),()=>[u(a).okOnly?P("",!0):(E(),j(Be,{key:0,ref:"_cancelButton",disabled:it.value,size:u(a).buttonSize,variant:u(a).cancelVariant,onClick:N[2]||(N[2]=oe=>u(F)("cancel"))},{default:z(()=>[he(me(u(a).cancelTitle),1)]),_:1},8,["disabled","size","variant"]))],!0),O(R.$slots,"ok",x(X(K.value)),()=>[Pt(Be,{ref:"_okButton",disabled:lt.value,size:u(a).buttonSize,variant:u(a).okVariant,onClick:N[3]||(N[3]=oe=>u(F)("ok"))},{default:z(()=>[he(me(u(a).okTitle),1)]),_:1},8,["disabled","size","variant"])],!0)],!0)],2))],2)):P("",!0)],2),u(d)?(E(),J("div",{key:0,ref:"_fallbackFocusElement",class:G(We),tabindex:"0",style:{width:"0",height:"0",overflow:"hidden"}},null,512)):P("",!0)],16,Ba),[[Ke,u(A)&&(u(i)&&u(a).backdropFirst||!u(a).backdropFirst)]])]),_:3},16,["appear"])):P("",!0),u(a).noBackdrop?P("",!0):O(R.$slots,"backdrop",x(H({key:1},K.value)),()=>[u(ue)?(E(),j(Me,x(H({key:0},u(ve))),{default:z(()=>[_e(ye("div",{class:G(["modal-backdrop",{fade:!u(L),show:u(l)||u(L)}]),style:Ot(dt.value),onClick:N[5]||(N[5]=oe=>u(F)("backdrop"))},null,6),[[Ke,u(A)||u(be)&&u(a).backdropFirst&&!u(L)]])]),_:1},16)):P("",!0)],!0)]),_:3},8,["to","disabled"]))}}),Ia=Ft(Ea,[["__scopeId","data-v-93972863"]]);export{Ia as B};