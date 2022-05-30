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
echo "Installing MiKTeX..."
yum install curl -y
wget -q http://springdale.math.ias.edu/data/puias/unsupported/7/x86_64/dnf-conf-0.6.4-2.sdl7.noarch.rpm
wget -q http://springdale.math.ias.edu/data/puias/unsupported/7/x86_64//dnf-0.6.4-2.sdl7.noarch.rpm
wget -q http://springdale.math.ias.edu/data/puias/unsupported/7/x86_64/python-dnf-0.6.4-2.sdl7.noarch.rpm
yum install python-dnf-0.6.4-2.sdl7.noarch.rpm  dnf-0.6.4-2.sdl7.noarch.rpm dnf-conf-0.6.4-2.sdl7.noarch.rpm
rpm --import "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xD6BC243565B2087BC3F897C9277A7293F59E4889"
curl -L -o /etc/yum.repos.d/miktex.repo https://miktex.org/download/centos/8/miktex.repo
dnf update
dnf install miktex
miktexsetup finish
initexmf --set-config-value [MPM]AutoInstall=1
echo "Checking MiKTeX installation..."
luatex --version
echo "Installing Poppler-utils..."
yum install poppler-utils -y
echo "Checking Poppler-utils installation..."
pdftocairo -v
echo "Generating website..."
npm run generate
echo "Done !"
