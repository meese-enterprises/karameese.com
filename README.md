# karameese.com
Kara Meese's personal website codebase.

[![Netlify Status](https://api.netlify.com/api/v1/badges/dcf3bef2-ca38-415e-8bee-bf8f873a8168/deploy-status)](https://app.netlify.com/sites/karameese/deploys)

This project has been modified from [this repository](https://github.com/chetanverma16/react-portfolio-template),
it is not my original work.

### IDEAs
- Add a dark mode slider with [this](https://github.com/chetanverma16/react-portfolio-template/pull/15)
- "Contact Me" form at the bottom of the site, that will be directed into an email

## Prerequisites
Make sure you have PHP and a webserver like Apache or Nginx. You can install them by running the following in your terminal:

```sudo apt install -y Apache2 php```

## Actually doing it
Note that this guide is for Ubuntu only, if you are using something else then only use this guide as a general outline

First open the ports

```sudo ufw allow "Apache Full"```

Make sure you are in the right directory, than download the aOS files

```
cd
git clone https://github.com/MineAndCraft12/AaronOS
```
Copy into the correct folder

```sudo cp -r AaronOS/* /var/www/html/```

Give ownership of directory to Apache and let Apache write to it

``` 
sudo chown -R www-data /var/www/
sudo chmod -R 755 /var/www/html
```

The main PHP file is /index.php

The main JavaScript file is /main.js

The main CSS file is /styleBeta.css
