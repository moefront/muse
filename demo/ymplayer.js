var Ymplayer = {
	than : 3,
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
		//TODO: audio的timeupdate事件在firefox下比较耗CPU。。。
		audioEle.addEventListener('timeupdate', function(){
			var percent = this.currentTime / this.duration;
			var time = parseInt(Math.round(this.currentTime));
			ymplayer.querySelector(".ym-played").style.width = percent * 100 + '%';
			ymplayer.querySelector(".current-time").innerHTML = padZero(Math.floor(time / 60), 2) + ':' + padZero(time % 60, 2);
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

		lrcbox = document.createElement("div");
		lrcbox.setAttribute("class","ym-lrcbox");
		lrcbox.innerHTML = "<div class=\"lrc-container\"></div>\n<div class=\"lrc-fixer\">"
			+"<span title=\"将歌词延后0.5s\" class=\"ym-fix-btn\"><i class=\"fa fa-angle-up\"></i></span>"
			+"<span title=\"将歌词提前0.5s\" class=\"ym-fix-btn\"><i class=\"fa fa-angle-down\"></i></span>"
			+"</div>";

		/** Add list, lrcbox, audio and other stuffs into Ymplayer */
		ymplayer.appendChild(listEle);
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
		//removeClass(ymplayer.querySelector(".ym-lrcbox"), 'ym-show');
		toggleClass(ymplayer.querySelector(".ym-playlist"), 'ym-show');
	},
	/** Lrc sync */
	Lrc : function(obj){
		audioElement = document.getElementById(obj);
		if (typeof audioElement == 'undefined' || audioElement == null)	return;
		par = audioElement.parentNode;
		if(audioElement.paused != false)	return;
		time = audioElement.currentTime;
		all = audioElement.duration;
		lrcEle = par.getElementsByTagName("lyric");
		long = lrcEle.length;
		currentLrc = parseInt(par.getAttribute("currentLrc"));
		lrccontainer = par.getElementsByClassName("lrc-container")[0];

		if(time > lrcEle[long-1].getAttribute("timeline"))		return false;

		if (lrcEle[currentLrc] && time >= lrcEle[currentLrc].getAttribute("timeline")) {
			if (currentLrc < long-1) {
				if(time > lrcEle[parseInt(currentLrc)+1].getAttribute("timeline")){
					active = lrccontainer.getElementsByClassName("ym-active");
					if(typeof active != "null"){
						leng = active.length;
						o = 0;
						while(o < leng){
							removeClass(active[o],"ym-active");
							o++;
						}
					}

					for (var i = 0; i < long; i++) {
						if (time > lrcEle[currentLrc].getAttribute("timeline")) {
							i++;
						} else {
							marginHeight = lrcEle[this.than - 1].offsetTop - lrcEle[currentLrc].offsetTop;
							lrccontainer.style.transform = "transformY("+marginHeight+"px)";							
							par.setAttribute("currentLrc",i);
							Ymplayer.Lrc(obj);
						}
					}			
				}
			}
			if(currentLrc != 0) removeClass(lrcEle[currentLrc - 1],"ym-active");
			addClass(lrcEle[currentLrc], "ym-active");
			if (currentLrc >= this.than) {
				marginHeight = lrcEle[this.than - 1].offsetTop - lrcEle[currentLrc].offsetTop;
				lrccontainer.style.marginTop = marginHeight+"px";
			}
			par.setAttribute("currentLrc",currentLrc+1);
		} else if (currentLrc != 0 && time < lrcEle[currentLrc-1].getAttribute("timeline")) {
			active = lrccontainer.getElementsByClassName("ym-active");
			if(typeof active != "null"){
				leng = active.length;
				o = 0;
				while(o < leng){
					removeClass(active[o],"ym-active");
					o++;
				}
			}
			for (var s = 0; s < lrcEle.length; s++) {
				if(time < lrcEle[0].getAttribute("timeline")){
					lrccontainer.style.marginTop = 0+"px";
					break;
				}
				if (time > lrcEle[s].getAttribute("timeline")){
					if(s<=this.than){
						lrccontainer.style.marginTop = 0+"px";
					}
					else{
						marginHeight = lrcEle[this.than - 1].offsetTop - lrcEle[currentLrc].offsetTop;
						lrccontainer.style.marginTop = marginHeight+"px";		
					}
					addClass(lrcEle[s], "ym-active");				
					par.setAttribute("currentLrc",s);
					Ymplayer.Lrc(obj);		

					break;
				} else {
					s++;
				}
			}
		}

	},
	/** LRC Parser */
	lrcParse : function(obj,n){
		obj = typeof obj == "object" ? obj : document.getElementById(obj);
		par = obj.parentNode;
		lrcbox = par.getElementsByClassName("ym-lrcbox")[0];
		lrcContainer = lrcbox.getElementsByClassName("lrc-container")[0];
		if("" != lrcContainer.innerHTML) lrcContainer.innerHTML = "";
		lrc = par.getElementsByTagName("song");
		if(typeof lrc != "null" && lrc.length != 0){
			lyric = lrc[n].innerHTML;

			if("" == lyric)	noLrc();

			lyric = lyric.replace(/(\\n)/g,"\n");
			lyric = lyric.replace(/(\\r)/g,"");
			lyric = lyric.split("\n");
			timeline = Array();
			lrcContent = Array();

			for (var x in lyric) {
				if (lyric[x].match(/(ti:|ar:|by:|al:|offset:)/)) {
					continue;
				}
				else if(lyric[x] == "")
					continue; 
				else {
					tempLrc = lyric[x].match(/([0-9]{2})\:([0-9]{2}\.[0-9]{2})/);
				}
				tempContent = lyric[x].match(/\[.*?\](.*?)$/);
				if(typeof tempLrc != null){
					minute = tempLrc[1] * 60;
					sec = minute + parseFloat(tempLrc[2]);
					lrcEle = document.createElement("lyric");
					lrcEle.setAttribute("timeline",sec);
					lrcEle.innerHTML = "<p>"+tempContent[1]+"</p>";
					lrcContainer.appendChild(lrcEle);
				}
			}
			par.setAttribute("currentLrc",0);
		}
		else{
			noLrc();
		}
		function noLrc(){
			lrcEle = document.createElement("lyric");
			lrcEle.setAttribute("timeline",0);
			lrcEle.setAttribute("class","lyrictag-no-lrc");
			lrcEle.innerHTML = "<p>这首歌是没有填词的纯音乐（或者没有找到歌词），请欣赏。</p>";
			lrcContainer.appendChild(lrcEle);		
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

		Ymplayer.Stop(ymplayer);
		ymplayer.querySelector(".duration-time").innerHTML = '00:00';
		var player = ymplayer.getElementsByTagName('audio')[0];
		player.setAttribute('src', list_item.getAttribute('src'));
		if (!no_autoplay){
			player.play();
		}
	},
	/** Show LRC Fixer Box */
	ShowFixer : function(obj){
		obj = typeof obj == "object" ? obj : document.getElementById(obj);
		par = obj.parentNode;
		fixer = par.querySelector(".lrc-fixer");
		if(fixer.style.opacity == 1)
			fixer.style.opacity = 0;
		else
			fixer.style.opacity = 1;
	},
	/** Fix the LRC sync */
	Fixer : function(obj, act){
		obj = typeof obj == "object" ? obj : document.getElementById(obj);
		par = obj.parentNode;
		lrcList = par.querySelectorAll("lyric");
		/** 如果动作为 提前 0.5s */
		if(act == "prev"){
			for(i=0;i<lrcList.length;i++){
				nowline = lrcList[i].attributes.timeline.value;
				if(nowline < 0.5)	continue;
				lrcList[i].attributes.timeline.value = parseFloat(nowline) - 0.5;
			}
		}
		/** 否则执行动作 延后0.5s */
		else{
			for(i=0;i<lrcList.length;i++){
				nowline = lrcList[i].attributes.timeline.value;
				lrcList[i].attributes.timeline.value = parseFloat(nowline) + 0.5;
			}
		}
	},
	/** Init YmPlayer */
	Init : function(){
		ymplayer = document.getElementsByTagName("ymplayer");	/** 获取 Tagname 为 ymplayer 的元素 */
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

