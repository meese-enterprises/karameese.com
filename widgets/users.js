const UsersWidget = () => {

widgets.users = new Widget(
	'Online Users',
	'users',
	function() {
		// TODO: GET THIS WORKING!!!
		widgetMenu('Online Users Widget', 'The list will update every 30 seconds.<br><br>Number of online users with this widget enabled: ' + makeLiveElement('widgets.users.vars.numberUsers') + '<br><br>' + makeLiveElement("widgets.users.vars.usersNames.join('<br>')"));
	},
	function() {
		widgets.users.vars.running = 1;
		getId('widget_users').style.lineHeight = '150%';
		getId('widget_users').style.paddingLeft = "6px";
		getId('widget_users').style.paddingRight = "6px";

		widgets.users.vars.xhttp = new XMLHttpRequest();
		widgets.users.vars.xhttp.onreadystatechange = function() {
			if (!widgets.users.vars.xhttp.readyState === 4) return;
			if (!widgets.users.vars.running) return;
			if (widgets.users.vars.xhttp.status === 200) {
				let userWidgetResponse = widgets.users.vars.xhttp.responseText.split('<br>');
				widgets.users.vars.numberUsers = userWidgetResponse.shift();
				widgets.users.vars.usersNames = userWidgetResponse;
				for (let i in widgets.users.vars.usersNames) {
					widgets.users.vars.usersNames[i] = apps.messaging.vars.parseBB(widgets.users.vars.usersNames[i], 1);
				}
				getId('widget_users').innerHTML = widgets.users.vars.numberUsers;
				setTimeout(widgets.users.frame, 30000);
			} else {
				widgets.users.vars.numberUsers = 0;
				widgets.users.vars.usersNames = ['Lost connection to AaronOS.'];
				getId('widget_users').innerHTML = "X";
				setTimeout(widgets.users.frame, 30000);
			}
		}

		widgets.users.vars.fd = new FormData();
		widgets.users.vars.fd.append('k', SRVRKEYWORD);
		widgets.users.frame();
	},
	function() {
		widgets.users.vars.xhttp.open('POST', 'onlineUsers.php');
		widgets.users.vars.xhttp.send(widgets.users.vars.fd);
	},
	function() {
		widgets.users.vars.running = 0;
	}, {
		running: 0,
		xhttp: {},
		fd: {},
		numberUsers: 0,
		usersNames: ''
	}
);

} // End initial variable declaration