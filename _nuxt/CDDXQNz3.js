import{d as C,m as A,e as v,p as P,t as F,q as T,b as m,i as $,w as _,s as O,n as V,v as S,x as Q,y as X,z as Y,g as s,u as ee,r as te,c as x,f as p,a as b,A as ae,B as ne,k as L,_ as oe,h as se,F as D,j as B}from"./wcxRronh.js";import{_ as re}from"./DmSw07Yb.js";import{C as ie,_ as N,a as le}from"./QUAbAwBT.js";import{_ as ue}from"./wGpqO2Va.js";import{u as R,_ as ce,a as de}from"./DDHKgshb.js";import me from"./AjXOLfSR.js";import{u as pe,_ as fe}from"./D9mFSBrK.js";import{B as ge}from"./CgTiHHSn.js";import{l as z,g as W,a as _e}from"./CcJoaRlU.js";import{g as k,p as o}from"./DV069N9u.js";import{u as he}from"./0_J7Cipg.js";import{q as ve}from"./CZs_PgoF.js";const ye=C({__name:"BListGroup",props:{flush:{type:Boolean,default:!1},horizontal:{type:[Boolean,String],default:!1},numbered:{type:Boolean,default:!1},tag:{default:"div"}},setup(t){const e=A(t,"BListGroup"),n=v(()=>{const c=e.flush?!1:e.horizontal;return{"list-group-flush":e.flush,"list-group-horizontal":c===!0,[`list-group-horizontal-${c}`]:typeof c=="string","list-group-numbered":e.numbered}}),r=v(()=>e.numbered===!0?"ol":e.tag);return P(T,{numbered:F(()=>e.numbered)}),(c,u)=>(m(),$(S(r.value),{class:V(["list-group",n.value])},{default:_(()=>[O(c.$slots,"default")]),_:3},8,["class"]))}}),be=C({__name:"BListGroupItem",props:{action:{type:Boolean,default:!1},button:{type:Boolean,default:!1},tag:{default:"div"},active:{type:Boolean,default:!1},activeClass:{default:void 0},disabled:{type:Boolean,default:void 0},exactActiveClass:{default:void 0},href:{default:void 0},icon:{type:Boolean,default:void 0},noRel:{type:Boolean},opacity:{default:void 0},opacityHover:{default:void 0},rel:{default:void 0},replace:{type:Boolean,default:void 0},routerComponentName:{default:void 0},stretched:{type:Boolean,default:!1},target:{default:void 0},to:{default:void 0},underlineOffset:{default:void 0},underlineOffsetHover:{default:void 0},underlineOpacity:{default:void 0},underlineOpacityHover:{default:void 0},underlineVariant:{default:void 0},variant:{default:void 0}},setup(t){const e=A(t,"BListGroupItem"),n=Q(),r=X(T,null),{computedLink:c}=pe(e),u=v(()=>!e.button&&c.value),i=v(()=>r!=null&&r.numbered.value?"li":e.button?"button":u.value?fe:e.tag),f=v(()=>e.action||u.value||e.button||["a","router-link","button","b-link"].includes(e.tag)),y=v(()=>({[`list-group-item-${e.variant}`]:e.variant!==null&&e.variant!==void 0,"list-group-item-action":f.value,active:e.active,disabled:e.disabled})),g=v(()=>{const d={};return e.button&&((!n||!n.type)&&(d.type="button"),e.disabled&&(d.disabled=!0)),d});return(d,w)=>(m(),$(S(i.value),Y({class:["list-group-item",y.value],"aria-current":s(e).active?!0:void 0,"aria-disabled":s(e).disabled?!0:void 0,target:u.value?s(e).target:void 0,href:s(e).button?void 0:s(e).href,to:s(e).button?void 0:s(e).to},g.value),{default:_(()=>[O(d.$slots,"default")]),_:3},16,["class","aria-current","aria-disabled","target","href","to"]))}}),xe=t=>`Chapitre ${t.number}`,ke=t=>{const a=z[t.level];return`${W(a)}${t.id}/`},$e=t=>`/images/${z[t.level].id}/${t.id}-cours/image.svg`,h={downloadDestinations:{previousBuild:"node_modules/.previous-build",data:"node_modules/.data"},shouldCopyDownloadedFileToContent:t=>k(t).endsWith("-cours")&&o.extname(t)===".tex",dataLatexDirectory:"latex",latexPdfDestinationDirectory:"pdf",latexAssetsDestinationDirectory:"images",getLatexAssetDestinationDirectoryPath:(t,a,e)=>{if(e)return o.resolve(t,o.basename(o.dirname(e)),k(e));const n=o.dirname(a);if(k(n)==="images"){const r=o.basename(o.dirname(n));return o.resolve(t,r)}else{const r=o.basename(o.dirname(o.dirname(n)));return o.resolve(t,r,o.basename(n))}},isAsset:t=>{const a=o.basename(o.dirname(t));if(a!=="images"&&!a.endsWith("-cours"))return!1;const e=o.parse(t).ext;return[".pdf",".svg",".png",".jpeg",".jpg",".gif"].includes(e)},generateVariants:(t,a)=>{const e=k(t);if(e==="questions-flash")return null;const n=/\\documentclass(\[[A-Za-zÀ-ÖØ-öø-ÿ\d, =.\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\d/, .-]+)}/gs,r=h.filterFileName(e),u=[{fileName:`${r}-impression`,fileContent:a.replace(n,`\\documentclass$1{$2}

\\include{../impression}`),type:"impression"}];if(e.endsWith("-cours")){const i={fileName:`${r}-eleve`,fileContent:a.replace(n,`\\documentclass$1{$2}

\\include{../eleve}`),type:"élève"},f={fileName:`${r}-eleve-impression`,fileContent:a.replace(n,`\\documentclass$1{$2}

\\include{../impression}
\\include{../eleve}`),type:"élève / impression"};u.push(i,f)}return u},pandocRedefinitions:"pandoc.tex",ignores:["devoir.tex","eleve.tex","geogebra.tex","groupes.tex","impression.tex","pandoc.tex","scratch.tex"],getIncludeGraphicsDirectories:t=>[o.resolve(o.dirname(t),h.latexAssetsDestinationDirectory,o.parse(t).name),o.dirname(t)],picturesTemplate:{scratch:`\\documentclass[tikz]{standalone}

% Load all required packages for my Scratch scripts.
\\usepackage{scratch3}

\\setscratch{scale=2.25}

% Graphics path.
{graphicsPath}

\\begin{document}
  % Content :
  {extractedContent}
\\end{document}
`,tikzpicture:`\\documentclass[tikz]{standalone}

% Load all required packages for my graphics.
\\usepackage{fourier-otf}
\\usepackage{fontspec}
\\usepackage{tkz-euclide}
\\usepackage{graphicx}
\\usepackage{gensymb}
\\usepackage{xlop}
\\usepackage{ifthen}
\\usepackage{xparse}
\\usepackage[group-separator={\\;}, group-minimum-digits=4]{siunitx}
\\usepackage{tkz-tab}

% Tables :

\\tikzset{t style/.style = {style = dashed}}

% Arrows :

\\tikzset{>={Latex[width=4pt]}}

% Options for xlop.
\\opset{%
  dividendbridge,%
  carrysub,%
  displayintermediary=all,%
  displayshiftintermediary=all,%
  voperator=bottom,%
  voperation=bottom,%
  decimalsepsymbol={,},%
  shiftdecimalsep=divisor%
}

% Switch math font.
\\setmathfont{Erewhon Math}

% Load some tikz libraries.
\\usetikzlibrary{angles}
\\usetikzlibrary{patterns}
\\usetikzlibrary{intersections}
\\usetikzlibrary{shadows.blur}
\\usetikzlibrary{decorations.pathreplacing}
\\usetikzlibrary{ext.transformations.mirror}
\\usetikzlibrary{babel}

% Graphics path.
{graphicsPath}

% \\dddots command.
\\newcommand{\\dddots}[1]{\\makebox[#1]{\\dotfill}}
\\NewDocumentCommand{\\graphfonction}{O{1} O{1} m m m m O{\\x} O{f} O{0.5 below right}}{
  \\tikzgraph[#1][#2]{#3}{#4}{#5}{#6}
  \\begin{scope}
    \\clip (\\xmin,\\ymin) rectangle (\\xmax,\\ymax);
    \\draw[domain=\\xmin:\\xmax, variable=\\x, graphfonctionlabel=at #9 with {$\\color{teal} \\mathcal{C}_{#8}$}, thick, smooth, teal] plot ({\\x}, {(#7)});
  \\end{scope}
}

% \\tikzgraph command.
\\NewDocumentCommand{\\tikzgraph}{O{1} O{1} m m m m}{
  \\coordinate (O) at (0,0);

  \\pgfmathparse{#3-0.5}
  \\edef\\xmin{\\pgfmathresult}
  \\pgfmathparse{#4-0.5}
  \\edef\\ymin{\\pgfmathresult}
  \\pgfmathparse{#5+0.5}
  \\edef\\xmax{\\pgfmathresult}
  \\pgfmathparse{#6+0.5}
  \\edef\\ymax{\\pgfmathresult}

  \\draw[opacity=0.5,thin] (\\xmin,\\ymin) grid (\\xmax,\\ymax);
  \\foreach \\x in {#3,...,#5} {
    \\pgfmathparse{int(#1*\\x)}
    \\edef\\xlabel{\\pgfmathresult}
    \\ifthenelse{\\x = 0}{}{\\draw[opacity=0.5] (\\x,0.25) -- (\\x,-0.25) node {\\small $\\xlabel$}};
  }
  \\foreach \\y in {#4,...,#6} {
    \\pgfmathparse{int(#2*\\y)}
    \\edef\\ylabel{\\pgfmathresult}
    \\ifthenelse{\\y = 0}{}{\\draw[opacity=0.5] (0.25,\\y) -- (-0.25,\\y) node[shift={(-0.1,0)}] {\\small $\\ylabel$}};
  }
  \\draw[opacity=0.5] (0,0.25) -- (0,-0.25) node[shift={(-0.35,-0.1)}]{\\small $0$};
  \\draw[thick,->] (\\xmin,0) -- (\\xmax,0);
  \\draw[thick,->] (0,\\ymin) -- (0,\\ymax);
}

% Other commands.
\\newcommand{\\sipandoc}[2]{#1}
\\newcommand{\\siimpression}[2]{#2}
\\newcommand{\\sieleve}[2]{#2}

% 2.25x scale.
\\tikzset{
  graphfonctionlabel/.style args={at #1 #2 with #3}{
    postaction={
      decorate, decoration={markings, mark= at position #1 with \\node [#2] {#3};}
    }
  },
  every picture/.append style={scale=2.25, every node/.style={scale=2.25}}
}

\\begin{document}
  % Content.
  {extractedContent}
\\end{document}
`},filterFileName:t=>{let a="-cours";return t.endsWith(a)?t.substring(0,t.length-a.length):(a="-cours-impression",t.endsWith(a)?t.substring(0,t.length-a.length)+"-impression":t)},getLinkedResources:(t,a)=>{const e=k(a);if(e.endsWith("-cours")){const n=[],r=h.filterFileName(e),c=o.readdirSync(o.dirname(a)),u=(i,f)=>`/${h.latexPdfDestinationDirectory}/${i}/${h.filterFileName(k(f))}.pdf`;for(const i of c)if(i.startsWith(r)&&i.endsWith(".tex")&&i!==e){const f=o.relative(o.resolve(t,h.downloadDestinations.data,h.dataLatexDirectory),a),y=o.dirname(f).replace("\\","/");e+".tex"===i&&n.push({title:"Télécharger le PDF",url:u(y,i),isCurrentFile:!0});const g=Ce(r,i);g&&n.push({title:g,url:u(y,i)})}return n}return[]}},Ce=(t,a)=>{const e=[{fileNameRegex:RegExp(t+/-activite-([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)/.source),buildTitle:n=>`Activité ${n[1]}`},{fileNameRegex:RegExp(t+/-evaluation/.source),buildTitle:n=>"Évaluation"},{fileNameRegex:RegExp(t+/-interrogation/.source),buildTitle:n=>"Interrogation"},{fileNameRegex:RegExp(t+/-dm/.source),buildTitle:n=>"Devoir maison"}];for(const n of e){const r=n.fileNameRegex.exec(a);if(r!=null)return n.buildTitle(r)}return null},ze={key:0},we={key:1},Le=["textContent"],De={class:"d-flex align-items-center gap-3"},Be=["innerHTML"],Ne=["innerHTML"],Re={key:2},Ae=t=>({title:t.name,to:W(t),depth:1}),Ue=C({__name:"index",setup(t){const a=ee(),e=z[a.params.level.toString()],{pending:n,data:r,error:c}=he(a.path,()=>ve(h.dataLatexDirectory,e==null?void 0:e.id).without("body").sort({number:1,$numeric:!0}).find(),"$qztm8S4CJV"),u=v(()=>e?`Cours de ${e.name}`:"Liste des cours");R(_e),e&&R(Ae(e));const i=te(!1),f=g=>g.url.endsWith(".pdf")?"bi:file-earmark-pdf-fill":"file-earmark-text-fill",y=g=>g.url.endsWith(".pdf")?"danger":null;return(g,d)=>{const w=oe,E=re,q=le,G=ie,H=ue,I=de,M=ce,j=me,U=be,Z=ye,J=ge,K=se;return m(),x("div",null,[p(w,{title:s(u)},null,8,["title"]),s(n)?(m(),x("div",ze,[p(E)])):s(e)&&s(r)?(m(),x("div",we,[p(G,null,{default:_(()=>[p(q,null,{default:_(()=>[p(N,{to:"/cours/",text:"Retourner à la liste des niveaux"}),s(e).otherResources&&s(e).otherResources.length>0?(m(),$(N,{key:0,text:"Autres ressources","icon-id":"file-earmark-text-fill",onClick:d[0]||(d[0]=l=>i.value=!s(i))})):L("",!0)]),_:1})]),_:1}),b("h1",{textContent:ae(s(u))},null,8,Le),p(M,{class:"justify-content-center"},{default:_(()=>[(m(!0),x(D,null,B(s(r),l=>(m(),$(I,{key:l.id,xs:"12",md:"6",lg:"4",class:"mt-3"},{default:_(()=>[p(H,{title:l.name,color:s(e).color,subtitle:s(xe)(l),to:s(ke)(l),image:s($e)(l)},null,8,["title","color","subtitle","to","image"])]),_:2},1024))),128))]),_:1}),s(e).otherResources&&s(e).otherResources.length>0?(m(),$(J,{key:0,modelValue:s(i),"onUpdate:modelValue":d[1]||(d[1]=l=>ne(i)?i.value=l:null),title:"Autres ressources",size:"lg","ok-only":"","ok-title":"Fermer","ok-variant":"secondary"},{default:_(()=>[d[2]||(d[2]=b("p",null," Ce niveau comporte d'autres ressources qui ne sont pas associées à un chapitre particulier. ",-1)),p(Z,{class:"mb-3"},{default:_(()=>[(m(!0),x(D,null,B(s(e).otherResources,l=>(m(),$(U,{key:l.url,href:l.url},{default:_(()=>[b("div",De,[b("div",{class:V(["fs-2",{[`text-${y(l)}`]:y(l)}])},[p(j,{name:f(l)},null,8,["name"])],2),b("div",null,[b("strong",{class:"d-block",innerHTML:l.name},null,8,Be),b("small",{innerHTML:l.description},null,8,Ne)])])]),_:2},1032,["href"]))),128))]),_:1})]),_:1},8,["modelValue"])):L("",!0)])):(m(),x("div",Re,[p(K,{"change-title":!0,error:s(c)??404},null,8,["error"])]))])}}});export{Ue as _,ke as g,Ae as l,h as s};
