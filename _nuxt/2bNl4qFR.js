import{d as N,u as R,e as T,c as g,f as c,g as r,w as x,a as A,t as O,_ as E,V as S,h as W,b as m,F as q,j as V,i as B,H as j}from"./Q9v0dDp8.js";import{_ as U}from"./a7-95kXF.js";import{C as G,_ as I,a as Z}from"./BjBgqDlp.js";import{_ as H}from"./D0h4fU6R.js";import{u as J}from"./DaFXh64y.js";import{q as M}from"./BgLrHOZs.js";import{u as k}from"./D8iOKkQS.js";import{l as b,g as v,a as K}from"./D2RIinC-.js";import{g as d,p as n}from"./DV069N9u.js";const Q=e=>`Chapitre ${e.number}`,X=e=>{const a=b[e.level];return`${v(a)}${e.id}/`},Y=e=>`/images/${b[e.level].id}/${e.id}.svg`,l={downloadDestinations:{previousBuild:"node_modules/.previous-build",data:"node_modules/.data"},shouldCopyDownloadedFileToContent:e=>d(e).endsWith("-cours")&&n.extname(e)===".tex",dataLatexDirectory:"latex",latexPdfDestinationDirectory:"pdf",latexAssetsDestinationDirectory:"images",getLatexAssetDestinationDirectoryPath:(e,a,t)=>{if(t)return n.resolve(e,n.basename(n.dirname(t)),d(t));const s=n.dirname(a),o=n.basename(n.dirname(n.dirname(s)));return n.resolve(e,o,n.basename(s))},isAsset:e=>{if(!n.basename(n.dirname(e)).endsWith("-cours"))return!1;const t=n.parse(e).ext;return[".pdf",".svg",".png",".jpeg",".jpg",".gif"].includes(t)},generatePrintVariant:(e,a)=>{if(d(e)==="questions-flash")return null;const t=/\\documentclass(\[[A-Za-zÀ-ÖØ-öø-ÿ\d, =.\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\d/, .-]+)}/gs;return{name:l.filterFileName(d(e))+"-impression",content:a.replace(t,`\\documentclass$1{$2}

\\include{../impression}`)}},pandocRedefinitions:"pandoc.tex",ignores:["eleve.tex","geogebra.tex","groupes.tex","impression.tex","pandoc.tex","scratch.tex"],getIncludeGraphicsDirectories:e=>[n.resolve(n.dirname(e),l.latexAssetsDestinationDirectory,n.parse(e).name),n.dirname(e)],picturesTemplate:{scratch:`\\documentclass[tikz]{standalone}

% Load all required packages for my Scratch scripts.
\\usepackage{scratch3}

\\setscratch{scale=2.25}

% Graphics path.
{graphicspath}

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
{graphicspath}

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
`},filterFileName:e=>{let a="-cours";return e.endsWith(a)?e.substring(0,e.length-a.length):(a="-cours-impression",e.endsWith(a)?e.substring(0,e.length-a.length)+"-impression":e)},getLinkedResources:(e,a)=>{const t=d(a);if(t.endsWith("-cours")){const s=[],o=l.filterFileName(t),y=n.readdirSync(n.dirname(a)),u=(i,f)=>`/${l.latexPdfDestinationDirectory}/${i}/${l.filterFileName(d(f))}.pdf`;for(const i of y)if(i.startsWith(o)&&i.endsWith(".tex")&&i!==t){const f=n.relative(n.resolve(e,l.downloadDestinations.data,l.dataLatexDirectory),a),h=n.dirname(f).replace("\\","/");t+".tex"===i&&s.push({title:"Télécharger le PDF",url:u(h,i),isCurrentFile:!0});const _=F(o,i);_&&s.push({title:_,url:u(h,i)})}return s}return[]}},F=(e,a)=>{const t=[{fileNameRegex:RegExp(e+/-activite-([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)/.source),buildTitle:s=>`Activité ${s[1]}`},{fileNameRegex:RegExp(e+/-evaluation/.source),buildTitle:s=>"Évaluation"},{fileNameRegex:RegExp(e+/-interrogation/.source),buildTitle:s=>"Interrogation"}];for(const s of t){const o=s.fileNameRegex.exec(a);if(o!=null)return s.buildTitle(o)}return null},P={key:0},ee={key:1},te=["textContent"],ae={key:2},ne=e=>({title:e.name,to:v(e),depth:1}),pe=N({__name:"index",setup(e){const a=R(),t=b[a.params.level.toString()],{pending:s,data:o,error:y}=J(a.path,()=>M(l.dataLatexDirectory,t==null?void 0:t.id).without("body").sort({number:1,$numeric:!0}).find(),"$qztm8S4CJV"),u=T(()=>t?`Cours de ${t.name.toLowerCase()}`:"Liste des cours");return k(K),t&&k(ne(t)),(i,f)=>{const h=E,_=U,w=Z,$=G,D=H,C=j,z=S,L=W;return m(),g("div",null,[c(h,{title:r(u)},null,8,["title"]),r(s)?(m(),g("div",P,[c(_)])):r(t)&&r(o)?(m(),g("div",ee,[c($,null,{default:x(()=>[c(w,null,{default:x(()=>[c(I,{to:"/cours/",text:"Retourner à la liste des niveaux"})]),_:1})]),_:1}),A("h1",{textContent:O(r(u))},null,8,te),c(z,{class:"justify-content-center"},{default:x(()=>[(m(!0),g(q,null,V(r(o),p=>(m(),B(C,{key:p.id,xs:"12",md:"6",lg:"4",class:"mt-3"},{default:x(()=>[c(D,{title:p.name,color:r(t).color,subtitle:r(Q)(p),to:r(X)(p),image:r(Y)(p)},null,8,["title","color","subtitle","to","image"])]),_:2},1024))),128))]),_:1})])):(m(),g("div",ae,[c(L,{"change-title":!0,error:r(y)??404},null,8,["error"])]))])}}});export{pe as _,X as g,ne as l,l as s};
