const StickyNote = () => {

apps.postit = new Application({
	title: "Sticky Note",
	abbreviation: "SNt",
	codeName: "postit",
	image: {
		backgroundColor: "#303947",
		foreground: "smarticons/postit/fg.png",
		backgroundBorder: {
			thickness: 2,
			color: "#252F3A"
		}
	},
	hideApp: 1,
	main: function() {
		const margins = 15;
		const width = 250;
		const height = 150;
		const x = parseInt(getId("desktop").style.width) - width - margins;
		
		this.appWindow.setCaption('Sticky Note');
		if (!this.appWindow.appIcon) {
			this.appWindow.alwaysOnTop(1);
			this.appWindow.paddingMode(0);
			this.appWindow.setDims(x, margins, width, height);
			this.appWindow.setContent('<textarea id="stickyNotePad" onblur="apps.postit.vars.savePost()" style="padding:0;color:#000;font-family:Comic Sans MS;font-weight:bold;border:none;resize:none;display:block;width:100%;height:100%;background-color:#FF7;"></textarea>');
			if (ufload("aos_system/apps/postit/saved_note")) {
				getId('stickyNotePad').value = ufload("aos_system/apps/postit/saved_note");
			}
			this.appWindow.alwaysOnTop(1);
		}
		this.appWindow.openWindow();
	},
	vars: {
		appInfo: 'Simple stickynote that stays above other apps on your screen. The contents are saved across reboots.',
		savePost: function() {
			if (apps.postit.appWindow.appIcon) {
				apps.savemaster.vars.save('aos_system/apps/postit/saved_note', getId('stickyNotePad').value, 1);
			}
		}
	}
});

} // End initial variable declaration