import{d as C,m as A,e as y,p as J,t as K,q as T,b as m,i as $,w as h,s as O,n as V,v as S,x as Q,y as X,z as Y,g as o,u as ee,r as te,c as x,f as p,a as v,A as ne,B as ae,k as D,_ as se,h as oe,F as L,j as B}from"./ADqfzcmN.js";import{_ as re}from"./D34PIa9T.js";import{C as ie,_ as N,a as le}from"./HTweWL1f.js";import{_ as ue}from"./C97Qh4EL.js";import{u as R,_ as de,a as ce}from"./ogzLP0_d.js";import me from"./DxcNi95o.js";import{u as pe,_ as fe}from"./MDYBjqIX.js";import{B as ge}from"./kaG8jXlm.js";import{l as z,g as W,a as he}from"./DNFP-GQu.js";import{g as k,p as s}from"./DV069N9u.js";import{u as _e}from"./BC2Uv4U8.js";import{q as ye}from"./B8Cfo3LV.js";const be=C({__name:"BListGroup",props:{flush:{type:Boolean,default:!1},horizontal:{type:[Boolean,String],default:!1},numbered:{type:Boolean,default:!1},tag:{default:"div"}},setup(t){const e=A(t,"BListGroup"),a=y(()=>{const d=e.flush?!1:e.horizontal;return{"list-group-flush":e.flush,"list-group-horizontal":d===!0,[`list-group-horizontal-${d}`]:typeof d=="string","list-group-numbered":e.numbered}}),i=y(()=>e.numbered===!0?"ol":e.tag);return J(T,{numbered:K(()=>e.numbered)}),(d,u)=>(m(),$(S(i.value),{class:V(["list-group",a.value])},{default:h(()=>[O(d.$slots,"default")]),_:3},8,["class"]))}}),ve=C({__name:"BListGroupItem",props:{action:{type:Boolean,default:!1},button:{type:Boolean,default:!1},tag:{default:"div"},active:{type:Boolean,default:!1},activeClass:{default:void 0},disabled:{type:Boolean,default:void 0},exactActiveClass:{default:void 0},href:{default:void 0},icon:{type:Boolean,default:void 0},noRel:{type:Boolean},opacity:{default:void 0},opacityHover:{default:void 0},prefetch:{type:Boolean},prefetchOn:{},noPrefetch:{type:Boolean},prefetchedClass:{},rel:{default:void 0},replace:{type:Boolean,default:void 0},routerComponentName:{default:void 0},stretched:{type:Boolean,default:!1},target:{default:void 0},to:{default:void 0},underlineOffset:{default:void 0},underlineOffsetHover:{default:void 0},underlineOpacity:{default:void 0},underlineOpacityHover:{default:void 0},underlineVariant:{default:void 0},variant:{default:void 0}},setup(t){const e=A(t,"BListGroupItem"),a=Q(),i=X(T,null),{computedLink:d}=pe(e),u=y(()=>!e.button&&d.value),r=y(()=>i!=null&&i.numbered.value?"li":e.button?"button":u.value?fe:e.tag),f=y(()=>e.action||u.value||e.button||["a","router-link","button","b-link"].includes(e.tag)),b=y(()=>({[`list-group-item-${e.variant}`]:e.variant!==null&&e.variant!==void 0,"list-group-item-action":f.value,active:e.active,disabled:e.disabled})),g=y(()=>{const c={};return e.button&&((!a||!a.type)&&(c.type="button"),e.disabled&&(c.disabled=!0)),c});return(c,w)=>(m(),$(S(r.value),Y({class:["list-group-item",b.value],"aria-current":o(e).active?!0:void 0,"aria-disabled":o(e).disabled?!0:void 0,target:u.value?o(e).target:void 0,href:o(e).button?void 0:o(e).href,to:o(e).button?void 0:o(e).to},g.value),{default:h(()=>[O(c.$slots,"default")]),_:3},16,["class","aria-current","aria-disabled","target","href","to"]))}}),xe=t=>`Chapitre ${t.number}`,ke=t=>{const n=z[t.level];return`${W(n)}${t.id}/`},$e=t=>`/images/${z[t.level].id}/${t.id}-cours/image.svg`,_={downloadDestinations:{previousBuild:"node_modules/.previous-build",data:"node_modules/.data"},shouldCopyDownloadedFileToContent:t=>k(t).endsWith("-cours")&&s.extname(t)===".tex",dataLatexDirectory:"latex",latexPdfDestinationDirectory:"pdf",latexAssetsDestinationDirectory:"images",getLatexFileAssetsDestinationDirectoryPath:(t,n)=>s.resolve(t,s.basename(s.dirname(n)),k(n)),getAssetDestinationDirectoryPath:(t,n)=>{const e=s.dirname(n);if(k(e)==="images"){const a=s.basename(s.dirname(e));return s.resolve(t,a)}else{const a=s.basename(s.dirname(s.dirname(e)));return s.resolve(t,a,s.basename(e))}},isAsset:t=>{const n=s.basename(s.dirname(t));if(n!=="images"&&!n.endsWith("-cours"))return!1;const e=s.parse(t).ext;return[".pdf",".svg",".png",".jpeg",".jpg",".gif"].includes(e)},generateVariants:(t,n)=>{const e=k(t);if(e==="questions-flash")return null;const a=/\\documentclass(\[[A-Za-zÀ-ÖØ-öø-ÿ\d, =.\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\d/, .-]+)}/gs,i=_.filterFileName(e),u=[{fileName:`${i}-impression`,fileContent:n.replace(a,`\\documentclass$1{$2}

\\include{../impression}`),type:"impression"}];if(e.endsWith("-cours")){const r={fileName:`${i}-eleve`,fileContent:n.replace(a,`\\documentclass$1{$2}

\\include{../eleve}`),type:"élève"},f={fileName:`${i}-eleve-impression`,fileContent:n.replace(a,`\\documentclass$1{$2}

\\include{../impression}
\\include{../eleve}`),type:"élève / impression"};u.push(r,f)}return u},pandocRedefinitions:"pandoc.tex",ignores:["devoir.tex","eleve.tex","geogebra.tex","groupes.tex","impression.tex","pandoc.tex","scratch.tex"],getIncludeGraphicsDirectories:t=>[s.resolve(s.dirname(t),_.latexAssetsDestinationDirectory,s.parse(t).name),s.dirname(t)],picturesTemplate:{scratch:`\\documentclass[tikz]{standalone}

% Load all required packages for my Scratch scripts.
\\usepackage{scratch3}

\\setscratch{scale=2.0}

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

% 2.0x scale.
\\tikzset{
  graphfonctionlabel/.style args={at #1 #2 with #3}{
    postaction={
      decorate, decoration={markings, mark= at position #1 with \\node [#2] {#3};}
    }
  },
  every picture/.append style={scale=2.0, every node/.style={scale=2.0}}
}

\\begin{document}
  % Content.
  {extractedContent}
\\end{document}
`},filterFileName:t=>{let n="-cours";return t.endsWith(n)?t.substring(0,t.length-n.length):(n="-cours-impression",t.endsWith(n)?t.substring(0,t.length-n.length)+"-impression":t)},getLinkedResources:(t,n)=>{const e=k(n);if(e.endsWith("-cours")){const a=[],i=_.filterFileName(e),d=s.readdirSync(s.dirname(n)),u=(r,f)=>`/${_.latexPdfDestinationDirectory}/${r}/${_.filterFileName(k(f))}.pdf`;for(const r of d)if(r.startsWith(i)&&r.endsWith(".tex")&&r!==e){const f=s.relative(s.resolve(t,_.downloadDestinations.data,_.dataLatexDirectory),n),b=s.dirname(f).replace("\\","/");e+".tex"===r&&a.push({title:"Télécharger le PDF",url:u(b,r),isCurrentFile:!0});const g=Ce(i,r);g&&a.push({title:g,url:u(b,r)})}return a}return[]}},Ce=(t,n)=>{const e=[{fileNameRegex:RegExp(t+/-activite-([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)/.source),buildTitle:a=>`Activité ${a[1]}`},{fileNameRegex:RegExp(t+/-evaluation/.source),buildTitle:a=>"Évaluation"},{fileNameRegex:RegExp(t+/-interrogation/.source),buildTitle:a=>"Interrogation"},{fileNameRegex:RegExp(t+/-dm/.source),buildTitle:a=>"Devoir maison"}];for(const a of e){const i=a.fileNameRegex.exec(n);if(i!=null)return a.buildTitle(i)}return null},ze={key:0},we={key:1},De=["textContent"],Le={class:"d-flex align-items-center gap-3"},Be=["innerHTML"],Ne=["innerHTML"],Re={key:2},Ae=t=>({title:t.name,to:W(t),depth:1}),Ue=C({__name:"index",setup(t){const n=ee(),e=z[n.params.level.toString()],{status:a,data:i,error:d}=_e(n.path,()=>ye(_.dataLatexDirectory,e==null?void 0:e.id).without("body").sort({number:1,$numeric:!0}).find(),"$qztm8S4CJV"),u=y(()=>e?`Cours de ${e.name}`:"Liste des cours");R(he),e&&R(Ae(e));const r=te(!1),f=g=>g.url.endsWith(".pdf")?"bi:file-earmark-pdf-fill":"bi:file-earmark-text-fill",b=g=>g.url.endsWith(".pdf")?"danger":null;return(g,c)=>{const w=se,E=re,q=le,G=ie,H=ue,I=ce,M=de,j=me,U=ve,P=be,Z=ge,F=oe;return m(),x("div",null,[p(w,{title:o(u)},null,8,["title"]),o(a)==="pending"?(m(),x("div",ze,[p(E)])):o(e)&&o(i)?(m(),x("div",we,[p(G,null,{default:h(()=>[p(q,null,{default:h(()=>[p(N,{to:"/cours/",text:"Retourner à la liste des niveaux"}),o(e).otherResources&&o(e).otherResources.length>0?(m(),$(N,{key:0,text:"Autres ressources","icon-id":"file-earmark-text-fill",onClick:c[0]||(c[0]=l=>r.value=!o(r))})):D("",!0)]),_:1})]),_:1}),v("h1",{textContent:ne(o(u))},null,8,De),p(M,{class:"justify-content-center"},{default:h(()=>[(m(!0),x(L,null,B(o(i),l=>(m(),$(I,{key:l.id,xs:"12",md:"6",lg:"4",class:"mt-3"},{default:h(()=>[p(H,{title:l.name,color:o(e).color,subtitle:o(xe)(l),to:o(ke)(l),image:o($e)(l)},null,8,["title","color","subtitle","to","image"])]),_:2},1024))),128))]),_:1}),o(e).otherResources&&o(e).otherResources.length>0?(m(),$(Z,{key:0,modelValue:o(r),"onUpdate:modelValue":c[1]||(c[1]=l=>ae(r)?r.value=l:null),title:"Autres ressources",size:"lg","ok-only":"","ok-title":"Fermer","ok-variant":"secondary"},{default:h(()=>[c[2]||(c[2]=v("p",null," Ce niveau comporte d'autres ressources qui ne sont pas associées à un chapitre particulier. ",-1)),p(P,{class:"mb-3"},{default:h(()=>[(m(!0),x(L,null,B(o(e).otherResources,l=>(m(),$(U,{key:l.url,href:l.url},{default:h(()=>[v("div",Le,[v("div",{class:V(["fs-2",{[`text-${b(l)}`]:b(l)}])},[p(j,{name:f(l)},null,8,["name"])],2),v("div",null,[v("strong",{class:"d-block",innerHTML:l.name},null,8,Be),v("small",{innerHTML:l.description},null,8,Ne)])])]),_:2},1032,["href"]))),128))]),_:1})]),_:1},8,["modelValue"])):D("",!0)])):(m(),x("div",Re,[p(F,{"change-title":!0,error:o(d)??404},null,8,["error"])]))])}}});export{Ue as _,ke as g,Ae as l,_ as s};
