#!/bin/bash

# Install PHP
sudo apt install -y apt-transport-https lsb-release ca-certificates wget
sudo wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
sudo sh -c 'echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list'
sudo apt update
sudo apt install -y php8.0-common php8.0-cli php8.0-fpm

# Install Composer
# https://github.com/composer/composer/issues/9097#issuecomment-848900881
sudo apt install -y wget php-cli php-zip unzip
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
HASH="$(wget -q -O - https://composer.github.io/installer.sig)"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm composer-setup.php

# Install nvm for Node installation versioning
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Attempt to make nvm available to shell:
# https://stackoverflow.com/a/23757895/6456163
export NVM_DIR="$HOME/.nvm"
. $NVM_DIR/nvm.sh;

# Install Node 12.x and yarn
nvm install 12
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm install -g yarn

# Install python2 for compatibility
sudo apt install -y python2 build-essential gcc g++ make libkrb5-dev \
	libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Set up old site app
cd old-site || exit 1
yarn install
yarn run build
