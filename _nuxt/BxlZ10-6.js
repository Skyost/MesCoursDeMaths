const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CE9nH-bJ.js","./DMOaezB_.js","./entry.B316apuN.css","./Da63I3gm.js","./D8NsVCyZ.js","./Bam3v22Z.js","./Dym_awWQ.js"])))=>i.map(i=>d[i]);
import{h as p}from"./D8NsVCyZ.js";import{a as f}from"./B2EVC65_.js";import{L as d,ar as v,d as g,as as l,e as h,at as _,a2 as y,ak as r,G as C}from"./DMOaezB_.js";import{q as w,w as m,e as P,s as $,j as N,u as j}from"./Da63I3gm.js";import{u as T}from"./Bam3v22Z.js";const D=async e=>{const{content:t}=d().public;typeof(e==null?void 0:e.params)!="function"&&(e=w(e));const a=e.params(),s=t.experimental.stripQueryParameters?m(`/navigation/${`${p(a)}.${t.integrity}`}/${P(a)}.json`):m(`/navigation/${p(a)}.${t.integrity}.json`);if($())return(await v(()=>import("./CE9nH-bJ.js"),__vite__mapDeps([0,1,2,3,4,5,6]),import.meta.url).then(o=>o.generateNavigation))(a);const n=await $fetch(s,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:N(a),previewToken:T().getPreviewToken()}});if(typeof n=="string"&&n.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return n},E=g({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(e){const{query:t}=l(e),a=h(()=>{var n;return typeof((n=t.value)==null?void 0:n.params)=="function"?t.value.params():t.value});if(!a.value&&_("dd-navigation").value){const{navigation:n}=j();return{navigation:n}}const{data:s}=await f(`content-navigation-${p(a.value)}`,()=>D(a.value));return{navigation:s}},render(e){const t=y(),{navigation:a}=e,s=o=>r(C,{to:o._path},()=>o.title),n=(o,u)=>r("ul",u?{"data-level":u}:null,o.map(i=>i.children?r("li",null,[s(i),n(i.children,u+1)]):r("li",null,s(i)))),c=o=>n(o,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):c(a)}}),R=E;export{R as default};