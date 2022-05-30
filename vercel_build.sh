echo "Installing wget..."
yum install wget -y
echo "Installing Pandoc..."
wget -q -O pandoc.tar.gz https://github.com/jgm/pandoc/releases/download/2.18/pandoc-2.18-linux-amd64.tar.gz
tar -xvf pandoc.tar.gz
ln -s "${PWD}/pandoc-2.18/bin/pandoc" /usr/bin/pandoc
echo "Checking Pandoc installation..."
pandoc --version
echo "Installing latexmk..."
yum install perl  -y
yum install perl-Digest-MD5 -y
wget -q -O latexmk https://mirrors.ircam.fr/pub/CTAN/support/latexmk/latexmk.pl
chmod +x latexmk
ln -s "${PWD}/latexmk" /usr/bin/latexmk
echo "Checking latexmk installation..."
latexmk --version
echo "Installing TeX Live..."
yum install python
wget -q http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
tar xvzf install-tl-unx.tar.gz
cd install-tl-*
touch texlive.profile
echo 'selected_scheme scheme-minimal
TEXDIR /tmp/texlive
TEXMFCONFIG ~/.texlive/texmf-config
TEXMFHOME ~/texmf
TEXMFLOCAL /tmp/texlive/texmf-local
TEXMFSYSCONFIG /tmp/texlive/texmf-config
TEXMFSYSVAR /tmp/texlive/texmf-var
TEXMFVAR ~/.texlive/texmf-var
option_doc 0
option_src 0' > texlive.profile
./install-tl --profile=texlive.profile
ln -s /tmp/texlive/bin/x86_64-linux /opt/texbin
pathmunge () {
    if ! echo $PATH | /bin/egrep -q "(^|:)$1($|:)" ; then
        if [ "$2" = "after" ] ; then
            PATH=$PATH:$1
        else
            PATH=$1:$PATH
        fi
    fi
}
pathmunge /opt/texbin
unset pathmunge
cp $(kpsewhich -var-value TEXMFSYSVAR)/fonts/conf/texlive-fontconfig.conf /etc/fonts/conf.d/09-texlive.conf
fc-cache -fsv
cd ../
tlmgr install latex
tlmgr install latex-bin
tlmgr install collection-langfrench
tlmgr install comment
tlmgr install hyperref
tlmgr install amsmath
tlmgr install amscls
tlmgr install fourier
tlmgr install erewhon-math
tlmgr install fontspec
tlmgr install geometry
tlmgr install tools
tlmgr install mdframed
tlmgr install xcolor
tlmgr install sectsty
tlmgr install titlesec
tlmgr install graphics
tlmgr install tcolorbox
tlmgr install etoolbox
tlmgr install environ
tlmgr install siunitx
tlmgr install enumitem
tlmgr install makecell
tlmgr install was
tlmgr install microtype
tlmgr install fancyhdr
tlmgr install lastpage
tlmgr install cleveref
tlmgr install colortbl
tlmgr install pgf
tlmgr install tkz-euclide
tlmgr install marginfix
tlmgr install luacolor
tlmgr install lua-ul
tlmgr install luatex85
tlmgr install twemojis
tlmgr install kvoptions
tlmgr install xkeyval
tlmgr install realscripts
tlmgr install carlisle
tlmgr install infwarerr
tlmgr install standalone
tlmgr install unicode-math
tlmgr install latexmk
tlmgr install texliveonfly
echo "Checking TeX Live installation..."
luatex --version
echo "Installing Poppler-utils..."
yum install poppler-utils -y
echo "Checking Poppler-utils installation..."
pdftocairo -v
echo "Generating website..."
npm run generate
echo "Done !"
