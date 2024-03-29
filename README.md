# karameese.com

[![DeepSource](https://deepsource.io/gh/meese-enterprises/karameese.com.svg/?label=active+issues&show_trend=true&token=M8yOCSSOgVKka2ykMLzNJ_mK)](https://deepsource.io/gh/meese-enterprises/karameese.com/?ref=repository-badge)

## Information

KaraOS is a highly modified fork of the awesome work of [AaronOS](https://github.com/MineAndCraft12/AaronOS) by [Aaron Adams](https://github.com/MineAndCraft12). This project does not make any claims of ownership over the base aOS code, only the modifications which have since been made. You may see the AaronOS EULA [here](./AaronOS-eula.txt).

## Setup

### PHP Setup

- `sudo chmod -R 777 /var/lib/jenkins/workspace/karameese.com` to grant access to PHP and Node

### `localhost` server setup

1. Symlink `/var/www` to the directory of the repository.

- `sudo ln -s ~/Documents/karameese.com /var/www/karameese.com`

2. Allow access to the site root.

- `sudo chmod -R 777 /var/www/karameese.com`

3. Configure Apache2 to serve karameese.com

- `sudo cp ./apache.conf /etc/apache2/sites-available/karameese.com.conf`
- `sudo cp ./alias.conf /etc/apache2/mods-available/alias.conf`
  - Removes the alias of our icons folder to a different, undesired location.
- `sudo a2dissite 000-default.conf`
- `sudo a2ensite karameese.com.conf`
- `sudo a2enmod rewrite`
- `sudo service apache2 restart`
- Confirm it worked with `a2query -s`

4. Visit the site by opening `http://localhost`

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

<!--

IDEAS:
- https://codepen.io/Jintos/pen/OJKodm : Beautiful examples of background-clip text
- https://codepen.io/herve/pen/PoReNR : Image moving behind text
- https://codepen.io/animationbro/pen/QWbpqwR : Clouds animation; could be used to part clouds on the loading screen
- https://codepen.io/nashvail/pen/wpGgXO : Random balls of color moving around in the background
- https://codepen.io/naomihauret/pen/qmjMjB : Animated large background text
- https://codepen.io/Sepion/pen/ZQJyeq : Subtle moving lines background
- https://codepen.io/fronthendrik/pen/mvgJbW : Infinitely scrolling tiled image background

-->
