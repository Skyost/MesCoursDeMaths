import{d as R,u as T,e as A,a as m,c as g,f as l,g as r,b as k,w as y,h as O,t as E,F as S,k as W,_ as q,l as B,i as V}from"./entry.ahDXewXk.js";import{_ as U}from"./Spinner.wn9na4Ln.js";import{_ as j}from"./Icon.vue.njg_iBmM.js";import{_ as G}from"./Button.vue.uZMRFKi9.js";import{_ as I}from"./ImageCard.R_WbivJM.js";import{u as v,_ as Z,a as J}from"./Columns.vue.hLFh-Hm7.js";import{u as M}from"./asyncData.Zuv3Yhl-.js";import{q as H}from"./query.VATQ16yB.js";import{l as b,g as $,a as K}from"./index.vue.0wKJzJHP.js";import{g as d,p as n}from"./utils.pjyIy0vJ.js";const Q=e=>`Chapitre ${e.number}`,X=e=>{const a=b[e.level];return`${$(a)}${e.id}/`},Y=e=>`/images/${b[e.level].id}/${e.id}.svg`,c={downloadDestinations:{previousBuild:"node_modules/.previous-build",data:"node_modules/.data"},shouldCopyDownloadedFileToContent:e=>d(e).endsWith("-cours")&&n.extname(e)===".tex",dataLatexDirectory:"latex",latexPdfDestinationDirectory:"pdf",latexAssetsDestinationDirectory:"images",getLatexAssetDestinationDirectoryPath:(e,a,t)=>{if(t)return n.resolve(e,n.basename(n.dirname(t)),d(t));const s=n.dirname(a),o=n.basename(n.dirname(n.dirname(s)));return n.resolve(e,o,n.basename(s))},isAsset:e=>{if(!n.basename(n.dirname(e)).endsWith("-cours"))return!1;const t=n.parse(e).ext;return[".pdf",".svg",".png",".jpeg",".jpg",".gif"].includes(t)},generatePrintVariant:(e,a)=>{if(d(e)==="questions-flash")return null;const t=/\\documentclass(\[[A-Za-zÀ-ÖØ-öø-ÿ\d, =.\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\d/, .-]+)}/gs;return{name:c.filterFileName(d(e))+"-impression",content:a.replace(t,`\\documentclass$1{$2}

\\include{../impression}`)}},pandocRedefinitions:"pandoc.tex",ignores:["eleve.tex","geogebra.tex","groupes.tex","impression.tex","pandoc.tex","scratch.tex"],getIncludeGraphicsDirectories:e=>[n.resolve(n.dirname(e),c.latexAssetsDestinationDirectory,n.parse(e).name),n.dirname(e)],picturesTemplate:{scratch:`\\documentclass[tikz]{standalone}

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
\\usepackage{pgfplots}
\\usepackage{pgf-pie}
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
`},filterFileName:e=>{let a="-cours";return e.endsWith(a)?e.substring(0,e.length-a.length):(a="-cours-impression",e.endsWith(a)?e.substring(0,e.length-a.length)+"-impression":e)},getLinkedResources:(e,a)=>{const t=d(a);if(t.endsWith("-cours")){const s=[],o=c.filterFileName(t),x=n.readdirSync(n.dirname(a)),p=(i,f)=>`/${c.latexPdfDestinationDirectory}/${i}/${c.filterFileName(d(f))}.pdf`;for(const i of x)if(i.startsWith(o)&&i.endsWith(".tex")&&i!==t){const f=n.relative(n.resolve(e,c.downloadDestinations.data,c.dataLatexDirectory),a),h=n.dirname(f).replace("\\","/");t+".tex"===i&&s.push({title:"Télécharger le PDF",url:p(h,i),isCurrentFile:!0});const _=F(o,i);_&&s.push({title:_,url:p(h,i)})}return s}return[]}},F=(e,a)=>{const t=[{fileNameRegex:RegExp(e+/-activite-([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)/.source),buildTitle:s=>`Activité ${s[1]}`},{fileNameRegex:RegExp(e+/-evaluation/.source),buildTitle:s=>"Évaluation"},{fileNameRegex:RegExp(e+/-interrogation/.source),buildTitle:s=>"Interrogation"}];for(const s of t){const o=s.fileNameRegex.exec(a);if(o!=null)return s.buildTitle(o)}return null},P={key:0},ee={key:1},te={class:"text-end mb-3"},ae=["textContent"],ne={key:2},se=e=>({title:e.name,to:$(e),depth:1}),fe=R({__name:"index",setup(e){const a=T(),t=b[a.params.level.toString()],{pending:s,data:o,error:x}=M(a.path,()=>H(c.dataLatexDirectory,t==null?void 0:t.id).without("body").sort({number:1,$numeric:!0}).find(),"$qztm8S4CJV"),p=A(()=>t?`Cours de ${t.name.toLowerCase()}`:"Liste des cours");return v(K),t&&v(se(t)),(i,f)=>{const h=q,_=U,w=j,D=G,z=I,C=J,L=Z,N=B;return m(),g("div",null,[l(h,{title:r(p)},null,8,["title"]),r(s)?(m(),g("div",P,[l(_)])):r(t)&&r(o)?(m(),g("div",ee,[k("div",te,[l(D,{variant:"light",to:"/cours/"},{default:y(()=>[l(w,{icon:"arrow-left"}),O(" Retourner à la liste des niveaux ")]),_:1})]),k("h1",{textContent:E(r(p))},null,8,ae),l(L,{class:"justify-content-center"},{default:y(()=>[(m(!0),g(S,null,W(r(o),u=>(m(),V(C,{key:u.id,xs:"12",md:"6",lg:"4",class:"mt-3"},{default:y(()=>[l(z,{title:u.name,color:r(t).color,subtitle:r(Q)(u),to:r(X)(u),image:r(Y)(u)},null,8,["title","color","subtitle","to","image"])]),_:2},1024))),128))]),_:1})])):(m(),g("div",ne,[l(N,{"change-title":!0,error:r(x)??404},null,8,["error"])]))])}}});export{fe as _,X as g,se as l,c as s};
