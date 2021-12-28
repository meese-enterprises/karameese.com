const Messaging = () => {

apps.messaging = new Application({
	title: "Messaging",
	abbreviation: "MSG",
	codeName: "messaging",
	image: {
		backgroundColor: "#303947",
		foreground: "smarticons/messaging/fg.png",
		backgroundBorder: {
			thickness: 2,
			color: "#252F3A"
		}
	},
	hideApp: 0,
	launchTypes: 1,
	main: function (launchType) {
		if (!this.appWindow.appIcon) {
			this.appWindow.paddingMode(0);
			this.vars.lastUserRecieved = '';
			this.appWindow.setDims("auto", "auto", 800, 500);
		}
		this.appWindow.setCaption('Messaging');
		if (launchType === 'dsktp') {
			this.appWindow.setContent(
				'<div id="MSGdiv" style="width:100%;height:calc(100% - 52px);overflow-y:scroll;padding-top:32px;"></div>' +
				'<div class="noselect" style="left:0;top:0;background:#FFA;padding:2px;font-family:W95FA,monospace;font-size:12px;border-bottom-right-radius:5px;color:#000;">' + this.vars.discussionTopic + '</div>' +
				'<button style="position:absolute;bottom:0;height:24px;width:10%;" onclick="apps.messaging.vars.doSettings()">Settings</button>' +
				'<button style="position:absolute;bottom:0;height:24px;width:10%;left:10%;" onclick="apps.messaging.vars.doFormatting()">Formatting</button>' +
				'<input id="MSGinput" style="position:absolute;height:21px;width:70%;bottom:0;left:20%;border:none;border-top:1px solid ' + darkSwitch('#000', '#FFF') + ';font-family:sans-serif">' +
				'<button onclick="apps.messaging.vars.sendMessage()" style="position:absolute;right:0;bottom:0;width:10%;height:24px">Send</button>');
			this.vars.lastMsgRecieved = this.vars.lastMsgStart;
			getId('MSGinput').setAttribute('onkeyup', 'if(event.keyCode === 13){apps.messaging.vars.sendMessage();}');
		}
		this.appWindow.openWindow();
		this.vars.requestMessage();
	},
	vars: {
		appInfo: 'The official AaronOS Messenger. Chat with the entire aOS community, all at once.<br><br>To set your name, go to Settings > 1, and enter a chat name.<br><br>To view past messages, go to Settings > 2, and enter in the number of past messages you wish to view.',
		lastMsgRecieved: '-9',
		nameTemp: 'Anonymous',
		name: 'Anonymous',
		xhttpDelay: 0,
		messageTemp: '',
		message: '',
		lastSetIn: '',
		lastMsgStart: '-9',
		doFormatting: function() {
			tempStr = '';
			for (var i in apps.messaging.vars.objTypes) {
				tempStr += '<br><br><br><br><span style="background:rgba(127, 127, 127, 0.5);padding:3px;border-radius:3px;">[' + i + ']</span><br><br>' +
					(apps.messaging.vars.objDesc[i] || 'No description.') + '<br><br>Example:<br><br>' +
					'<span style="background:rgba(127, 127, 127, 0.5);padding:3px;border-radius:3px;">' + (apps.messaging.vars.objExamp[i] || 'No examples.') +
					'</span><br><br>' + apps.messaging.vars.parseBB(apps.messaging.vars.objExamp[i] || '');
			}
			apps.prompt.vars.alert('Here are all the installed formatting tools:' + tempStr, 'Okay', function() {}, 'Messaging');
		},
		doSettings: function() {
			apps.prompt.vars.confirm('Choose a settings option below.', ['Cancel', 'Change Chat Name', 'Load Past Messages'], function (txtIn) {
				apps.messaging.vars.lastSetIn = txtIn;
				switch (apps.messaging.vars.lastSetIn) {
					case 1:
						apps.prompt.vars.prompt('Please enter a Chatname.<br>Default is Anonymous<br>Current is ' + apps.messaging.vars.name, 'Submit', function (txtIN) {
							apps.messaging.vars.nameTemp = txtIN;
							if (apps.messaging.vars.nameTemp.length > 30 && apps.messaging.vars.nameTemp.length < 3) {
								apps.prompt.vars.alert('Your name cannot be more than 30 or less than 3 characters long.', 'Okay', function() {}, 'Messaging');
							} else if (apps.messaging.vars.nameTemp.toUpperCase().indexOf('{ADMIN}') > -1) {
								apps.prompt.vars.alert('Sorry, admins can only be set manually. Please ask an administrator.', 'Okay', function() {}, 'Messaging');
							} else {
								apps.messaging.vars.name = apps.messaging.vars.nameTemp;
								apps.savemaster.vars.save('aos_system/apps/messaging/chat_name', apps.messaging.vars.name, 1, 'mUname', '');
							}
						}, 'Messaging');
						break;
					case 2:
						apps.prompt.vars.prompt('Load the last x messages.<br>Default when opening is 10.<br>Make it a positive integer.<br>This will restart the Messaging app.', 'Submit', function (subNum) {
							apps.messaging.vars.lastMsgStart = "-" + subNum;
							apps.messaging.appWindow.closeWindow();
							openapp(apps.messaging, 'dsktp');
						}, 'Messaging');
						break;
					default:
						doLog('Messaging settings change cancelled');
				}
			}, 'Messaging');
		},
		xhttp: {},
		sendhttp: {},
		sendfd: {},
		lastMessage: '',
		lastMessageTime: 0,
		sendMessage: function() {
			this.messageTemp = getId("MSGinput").value;
			if (this.messageTemp === this.lastMessage) {
				apps.prompt.vars.notify('Please don\'t send the same message twice in a row.', ['Okay'], function (btn) {}, 'Messaging', 'appicons/ds/MSG.png');
				getId('MSGinput').value = '';
			} else if (performance.now() - this.lastMessageTime < 3000) {
				apps.prompt.vars.notify('Please wait at least 3 seconds between messages.', ['Okay'], function (btn) {}, 'Messaging', 'appicons/ds/MSG.png');
			} else {
				this.lastMessage = this.messageTemp;
				if (this.messageTemp.length !== 0) {
					this.sendhttp = new XMLHttpRequest();
					this.sendfd = new FormData();
					this.sendfd.append('c', this.lastMessage);
					this.sendhttp.open('POST', 'messager.php');
					this.sendhttp.onreadystatechange = function() {
						if (apps.messaging.vars.sendhttp.readyState !== 4) return;
						if (apps.messaging.vars.sendhttp.status === 200) {
							if (apps.messaging.vars.sendhttp.responseText === 'Error - Password incorrect.') {
								apps.prompt.vars.alert('Could not send message. Your password is incorrect.<br><br>If you recently set a new password, try to reset aOS and see if that fixes the issue. If the issue persists, please contact the developer via email.', 'Okay.', function() {}, 'Messaging');
							} else if (apps.messaging.vars.sendhttp.responseText.indexOf('Error - ') === 0) {
								apps.prompt.vars.alert('Error sending message:<br><br>' + apps.messaging.vars.sendhttp.responseText, 'Okay.', function() {}, 'Messaging');
							}
						} else {
							apps.prompt.vars.alert('Could not send message. Network error code ' + apps.messaging.vars.sendhttp.status + '.<br><br>Try again in a minute or so. If it still doesn\'t work, contact the developer via the  email.', 'Okay.', function() {}, 'Messaging');
						}
					}
					this.sendhttp.send(this.sendfd);
					getId("MSGinput").value = "";
				}
			}
			this.lastMessageTime = performance.now();
		},
		lastResponseObject: {},
		lastUserRecieved: '',
		needsScroll: false,
		notifPing: new Audio('messagingSounds/messagePing.wav'),
		objTypes: {
			img: function (str, param) {
				return '<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="' + str + '">';
			},
			url: function (str, param) {
				if (str.indexOf('http://') !== 0 && str.indexOf('https://') !== 0 && str.indexOf('/') !== 0) {
					str = 'https://' + encodeURI(str);
				}
				return '<a target="_blank" href="' + str + '">' + str + '</a>';
			},
			b: function (str, param) {
				return '<b>' + str + '</b>';
			},
			i: function (str, param) {
				return '<i>' + str + '</i>';
			},
			u: function (str, param) {
				return '<u>' + str + '</u>';
			},
			br: function (param) {
				return '<br>';
			},
			hr: function (param) {
				return '<hr>';
			},
			font: function (str, param) {
				if (param) {
					return '<span style="font-family:' + param.split(';')[0] + ', monospace;">' + str + '</span>';
				} else {
					var strComma = str.indexOf(',');
					var strCommaSpace = str.indexOf(', ');
					var strSplit = '';
					if (strComma > -1) {
						if (strCommaSpace === strComma) {
							strSplit = str.split(', ');
							return '<span style="font-family:' + strSplit.shift().split(';')[0] + ', monospace;">' + strSplit.join(', ') + '</span>';
						} else {
							strSplit = str.split(',');
							return '<span style="font-family:' + strSplit.shift().split(';')[0] + ', monospace;">' + strSplit.join(',') + '</span>';
						}
					} else {
						return '[font]' + str + '[/font]';
					}
				}
			},
			color: function (str, param) {
				if (param) {
					return '<span style="color:' + param.split(';')[0] + ';">' + str + '</span>';
				} else {
					var strComma = str.indexOf(',');
					var strCommaSpace = str.indexOf(', ');
					var strSplit = '';
					if (strComma > -1) {
						if (strCommaSpace === strComma) {
							strSplit = str.split(', ');
							return '<span style="color:' + strSplit.shift().split(';')[0] + ';">' + strSplit.join(', ') + '</span>';
						} else {
							strSplit = str.split(',');
							return '<span style="color:' + strSplit.shift().split(';')[0] + ';">' + strSplit.join(',') + '</span>';
						}
					} else {
						return '[color]' + str + '[/color]';
					}
				}
			},
			marquee: function (str) {
				return buildMarquee(cleanStr(str));
			},
			glow: function (str, param) {
				if (param) {
					return '<span style="text-shadow:0 0 5px ' + param.split(';')[0].split(' ').join('') + ';">' + str + '</span>';
				} else {
					var strComma = str.indexOf(',');
					var strCommaSpace = str.indexOf(', ');
					var strSplit = '';
					if (strComma > -1) {
						if (strCommaSpace === strComma) {
							strSplit = str.split(', ');
							return '<span style="text-shadow:0 0 5px ' + strSplit.shift().split(';')[0].split(' ').join('') + ';">' + strSplit.join(', ') + '</span>';
						} else {
							strSplit = str.split(',');
							return '<span style="text-shadow:0 0 5px ' + strSplit.shift().split(';')[0].split(' ').join('') + ';">' + strSplit.join(',') + '</span>';
						}
					} else {
						return '[glow]' + str + '[/glow]';
					}
				}
			},
			outline: function (str, param) {
				if (param) {
					return '<span style="text-shadow:1px 0 0 ' + param.split(';')[0].split(' ').join('') + ', -1px 0 0 ' + param.split(';')[0].split(' ').join('') + ', 0 1px 0 ' + param.split(';')[0].split(' ').join('') + ', 0 -1px 0 ' + param.split(';')[0].split(' ').join('') + ';">' + str + '</span>';
				} else {
					var strComma = str.indexOf(',');
					var strCommaSpace = str.indexOf(', ');
					var strSplit = '';
					if (strComma > -1) {
						if (strCommaSpace === strComma) {
							strSplit = str.split(', ');
							strShift = strSplit.shift().split(';')[0].split(' ').join('');
							return '<span style="text-shadow:1px 0 0 ' + strShift + ', -1px 0 0 ' + strShift + ', 0 1px 0 ' + strShift + ', 0 -1px 0 ' + strShift + ';">' + strSplit.join(', ') + '</span>';
						} else {
							strSplit = str.split(',');
							strShift = strSplit.shift().split(';')[0].split(' ').join('');
							return '<span style="text-shadow:1px 0 0 ' + strShift + ', -1px 0 0 ' + strShift + ', 0 1px 0 ' + strShift + ', 0 -1px 0 ' + strShift + ';">' + strSplit.join(',') + '</span>';
						}
					} else {
						return '[outline]' + str + '[/outline]';
					}
				}
			},
			flip: function (str, param) {
				return '<div style="transform:rotate(180deg);display:inline-block;position:relative">' + str + '</div>';
			}
		},
		objSafe: {
			img: 0,
			url: 0,
			b: 1,
			i: 1,
			u: 1,
			br: 0,
			hr: 0,
			font: 1,
			color: 1,
			marquee: 1,
			glow: 1,
			outline: 1,
			flip: 1,
			//site: 0
		},
		objShort: {
			img: 0,
			url: 0,
			b: 0,
			i: 0,
			u: 0,
			br: 1,
			hr: 1,
			font: 0,
			color: 0,
			marquee: 0,
			glow: 0,
			outline: 0,
			flip: 0,
			//site: 0
		},
		objDesc: {
			img: 'Embed an image via URL.',
			url: 'Format your text as a clickable URL.',
			b: 'Format your text as bold.',
			i: 'Format your text as italics.',
			u: 'Format your text as underlined.',
			br: 'Insert a line break.',
			hr: 'Insert a horizontal line.',
			font: 'Format your text with a font.',
			color: 'Format your text with a color.',
			marquee: 'Format your text to scroll as a marquee.',
			glow: 'Format your text with a colorful glow.',
			outline: 'Format your text with an outline.',
			flip: 'Flip your text upside-down.',
			//site: 'Embed a website via URL'
		},
		objExamp: {
			img: '[img]https://aaronos.dev/AaronOS/appicons/aOS.png[/img]',
			url: '[url]https://duckduckgo.com[/url]',
			b: '[b]This is bold text.[/b]',
			i: '[i]This is italic text.[/i]',
			u: '[u]This is underlined text.[/u]',
			br: 'Hello[br]World',
			hr: 'Hello[hr]World',
			font: '[font=Comic Sans MS]This text has a custom font.[/font]',
			color: '[color=red]This is red text via name.[/color]<br><br>[color=#00AA00]This is green text via hex.[/color]',
			marquee: '[marquee]This is scrolling marquee text.[/marquee]',
			glow: '[glow=red]This is glowy red text.[/glow]',
			outline: '[outline=red]This is red outlined text.[/outline]',
			flip: '[flip]This is upside-down text.[/flip]',
			//site: '[site]https://bing.com[/site]'
		},
		parseBB: function (text, safe) {
			var tempIn = text;
			var tempPointer = tempIn.length - 6;
			while (tempPointer >= 0) {
				var nextObj = tempIn.indexOf('[', tempPointer);
				if (nextObj > -1) {
					var nextEnd = tempIn.indexOf(']', nextObj);
					if (nextEnd > -1) {
						var nextType = tempIn.toLowerCase().substring(nextObj + 1, nextEnd);
						var nextParam = 0;
						if (nextType.indexOf('=') > -1) {
							nextParam = nextType.split('=');
							nextType = nextParam.shift();
							nextParam = nextParam.join('=');
						}
						if (this.objTypes[nextType]) {
							if (this.objShort[nextType]) {
								if (!(safe && !this.objSafe[nextType])) {
									var newStr = this.objTypes[nextType](nextParam);
									tempIn = tempIn.substring(0, nextObj) + newStr + tempIn.substring(nextObj + 2 + nextType.length, tempIn.length);
								}
							} else {
								var nextClose = tempIn.toLowerCase().indexOf('[/' + nextType + ']', nextEnd);
								if (nextClose > -1) {
									if (!(safe && !this.objSafe[nextType])) {
										var replaceStr = tempIn.substring(nextEnd + 1, nextClose);
										var newStr = this.objTypes[nextType](replaceStr, nextParam);
										tempIn = tempIn.substring(0, nextObj) + newStr + tempIn.substring(nextClose + 3 + nextType.length, tempIn.length);
									}
								}
							}
						}
					}
				}
				tempPointer--;
			}
			return tempIn;
		},
		lastRecievedDate: "",
		lastRecievedTime: "",
		nextMessage: function (text) {
			m('reading from messaging server');
			if (text[0] === '{') {
				d(2, 'Recieving message');
				this.lastResponseText = text;
				this.lastResponseObject = JSON.parse(this.lastResponseText);
				this.lastMsgRecieved = this.lastResponseObject.l;
				this.needsScroll = (getId('MSGdiv').scrollTop + 600 >= getId('MSGdiv').scrollHeight);
				if (this.lastResponseObject.t) {
					var tempAddStr = "";
					if (this.lastResponseObject.n !== this.lastUserRecieved) {
						if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
							tempAddStr += '<div style="color:#0A0; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.parseBB(this.lastResponseObject.n, 1) + ' <span style="color:transparent">' + this.lastResponseObject.l + '</span></div>';
							tempAddStr += '<div style="max-height:60%; overflow-y:auto; background-color:#CEA; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
							if (this.lastResponseObject.t !== this.lastRecievedTime) {
								tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:W95FA,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
							}
							if (String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate) {
								tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:W95FA,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
							}
							tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
							getId('MSGdiv').innerHTML += tempAddStr;
						} else {
							tempAddStr += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.parseBB(this.lastResponseObject.n, 1) + ' <span style="color:transparent">' + this.lastResponseObject.l + '</span></div>';
							tempAddStr += '<div style="max-height:60%; overflow-y:auto; background-color:#ACE; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
							if (this.lastResponseObject.t !== this.lastRecievedTime) {
								tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:W95FA,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
							}
							if (String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate) {
								tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:W95FA,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
							}
							tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
							getId("MSGdiv").innerHTML += tempAddStr;
						}
					} else {
						getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:2px;"></div>';
						if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
							tempAddStr += '<div style="max-height:60%; overflow-y:auto; background-color:#CEA; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
							if (this.lastResponseObject.t !== this.lastRecievedTime) {
								tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:W95FA,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
							}
							if (String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate) {
								tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:W95FA,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
							}
							tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
							getId("MSGdiv").innerHTML += tempAddStr;
						} else {
							tempAddStr += '<div style="max-height:60%; overflow-y:auto; background-color:#ACE; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
							if (this.lastResponseObject.t !== this.lastRecievedTime) {
								tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:W95FA,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
							}
							if (String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate) {
								tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:W95FA,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
							}
							tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
							getId("MSGdiv").innerHTML += tempAddStr;
						}
					}
					this.lastRecievedDate = String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ');
					this.lastRecievedTime = this.lastResponseObject.t;
				} else {
					if (this.lastResponseObject.n !== this.lastUserRecieved) {
						if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
							getId('MSGdiv').innerHTML += '<div style="color:#0A0; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.lastResponseObject.n + '</div>';
							getId('MSGdiv').innerHTML += '<div style="max-height:60%; overflow-y:auto; background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
						} else {
							getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.lastResponseObject.n + '</div>';
							getId('MSGdiv').innerHTML += '<div style="max-height:60%; overflow-y:auto; background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
						}
					} else {
						getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:2px;"></div>';
						if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
							getId('MSGdiv').innerHTML += '<div style="max-height:60%; overflow-y:auto; background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
						} else {
							getId('MSGdiv').innerHTML += '<div style="max-height:60%; overflow-y:auto; background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
						}
					}
				}
				this.lastUserRecieved = this.lastResponseObject.n;
				if (this.needsScroll) {
					getId('MSGdiv').scrollTop = getId('MSGdiv').scrollHeight;
				}
				if (!document.hasFocus() || getId('win_messaging_top').style.display === 'none') {
					this.notifPing.play();
					if (getId('win_messaging_top').style.display === 'none') {
						apps.prompt.vars.notify(apps.messaging.vars.parseBB(this.lastResponseObject.n, 1) + ' said:<br><br>' + this.parseBB(this.lastResponseObject.c),
							['Show App', 'Dismiss'],
							function (btn) {
								if (btn === 0) {
									openapp(apps.messaging, 'tskbr');
								}
							},
							'Messaging',
							'appicons/ds/MSG.png'
						);
					}
				}
				apps.messaging.vars.xhttpDelay = window.setTimeout('apps.messaging.vars.requestMessage()', 10);
			} else {
				apps.messaging.vars.xhttpDelay = window.setTimeout('apps.messaging.vars.requestMessage()', 1000);
			}
		},
		lastResponseTime: 0,
		requestMessage: function() {
			this.xhttp = new XMLHttpRequest();
			this.xhttp.onreadystatechange = function() {
				if (apps.messaging.vars.xhttp.readyState === 4) {
					apps.savemaster.vars.saving = 0;
					taskbarShowHardware();
					if (apps.messaging.vars.xhttp.status === 200) {
						apps.messaging.vars.lastResponseTime = perfCheck('messagingServer');
						if (apps.messaging.appWindow.appIcon) {
							apps.messaging.vars.nextMessage(apps.messaging.vars.xhttp.responseText);
						}
					} else {
						apps.prompt.vars.notify('Connection to messaging server lost.', [], function() {}, 'Messaging Error', 'appicons/ds/MSG.png');
					}
				}
			};
			this.xhttp.open("GET", "messaging.php?l=" + this.lastMsgRecieved, true);
			perfStart('messagingServer');
			this.xhttp.send();
			apps.savemaster.vars.saving = 3;
			taskbarShowHardware();
		}
	},
	signalHandler: function (signal) {
		switch (signal) {
			case "forceclose":
				this.appWindow.closeWindow();
				this.appWindow.closeIcon();
				break;
			case "close":
				this.appWindow.closeWindow();
				setTimeout(function() {
					if (getId("win_" + this.objName + "_top").style.opacity === "0") {
						this.appWindow.setContent("");
					}
				}.bind(this), 300);
				break;
			case "checkrunning":
				if (this.appWindow.appIcon) {
					return 1;
				} else {
					return 0;
				}
				case "shrink":
					this.appWindow.closeKeepTask();
					break;
				case "USERFILES_DONE":
					if (ufload("aos_system/apps/messaging/chat_name")) {
						apps.messaging.vars.name = ufload("aos_system/apps/messaging/chat_name");
					}
					break;
				case 'shutdown':

					break;
				default:
					doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
		}
	}
});

} // End initial variable declaration