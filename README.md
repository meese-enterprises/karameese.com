# karameese.com

[![DeepSource](https://deepsource.io/gh/ajmeese7/karameese.com.svg/?label=active+issues&show_trend=true&token=M8yOCSSOgVKka2ykMLzNJ_mK)](https://deepsource.io/gh/ajmeese7/karameese.com/?ref=repository-badge)

## Setup
### PHP Setup
- Install PHP with ...
- `sudo nano /etc/php/8.0/fpm/php.ini` to turn on `display_errors` and `display_startup_errors`
  - `Ctrl+w` to search for `display_errors`
  - `sudo service php8.0-fpm restart` to restart the service
  - `sudo systemctl enable php8.0-fpm` to enable the service at boot
  - `sudo chmod -R 0777 /var/lib/jenkins/workspace/karameese.com` to grant access to PHP and Node

### Email Setup
Add `contactform@karameese.com` to your email contacts, so the messages won't be filtered out as spam.

### Jenkins Setup
1. Install Jenkins

```shell
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins
```

2. Enable Jenkins to run on startup with `sudo systemctl enable jenkins`
3. Allow Jenkins through your firewall with `sudo ufw allow 8083` or whatever port you're using
4. Refresh the firewall with `sudo ufw reload`
5. Change `/etc/sudoers` to include `jenkins ALL=(ALL) NOPASSWD: ALL` beneath "User privilege specification".
6. Copy `config.xml` to `/var/lib/jenkins/jobs/karameese.com` to automatically configure Jenkins.

#### Run Jenkins on a Custom Port
1. `sudo nano /etc/default/jenkins`
2. Scroll down until you find the following line:

```
HTTP_PORT=8080
```

3. Change the variable value to your port of choice
4. Restart Jenkins with `sudo systemctl restart jenkins`

### `localhost` server setup
On Windows I prefer to use the Ubuntu WSL2 distro with apache2 to serve my server, which I do by creating
a symlink in `/var/www` to the directory of the repository on Windows.
