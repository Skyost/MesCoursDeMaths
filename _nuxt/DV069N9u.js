const s={},n=e=>s.parse(e).name,c=e=>decodeURIComponent(atob(e).split("").map(t=>"%"+("00"+t.charCodeAt(0).toString(16)).slice(-2)).join("")),d=e=>new Promise((t,r)=>{const a=new FileReader;a.onload=o=>{o.target&&t(o.target.result)},a.onerror=o=>{a.abort(),r(o)},a.readAsDataURL(e)});export{d as a,c as b,n as g,s as p};