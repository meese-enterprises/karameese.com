# karameese.com

## Setup

1. PHP Setup

- `sudo nano /etc/php/8.0/fpm/php.ini` to turn on `display_errors` and `display_startup_errors`
  - `Ctrl+w` to search for `display_errors`
  - `sudo service php8.0-fpm restart` to restart the service
  - `sudo systemctl enable php8.0-fpm` to enable the service at boot
  - `sudo chmod -R 0777 /var/lib/jenkins/workspace/karameese.com` to grant access to PHP and Node

2. Email Setup

- Add `contactform@karameese.com` to your email contacts, so the messages won't be filtered out as spam.

3. Jenkins Setup
   Change `/etc/sudoers` to include `jenkins ALL=(ALL) NOPASSWD: ALL` beneath "User privilege specification".

Copy `config.xml` to `/var/lib/jenkins/jobs/karameese.com` to automatically configure Jenkins.
