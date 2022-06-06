#!/bin/bash

# TODO: Check to see if software is already installed and if so, skip installation

# Install PHP
sudo apt install -y apt-transport-https lsb-release ca-certificates wget php-zip unzip
sudo wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
sudo sh -c 'echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list'
sudo apt update
sudo apt install -y php8.1-common php8.1-cli php8.1-fpm php8.1-xml php8.1-curl
sudo systemctl enable php8.1-fpm

# Configure Apache to use PHP
sudo apt install libapache2-mod-php8.1
sudo a2enmod php8.1 proxy_fcgi setenvif
sudo a2enconf php8.1-fpm

# Make Apache use port 8080 since Nginx is already using port 80
sudo sed -i 's/Listen 80/Listen 8080/g' /etc/apache2/ports.conf
sudo sed -i 's/VirtualHost \*:80/VirtualHost \*:8080/g' /etc/apache2/sites-enabled/000-default.conf
sudo service apache2 restart

# To view any Nginx errors, run:
# cat /var/log/nginx/error.log

# Install Composer
# https://github.com/composer/composer/issues/9097#issuecomment-848900881
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
HASH="$(wget -q -O - https://composer.github.io/installer.sig)"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm composer-setup.php

# Install Composer packages
composer install

# Install Chrome/Gecko Driver and Chromium, just to be safe
sudo apt-get install chromium-chromedriver firefox-geckodriver

# Install latest Chrome Driver
CHROME_DRIVER_VERSION=`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`
wget -N "http://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip" -P ~/
unzip ~/chromedriver_linux64.zip -d ~/
rm ~/chromedriver_linux64.zip
sudo mv -f ~/chromedriver /usr/local/bin/chromedriver
sudo chown root:root /usr/local/bin/chromedriver
sudo chmod 0755 /usr/local/bin/chromedriver

# Detect Chromedrivers
vendor/bin/bdi detect drivers

# Install nvm for Node installation versioning
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Attempt to make nvm available to shell:
# https://stackoverflow.com/a/23757895/6456163
export NVM_DIR="$HOME/.nvm"
. $NVM_DIR/nvm.sh;

# Install Node 12.x and yarn
nvm install
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
