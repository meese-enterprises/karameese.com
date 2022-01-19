#!/bin/bash

# Install PHP
sudo apt install apt-transport-https lsb-release ca-certificates wget -y
sudo wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg 
sudo sh -c 'echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list'
sudo apt update
sudo apt install php8.0-common php8.0-cli php8.0-fpm -y

# Install nvm for Node installation versioning
if command -v nvm -ne "nvm";
then
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
fi

# Attempt to make nvm available to shell:
# https://stackoverflow.com/a/23757895/6456163
export NVM_DIR=$HOME/.nvm;
. $NVM_DIR/nvm.sh;

# Install Node 12.x and yarn
nvm install 12
sudo npm install -g yarn

# Install python2 for compatibility
sudo apt-get install -y python2 build-essential gcc g++ make libkrb5-dev libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Set up old site app
cd old-site || exit 1
yarn install
yarn run build