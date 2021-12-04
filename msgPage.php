<!DOCTYPE html>
<html>
	<head>
		<title>aOS Messenger</title>
		<style>
			::-webkit-scrollbar {
					width:16px;
					background-color:#557;
					box-shadow:inset 0 0 10px #AAC;
			}
			::-webkit-scrollbar-corner {
					background-color:#557;
					box-shadow:inset 0 0 10px #AAC;
			}
			::-webkit-resizer {
					border-radius:8px;
					background-color:#AAC;
					box-shadow:inset 0 0 10px #557;
			}
			::-webkit-scrollbar-thumb {
					border-radius:8px;
					background-color:#AAC;
					box-shadow:inset 0 0 10px #557;
			}
			::-webkit-scrollbar-button {
					border-radius:8px;
					background-color:#AAC;
					box-shadow:inset 0 0 10px #557;
			}
			button {
				background-color:#FFF;
				box-shadow:inset 0 0 5px #CCC;
				border-radius:5px;
				color:#333;
				border:1px solid #333;
				outline:none;
				transition:0.2s;
				cursor:inherit;
			}
			button:hover {
				box-shadow:inset 0 0 5px #AAA;
			}
			button:focus {
				box-shadow:inset 0 0 5px #999;
			}
			button:active {
				box-shadow:inset 0 0 10px #999;
			}
			input, textarea {
				background-color:#FFF;
				border:1px solid #333;
				border-radius:0;
				color:#333;
				box-shadow:inset 0 0 5px #CCC;
				outline:none;
				transition:0.2s;
			}
			input:hover, textarea:hover {
				box-shadow:inset 0 0 5px #AAA;
			}
			input:focus, textarea:focus {
				box-shadow:inset 0 0 5px #999;
			}
			input:active, textarea:active {
				box-shadow:inset 0 0 10px #999;
			}
			hr {
				width:100%;
				height:2px;
				border:none;
				background-image:url(images/hr.png);
				background-size:100% 2px;
			}
			a {
				cursor:url(cursors/beta/pointer.png) 20 4, pointer;
			}
			html, #pagebody {
				width:100%;
				height:100%;
				padding:0;
				margin:0;
			}
			div {
				position:absolute;
				overflow:hidden;
			}
			#winMSGh {
				width:100%;
				height:100%;
			}
			#MSGdiv .MSGdivGrowPic {
				position:fixed;
				left:5%;
				top:5%;
				max-width:90% !important;
				max-height:90% !important;
				box-shadow:0 0 20px #000;
				padding-left:0 !important;
				padding-right:0 !important;
				z-index:999;
			}
			#MSGdiv .MSGdivGrowPicParent{
				overflow:visible;
			}
		</style>
	</head>

	<body id="pagebody">
		<div id="winMSGh"></div>
	</body>

	<script defer>
			function getId(target){
				return document.getElementById(target);
			}
			
			var apps = {};
			apps.messaging = {
				main: function(launchType){
					this.vars.lastUserRecieved = '';
					if (launchType === 'dsktp') {
						getId('winMSGh').innerHTML = '<div id="MSGdiv" style="width:100%;height:calc(100% - 24px);overflow-y:scroll;"></div><div style="left:0;top:0;background:#FFA;padding:2px;font-family:aosProFont,monospace;font-size:12px;border-bottom-right-radius:5px;">' + this.vars.discussionTopic + '</div><button style="position:absolute;bottom:0;height:24px;width:10%;" onclick="apps.messaging.vars.doSettings()">Past Messages</button><input id="MSGinput" style="position:absolute;height:21px;width:80%;bottom:0;left:10%;border:none;border-top:1px solid black;text-align:center;font-family:monospace"><button onclick="apps.messaging.vars.sendMessage()" style="position:absolute;right:0;bottom:0;width:10%;height:24px">Send</button>';
						this.vars.lastMsgRecieved = this.vars.lastMsgStart;
						getId('MSGinput').setAttribute('onkeyup', 'if(event.keyCode === 13){apps.messaging.vars.sendMessage();}');
					}
					
					this.vars.recieveMessage();
				},
				vars: {
					discussionTopic: 'AaronOS is on Discord! <a href="https://discord.gg/Y5Jytdm" target="_blank">https://discord.gg/Y5Jytdm</a>',
					lastMsgRecieved: '-9',
					nameTemp: 'Anonymous',
					name: 'Anonymous',
					xhttpDelay: 0,
					messageTemp: '',
					message: '',
					lastSetIn: '',
					lastMsgStart: '-9',
					doSettings: function(){
						var numMessages = prompt("How many messages?");
						apps.messaging.vars.lastMsgStart = "-" + numMessages;
						apps.messaging.main('dsktp');
					},
					xhttp: {},
					sendhttp: {},
					sendfd: {},
					lastMessage: '',
					lastMessageTime: 0,
					sendMessage: function() {
						this.messageTemp = getId("MSGinput").value;
						if (this.messageTemp === this.lastMessage) {
							alert("Please don't send the same message twice in a row.");
							getId('MSGinput').value = '';
						} else if (window.performance.now() - this.lastMessageTime < 3000) {
							alert("Please wait at least 3 seconds between messages.");
						} else {
							this.lastMessage = this.messageTemp;
							if (this.messageTemp.length !== 0) {
								this.sendhttp = new XMLHttpRequest();
								this.sendfd = new FormData();
								this.sendfd.append('c', this.lastMessage);
								this.sendhttp.open('POST', '/messager.php');
								this.sendhttp.onreadystatechange = function(){
									if (apps.messaging.vars.sendhttp.readyState === 4) {
										if (apps.messaging.vars.sendhttp.status === 200) {
											if (apps.messaging.vars.sendhttp.responseText === 'Error - Password incorrect.') {
												alert('Could not send message. Your password is incorrect.<br><br>If you recently set a new password, try to reset aOS and see if that fixes the issue. If the issue persists, please contact the developer via the Discord server or email.');
											} else if(apps.messaging.vars.sendhttp.responseText.indexOf('Error - ') === 0){
												alert('Error sending message:<br><br>' + apps.messaging.vars.sendhttp.responseText);
											}
										} else {
											alert('Could not send message. Network error code ' + apps.messaging.vars.sendhttp.status + '.<br><br>Try again in a minute or so. If it still doesn\'t work, contact the developer via the Discord server or email.');
										}
									}
								};

								this.sendhttp.send(this.sendfd);
								getId("MSGinput").value = "";
							}
						}
						this.lastMessageTime = window.performance.now();
					},
					lastResponseObject: {},
					lastUserRecieved: '',
					needsScroll: false,
					notifPing: new Audio('messagingSounds/messagePing.wav'),
					notifMessage: new Audio('messagingSounds/lookethOverThere.wav'),
					notifClick: new Audio('messagingSounds/madestThouLook.wav'),
					soundToPlay: 0,
					canLookethOverThereSound: 0,
					nextMessage: function(text){
							if (text[0] === '{') {
									this.lastResponseText = text;
									this.lastResponseObject = JSON.parse(this.lastResponseText);
									this.lastMsgRecieved = this.lastResponseObject.l;
									this.needsScroll = (getId('MSGdiv').scrollTop + window.innerHeight + 200 >= getId('MSGdiv').scrollHeight);
									if (this.lastResponseObject.t) {
										if (this.lastResponseObject.n !== this.lastUserRecieved) {
											if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
												getId('MSGdiv').innerHTML += '<div style="color:#0A0; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace; text-align:right">' + this.lastResponseObject.n + '</div>';
												getId('MSGdiv').innerHTML += '<div style="background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;"><div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div><div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '</div>' + this.lastResponseObject.c // contd on next line
													.split('[img]').join('<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="').split('[/img]').join('">')
													.split('[b]').join('<b>').split('[/b]').join('</b>')
													.split('[i]').join('<i>').split('[/i]').join('</i>')
													.split('[u]').join('<u>').split('[/u]').join('</u>')
													.split('[IMG]').join('<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="').split('[/IMG]').join('">')
													.split('[B]').join('<b>').split('[/B]').join('</b>')
													.split('[I]').join('<i>').split('[/I]').join('</i>')
													.split('[U]').join('<u>').split('[/U]').join('</u>') + '</div>';
											} else {
												getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace; text-align:right">' + this.lastResponseObject.n + '</div>';
												getId('MSGdiv').innerHTML += '<div style="background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;"><div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div><div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '</div>' + this.lastResponseObject.c // contd on next line
													.split('[img]').join('<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="').split('[/img]').join('">')
													.split('[b]').join('<b>').split('[/b]').join('</b>')
													.split('[i]').join('<i>').split('[/i]').join('</i>')
													.split('[u]').join('<u>').split('[/u]').join('</u>')
													.split('[IMG]').join('<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="').split('[/IMG]').join('">')
													.split('[B]').join('<b>').split('[/B]').join('</b>')
													.split('[I]').join('<i>').split('[/I]').join('</i>')
													.split('[U]').join('<u>').split('[/U]').join('</u>') + '</div>';
											}
										} else {
											getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:2px;"></div>';
											if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
												getId('MSGdiv').innerHTML += '<div style="background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;"><div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div><div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '</div>' + this.lastResponseObject.c // contd on next line
													.split('[img]').join('<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="').split('[/img]').join('">')
													.split('[b]').join('<b>').split('[/b]').join('</b>')
													.split('[i]').join('<i>').split('[/i]').join('</i>')
													.split('[u]').join('<u>').split('[/u]').join('</u>')
													.split('[IMG]').join('<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="').split('[/IMG]').join('">')
													.split('[B]').join('<b>').split('[/B]').join('</b>')
													.split('[I]').join('<i>').split('[/I]').join('</i>')
													.split('[U]').join('<u>').split('[/U]').join('</u>') + '</div>';
											} else {
												getId('MSGdiv').innerHTML += '<div style="background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;"><div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div><div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '</div>' + this.lastResponseObject.c // contd on next line
													.split('[img]').join('<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="').split('[/img]').join('">')
													.split('[b]').join('<b>').split('[/b]').join('</b>')
													.split('[i]').join('<i>').split('[/i]').join('</i>')
													.split('[u]').join('<u>').split('[/u]').join('</u>')
													.split('[IMG]').join('<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="').split('[/IMG]').join('">')
													.split('[B]').join('<b>').split('[/B]').join('</b>')
													.split('[I]').join('<i>').split('[/I]').join('</i>')
													.split('[U]').join('<u>').split('[/U]').join('</u>') + '</div>';
											}
										}
									} else {
										if (this.lastResponseObject.n !== this.lastUserRecieved) {
											if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
												getId('MSGdiv').innerHTML += '<div style="color:#0A0; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace; text-align:right">' + this.lastResponseObject.n + '</div>';
												getId('MSGdiv').innerHTML += '<div style="background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
											} else {
												getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace; text-align:right">' + this.lastResponseObject.n + '</div>';
												getId('MSGdiv').innerHTML += '<div style="background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
											}
										} else {
											getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:2px;"></div>';
											if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
												getId('MSGdiv').innerHTML += '<div style="background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
											} else {
												getId('MSGdiv').innerHTML += '<div style="background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
											}
										}
									}

									this.lastUserRecieved = this.lastResponseObject.n;
									if (this.needsScroll){
										getId('MSGdiv').scrollTop = getId('MSGdiv').scrollHeight;
									}

									if (!document.hasFocus()) {
										this.notifPing.play();
									}

									apps.messaging.vars.xhttpDelay = window.setTimeout('apps.messaging.vars.recieveMessage()', 10);
							}else{
									apps.messaging.vars.xhttpDelay = window.setTimeout('apps.messaging.vars.recieveMessage()', 1000);
							}
					},
					lastResponseTime: 0,
					firstLoad: 1,
					recieveMessage: function() {
							if (apps.messaging.vars.firstLoad) {
									var msgPassword = prompt('Make sure you have logged into aOS before on this device, or you will be marked as an anonymous user.\n\nOnce you have logged in, enter your password below.\n\nIf your account doesn\'t have a password, leave this blank.');
									if (msgPassword) {
										document.cookie = 'password=' + msgPassword + "; Max-Age:315576000";
									}
									apps.messaging.vars.firstLoad = 0;
							}

							this.xhttp = new XMLHttpRequest();
							this.xhttp.onreadystatechange = function(){
								if (apps.messaging.vars.xhttp.readyState === 4) {
									if (apps.messaging.vars.xhttp.status === 200) {
										apps.messaging.vars.lastResponseTime = perfCheck('messagingServer');
										apps.messaging.vars.nextMessage(apps.messaging.vars.xhttp.responseText);
									} else {
										alert("Connection to messaging server lost.");
									}
								}
							};

							this.xhttp.open("GET", "messaging.php?l=" + this.lastMsgRecieved, true);
							perfStart('messagingServer');
							this.xhttp.send();
					}
				}
			};

			var perf = 0;
			function perfStart(){
				perf = window.performance.now();
				return Math.round(perf * 1000);
			}

			function perfCheck(){
				return Math.round(window.performance.now() - perf * 1000);
			}
			
			apps.messaging.main('dsktp');
	</script>
</html>