var Ymplayer = {
	/** Init player for given element */
	InitPlayer : function(ymplayer){
		var songTag = ymplayer.getElementsByTagName("song");
		if(songTag.length === 0){
			ymplayer.parentNode.removeChild(ymplayer);
			return false;
		}

		/* Responsive design use */
		window.addEventListener('resize', function(){
			var classes_max_width = [
				{maxWidth:686, className:'max-width-686'},
				{maxWidth:644, className:'max-width-644'},
				{maxWidth:560, className:'max-width-560'},
				{maxWidth:400, className:'max-width-400'},
			]
			var width = ymplayer.offsetWidth;
			for (var i = 0; i < classes_max_width.length; i++) {
				removeClass(ymplayer, classes_max_width[i].className);
				if (width <= classes_max_width[i].maxWidth) {
					addClass(ymplayer, classes_max_width[i].className);
				}
			}
			Ymplayer.SyncLRC(ymplayer);
		});

		/** Init Playlist */
		var listEle = document.createElement("div");
		listEle.setAttribute("class","ym-playlist");
		var firstSingle = undefined;
		for(var t = 0; t < songTag.length; t ++){
			single = document.createElement("single");
			single.setAttribute("idx", t);
			single.setAttribute("src", songTag[t].attributes.src.value);
			single.setAttribute("artist", songTag[t].attributes.artist.value);
			single.setAttribute("song", songTag[t].attributes.song.value);
			single.setAttribute("cover", songTag[t].attributes.cover.value);
			single.addEventListener('click', function(e){
				Ymplayer.ChangeAudio(ymplayer, this);
			});
			single.innerHTML = "<span class='list-number'>" + String(t + 1) + "</span>"
				+ "<span class='list-song'>" + songTag[t].getAttribute('song') + "</span>"
				+ "<span class='list-artist'>" + songTag[t].getAttribute('artist') + "</span>";
			listEle.appendChild(single);
			if (t === 0) {
				firstSingle = single;
			}
		}

		/** Init audio element */
		var audioEle = document.createElement("audio");
		audioEle.setAttribute("preload","yes");
		audioEle.addEventListener('loadeddata', function(){
			var time = parseInt(Math.round(this.duration));
			ymplayer.querySelector(".duration-time").innerHTML = padZero(Math.floor(time / 60), 2) + ':' + padZero(time % 60, 2);
		});
		audioEle.addEventListener('play', function(){
			ymplayer.setAttribute('playing', 'playing');
		});
		audioEle.addEventListener('pause', function(){
			ymplayer.removeAttribute('playing');
		});
		audioEle.addEventListener('ended', function(){
			ymplayer.removeAttribute('playing');
			var single_active = ymplayer.querySelector('.single-active');
			if (ymplayer.getAttribute('loop') == 'yes') {
				Ymplayer.ChangeAudio(ymplayer, single_active);
			} else if (single_active.nextSibling){
				Ymplayer.ChangeAudio(ymplayer, single_active.nextSibling);
			}
		});
		audioEle.addEventListener('volumechange', function(){
			ymplayer.querySelector('.volume-current').style.width = String(this.volume * 100) + '%';
			if (this.volume == 0) {
				addClass(ymplayer.querySelector('.vol-button'), 'muted');
			} else {
				removeClass(ymplayer.querySelector('.vol-button'), 'muted');
			}
		});
		audioEle.addEventListener('timeupdate', function(){
			var percent = this.currentTime / this.duration;
			var time = parseInt(Math.round(this.currentTime));
			ymplayer.querySelector(".ym-played").style.width = percent * 100 + '%';
			ymplayer.querySelector(".current-time").innerHTML = padZero(Math.floor(time / 60), 2) + ':' + padZero(time % 60, 2);
			Ymplayer.SyncLRC(ymplayer, this.currentTime);
		});

		/** 创建进度条元素 */
		progressBarEle = document.createElement("div");
		progressBarEle.setAttribute("class","ym-progress");
		progressBarEle.innerHTML = "<span class='current-time'>00:00</span>"
			+"<div class='ym-pgbar-outer'><div class='ym-pgbar'><div class='ym-buffed'></div><div class='ym-played'><span class='ym-circle'></span></div></div></div>"
			+"<span class=\"duration-time\">00:00</span>";
		progressBarEle.querySelector('.ym-pgbar-outer').addEventListener('mousedown', function(e){
			Ymplayer.Seek(ymplayer,e);
		});

		/* Seek via mouse */
		progressBarEle.querySelector('.ym-pgbar-outer').addEventListener('mousedown', function(e){
			ymplayer.setAttribute('drag', 'progress');
			Ymplayer.Seek(ymplayer, e);
		});
		progressBarEle.querySelector('.ym-pgbar-outer').addEventListener('mousemove', function(e){
			if (ymplayer.getAttribute('drag') == 'progress'){
				Ymplayer.Seek(ymplayer,e);
			}
		});
		progressBarEle.querySelector('.ym-pgbar-outer').addEventListener('mouseout', function(e){
			if (e.target == this) {
				ymplayer.removeAttribute('drag');
			}
		});
		progressBarEle.querySelector('.ym-pgbar-outer').addEventListener('mouseup', function(e){
			ymplayer.removeAttribute('drag');
		});

		/** 创建控制器元素 */
		conEle = document.createElement("div");
		addClass(conEle, "player-container");

		coverEle = document.createElement("div");
		addClass(coverEle, "ym-songinfo");
		coverEle.innerHTML = "<div class='ym-cover-image'></div><div class='ym-song-detail'><p class='ym-song'></p><p class='ym-artist'></p></div>";
		conEle.appendChild(coverEle);

		ctEle = document.createElement("div");
		addClass(ctEle, "ym-controller");
		ctEle.innerHTML = "<span class='play-button ymbtn'><i class='fa fa-play'></i><i class='fa fa-pause'></i></span>"
			+ "<i class='stop-button ymbtn fa fa-stop'></i>"
			+ "<i class='loop-button ymbtn fa fa-refresh'></i>"
			+ (songTag.length > 0 ? "<i class='list-button ymbtn fa fa-list'></i>" : '')
			+ "<i class='lyric-button ymbtn fa fa-file-text'></i></a>"
			+ "<span class='vol-button ymbtn'><i class='fa fa-volume-down'></i><i class='fa fa-volume-off'></i></span>"
			+ "<div class='volume-bar'><div class='volume-bar-inner'><div class='volume-current'><span class='ym-circle'></span></div></div></div>";
		if (songTag.length > 0) {
			ctEle.querySelector('.list-button').addEventListener('click', function(e){
				Ymplayer.List(ymplayer);
			});
		}
		ctEle.querySelector('.lyric-button').addEventListener('click', function(e){
			Ymplayer.LrcBox(ymplayer);
			Ymplayer.SyncLRC(ymplayer);
		});
		ctEle.querySelector('.play-button').addEventListener('click', function(e){
			Ymplayer.TogglePlay(ymplayer);
		});
		ctEle.querySelector('.stop-button').addEventListener('click', function(e){
			Ymplayer.Stop(ymplayer);
		});
		ctEle.querySelector('.loop-button').addEventListener('click', function(e){
			Ymplayer.ToggleLoop(ymplayer);
		});
		ctEle.querySelector('.vol-button').addEventListener('click', function(e){
			var audioElement = ymplayer.getElementsByTagName('audio')[0];
			audioElement.volume = (audioElement.volume > 0 ? 0 : 1);
		});

		/* Adjust volume via mouse */
		ctEle.querySelector('.volume-bar').addEventListener('mousedown', function(e){
			ymplayer.setAttribute('drag', 'volume');
			Ymplayer.ChangeVol(ymplayer, e);
		});
		ctEle.querySelector('.volume-bar').addEventListener('mousemove', function(e){
			if (ymplayer.getAttribute('drag') == 'volume'){
				Ymplayer.ChangeVol(ymplayer,e);
			}
		});
		ctEle.querySelector('.volume-bar').addEventListener('mouseout', function(e){
			if (e.target == this) {
				ymplayer.removeAttribute('drag');
			}
		});
		ctEle.querySelector('.volume-bar').addEventListener('mouseup', function(e){
			ymplayer.removeAttribute('drag');
		});

		conEle.appendChild(coverEle);
		conEle.appendChild(ctEle);

		/* 显示歌词 */
		lrcBox = document.createElement("div");
		lrcBox.setAttribute("class","ym-lrcbox");
		lrcBox.innerHTML = "<div class='lrc-container'></div>"
			+"<div class='no-lrc'><p>这首歌是没有填词的纯音乐（或者没有找到歌词），请欣赏。</p></div>"
			+"<div class='lrc-fixer'>"
			+"<span title='将歌词延后0.5s' class='ym-fix-btn ym-fix-slower'><i class='fa fa-angle-up'></i></span>"
			+"<span title='将歌词提前0.5s' class='ym-fix-btn ym-fix-faster'><i class='fa fa-angle-down'></i></span>"
			+"</div>";
		lrcBox.querySelector('.lrc-container').addEventListener('click', function(){
			Ymplayer.ToggleFixer(ymplayer);
		});
		lrcBox.querySelector('.ym-fix-slower').addEventListener('click', function(){
			ymplayer.setAttribute('current-lrc-timeoffset', Number(ymplayer.getAttribute('current-lrc-timeoffset')) - 0.5);
			Ymplayer.SyncLRC(ymplayer);
		});
		lrcBox.querySelector('.ym-fix-faster').addEventListener('click', function(){
			ymplayer.setAttribute('current-lrc-timeoffset', Number(ymplayer.getAttribute('current-lrc-timeoffset')) + 0.5);
			Ymplayer.SyncLRC(ymplayer);
		});

		/** Add list, lrcbox, audio and other stuffs into Ymplayer */
		ymplayer.appendChild(listEle);
		ymplayer.appendChild(lrcBox);
		ymplayer.appendChild(audioEle);
		ymplayer.appendChild(progressBarEle);
		ymplayer.appendChild(conEle);
		if (firstSingle) {
			Ymplayer.ChangeAudio(ymplayer, firstSingle, true);
		}
	},
	/** Play and Pause Event */
	TogglePlay : function(ymplayer){
		var audioElement = ymplayer.getElementsByTagName('audio')[0];
		if(audioElement.paused != false){
			audioElement.play();	
		} else {
			audioElement.pause();
		}
	},
	/** Stop event */
	Stop : function(ymplayer) {
		ymplayer.removeAttribute('playing');
		var audioElement = ymplayer.getElementsByTagName('audio')[0];
		audioElement.pause();
		audioElement.currentTime = 0;
		ymplayer.removeAttribute('playing');
		ymplayer.querySelector(".current-time").innerHTML = '00:00';
		ymplayer.querySelector(".ym-played").style.width = '0%';
	},
	/** Toggle Loop or unloop mode */
	ToggleLoop : function(ymplayer){
		ymplayer.setAttribute("loop", (ymplayer.getAttribute("loop") == 'no' ? 'yes' : 'no'));
	},
	/** Show or hide lrcbox */
	LrcBox : function(ymplayer){
		removeClass(ymplayer.querySelector(".ym-playlist"), 'ym-show');
		toggleClass(ymplayer.querySelector(".ym-lrcbox"), 'ym-show');
	},
	/** Seek progress */
	Seek : function(ymplayer,e){
		var audioElement = ymplayer.getElementsByTagName('audio')[0];
		var pgbar = ymplayer.querySelector('.ym-pgbar-outer');
		var pgbar_rect = getRect(pgbar);
		if (!isNaN(audioElement.duration)) {
			var progress_bar = ymplayer.querySelector('.ym-pgbar-outer');
			audioElement.currentTime = audioElement.duration * (e.clientX - pgbar_rect.left) / pgbar.offsetWidth;
		}
	},
	/** Click to change volume */
	ChangeVol : function(ymplayer,e){
		var volume_bar = ymplayer.querySelector('.volume-bar');
		var volume_bar_rect = getRect(volume_bar);
		var vol_amount = (e.clientX - volume_bar_rect.left) / volume_bar.offsetWidth;
		if (vol_amount < 0.01) {vol_amount = 0;}
		else if (vol_amount > 0.99) {vol_amount = 1;}
		ymplayer.getElementsByTagName('audio')[0].volume = vol_amount;
	},
	/** Show play list */
	List : function(ymplayer){
		removeClass(ymplayer.querySelector(".ym-lrcbox"), 'ym-show');
		toggleClass(ymplayer.querySelector(".ym-playlist"), 'ym-show');
	},
	/** Lrc sync */
	SyncLRC: function(ymplayer, currentTime) {
		if (!ymplayer.getAttribute('current-lrc')) {
			return;
		}
		if (undefined == currentTime) {
			var time = ymplayer.getElementsByTagName('audio')[0].currentTime;
		} else {
			var time = currentTime;
		}
		time += Number(ymplayer.getAttribute('current-lrc-timeoffset'));

		/* Fetch all the lyrics */
		var lyrics_all = ymplayer.getElementsByTagName('lyric');
		var current_lrc = undefined;
		for (var i = 0; i < lyrics_all.length-1; i++) {
			var time_now = Number(lyrics_all[i].getAttribute('timeline'));
			var time_next = Number(lyrics_all[i+1].getAttribute('timeline'));
			if (i <= 0 && time <= time_now) {
				current_lrc = i;
			} else if (i == lyrics_all.length-2 && time >= time_next) {
				current_lrc = i + 1;
			} else if (time < time_next && time >= time_now) {
				current_lrc = i;
			}
		}

		/* Failed to select lyric */
		if (current_lrc === undefined) {
			ymplayer.setAttribute('current-lrc', -1);
			return;
		}

		/* Update lyric */
		ymplayer.setAttribute('current-lrc', current_lrc);
		var lyric_selected = ymplayer.querySelectorAll('.ym-active');
		for (var i = 0; i < lyric_selected.length; i++) {
			removeClass(lyric_selected[i], 'ym-active');
		}
		addClass(lyrics_all[current_lrc], 'ym-active');
		var ym_lrcbox = ymplayer.querySelector('.ym-lrcbox');
		var lrc_container = ymplayer.querySelector(".lrc-container");
		var target_offset = lyrics_all[current_lrc].offsetTop - Math.abs(ym_lrcbox.offsetHeight - lyrics_all[current_lrc].offsetHeight) / 2;
		if (target_offset < 0) {target_offset = 0;}
		lrc_container.style.top = String(-target_offset)+'px';
	},
	/** LRC Parser */
	ParseLRC : function(ymplayer,idx){
		var lrcContainer = ymplayer.querySelector(".lrc-container");
		var lrcData = ymplayer.getElementsByTagName("song")[idx];
		ymplayer.removeAttribute('current-lrc');
		ymplayer.removeAttribute('current-lrc-timeoffset');
		lrcContainer.innerHTML = '';
		ymplayer.querySelector(".lrc-fixer").style.opacity = 0;

		if(lrcData && lrcData.innerHTML.length != 0 && lrcData.innerHTML != ''){
			var lyric = lrcData.innerHTML.replace(/(\\n)/g,"\n").replace(/(\\r)/g,"").split("\n");
			for (var x in lyric) {
				if (lyric[x].match(/(ti:|ar:|by:|al:|offset:)/)) {
					continue;
				} else if(lyric[x] == "") {
					continue; 
				} else {
					tempLrc = lyric[x].match(/([0-9]{2})\:([0-9]{2}\.[0-9]{2})/);
				}
				tempContent = lyric[x].match(/\[.*?\](.*?)$/)[1].replace('/(^\s*)|(\s*$)/','');
				if(tempLrc){
					minute = tempLrc[1] * 60;
					sec = minute + parseFloat(tempLrc[2]);
					var lrcEle = document.createElement("lyric");
					lrcEle.setAttribute("timeline",sec);
					if (tempContent.length > 0) {
						lrcEle.innerHTML = "<p>"+tempContent+"</p>";
					}
					lrcContainer.appendChild(lrcEle);
				}
			}
			ymplayer.setAttribute("current-lrc",-1);
			ymplayer.setAttribute('current-lrc-timeoffset',0);
		}
	},
	/** Change Audio */
	ChangeAudio : function(ymplayer,list_item,no_autoplay){
		var num = Number(list_item.getAttribute('idx'));
		ymplayer.querySelector(".ym-song").innerHTML = list_item.getAttribute('song');
		ymplayer.querySelector(".ym-artist").innerHTML = list_item.getAttribute('artist');
		ymplayer.querySelector(".ym-cover-image").style.backgroundImage = "url("+list_item.getAttribute('cover')+")";
		var elem_active_all = ymplayer.querySelectorAll("single.single-active");
		for (var i = 0; i < elem_active_all.length; i++) {
			removeClass(elem_active_all[i], "single-active");
		}
		addClass(list_item, "single-active");

		ymplayer.querySelector(".duration-time").innerHTML = '00:00';
		var player = ymplayer.getElementsByTagName('audio')[0];
		player.setAttribute('src', list_item.getAttribute('src'));
		Ymplayer.ParseLRC(ymplayer, num);
		if (!no_autoplay){
			Ymplayer.Stop(ymplayer);
			player.play();
		}
	},
	/** Toggle LRC Fixer Box */
	ToggleFixer: function(ymplayer){
		if (ymplayer.hasAttribute('current-lrc')) {
			fixer = ymplayer.querySelector(".lrc-fixer");
			fixer.style.opacity = (fixer.style.opacity == 1 ? 0 : 1);
		}
	},
	/** Init YmPlayer */
	Init : function(){
		var ymplayer = document.getElementsByTagName("ymplayer");	/** 获取 Tagname 为 ymplayer 的元素 */
		if(ymplayer.length != 0){
			for(var i = 0; i < ymplayer.length; i ++){
				Ymplayer.InitPlayer(ymplayer[i]);
			}
		}

		/* 加载完成后触发resize事件，对所有ymplayer的样式进行调整 */
		var event_resize = document.createEvent('HTMLEvents');
		event_resize.initEvent('resize', true, false);
		event_resize.synthetic = true;
		window.dispatchEvent(event_resize);
	},
}

function hasClass(e,c){
	return e.className.match(new RegExp('(\\s|^)'+c+'(\\s|$)'))?true:false;
}
function addClass(e,c){
	if(!c||hasClass(e,c)){return}
	if(e.className){e.className+=' '+c}else{e.className=c}
}
function removeClass(e,c){
	if(!c){return}
	e.className=e.className.replace(new RegExp('(\\s|^)'+c+'(\\s|$)','g'),' ').replace(/\s+/g,' ').replace(/(^\s*)|(\s*$)/g,'');
	if(!e.className){e.removeAttribute('class')}
}
function toggleClass(e,c){
	if(hasClass(e,c)){removeClass(e,c)}else{addClass(e,c)}
}
function padZero(n,l){
	if(isNaN(n)){throw'Invalid Number'}
	if(isNaN(l)){throw'Invalid Length'}
	var s=(Number(n)<0?1:0),r=String(Math.abs(n)),t=Number(l)-r.length-s;
	if(t>0){while(t){r='0'+r;t--}}
	return (s?'-':'')+r;
}
function getRect(elements){ 
	var rect = elements.getBoundingClientRect(); 
	var clientTop = document.documentElement.clientTop; 
	var clientLeft = document.documentElement.clientLeft; 
	return { 
		top : rect.top - clientTop, 
		bottom : rect.bottom - clientTop, 
		left : rect.left - clientLeft,  
		right : rect.right - clientLeft
	}; 
}

