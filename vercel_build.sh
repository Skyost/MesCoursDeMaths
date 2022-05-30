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
tlmgr install latex-bin
tlmgr install latexmk
tlmgr install luatex85
tlmgr install lualatex-math
tlmgr install standalone
tlmgr install comment
tlmgr install fourier
yum install python
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
