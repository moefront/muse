var Ymplayer = {
	than : 3,
	/** Init YmPlayer */
	Init : function(){
		ymplayer = document.getElementsByTagName("ymplayer");	/** 获取 Tagname 为 ymplayer 的元素 */

		if(ymplayer.length != 0){
			for(var i = 0; i < ymplayer.length; i ++){
				tempID = ymplayer[i].getAttribute("name");
				songTag = ymplayer[i].getElementsByTagName("song");
				if(songTag.length === 0){
					remove(ymplayer[i]);
					return false;
				}
				ymplayer[i].setAttribute("init","no");
				listEle = document.createElement("div");
				listEle.id = tempID+"-list";
				listEle.setAttribute("class","ym-playlist");
				for(var t = 0; t < songTag.length; t ++){
					single = document.createElement("single");
					single.setAttribute("src", songTag[t].attributes.src.value);
					single.setAttribute("artist", songTag[t].attributes.artist.value);
					single.setAttribute("song", songTag[t].attributes.song.value);
					single.setAttribute("cover", songTag[t].attributes.cover.value);
					single.addEventListener('click', function(e){
						Ymplayer.changeAudio(tempID, this);
					});
					single.innerHTML = "<span class=\"list-number\">"+(t+1)+"</span>"
					+"<span class=\"list-song\">"+songTag[t].attributes.song.value+"</span>"
					+"<span class=\"list-artist\">"+songTag[t].attributes.artist.value+"</span>";
					t === 0 ? single.setAttribute("class","single-active") : "";
					listEle.appendChild(single);
					if(t === 0){
						tempSrc = songTag[0].attributes.src.value, song = songTag[0].attributes.song.value, artist =  songTag[0].attributes.artist.value, cover =  songTag[0].attributes.cover.value;
					}
				}
				listHTML = songTag.length > 0 ? "<a class=\"list-button ymbtn\" href=\"javascript:;\" onclick=\"Ymplayer.List("+tempID+")\"><i class=\"fa fa-list\"></i></a> " : "" 
				ymplayer[i].appendChild(listEle);

				audioEle = document.createElement("audio");
				/** 设置 Audio 元素属性 */
				audioEle.setAttribute("id",tempID);
				audioEle.setAttribute("src",tempSrc);
				audioEle.setAttribute("preload","no");
				audioEle.addEventListener('ended', function(){
					var ymplayer = document.getElementsByName(tempID)[0];
					var next_single = ymplayer.querySelector('.single-active').nextSibling;
					if (ymplayer.getAttribute('loop') == 'yes') {
						Ymplayer.changeAudio(tempID, ymplayer.querySelector('.single-active'));
					} else if (next_single){
						Ymplayer.changeAudio(tempID, ymplayer.querySelector('.single-active').nextSibling);
					}
				});

				/** 创建进度条元素 */
				proEle = document.createElement("div");
				proEle.setAttribute("class","ym-progress");
				proEle.id = tempID+"-progress";
				proEle.innerHTML = "<div class=\"ym-progress-handler\"><span class=\"current-time\">00:00</span>"
				+"<div class=\"ym-pgbar\"  onclick=\"Ymplayer.Skip("+tempID+",event)\"><div class=\"ym-buffed\"></div><div class=\"ym-played\"><span onmousedown=\"Ymplayer.Move("+tempID+",event);\" class=\"ym-circle\" ></span></div></div>"
				+"<span class=\"duration-time\">00:00</span></div>";

				/** 创建控制器元素 */
				conEle = document.createElement("div");
				conEle.setAttribute("class","player-container");

				coverEle = document.createElement("div");
				coverEle.setAttribute("class","ym-songinfo");
				coverEle.innerHTML = "<div class=\"ym-cover-image\"></div><div class=\"ym-song-detail\"><p class=\"ym-song\">"+song+"</p><p class=\"ym-artist\">"+artist+"</p></div>";
				coverEle.getElementsByClassName("ym-cover-image")[0].style.backgroundImage = "url("+cover+")";

				ctEle = document.createElement("div");
				ctEle.setAttribute("class","ym-controller");
				ctEle.id = tempID + "-controller";
				ctEle.innerHTML = "<div class=\"ym-play-status\"><a class=\"play-button ymbtn\" href=\"javascript:;\" onclick=\"Ymplayer.Play('"+tempID+"')\"><i class='fa fa-play'></i></a>\n"
				+"<a class=\"stop-button ymbtn\"  href=\"javascript:;\" onclick=\"Ymplayer.Stop('"+tempID+"')\"><i class=\"fa fa-stop\"></i></a>\n"
				+"<a class=\"loop-button ymbtn\"  href=\"javascript:;\" onclick=\"Ymplayer.Loop('"+tempID+"')\"><i class=\"fa fa-refresh\"></i></a>\n"
				+listHTML
				+"<a class=\"lyric-button ymbtn\"  href=\"javascript:;\" onclick=\"Ymplayer.LrcBox('"+tempID+"')\"><i class=\"fa fa-file-text\"></i></a>\n"
				+"<a class=\"vol-button ymbtn\"  href=\"javascript:;\" onclick=\"Ymplayer.Novol('"+tempID+"')\"><i class=\"fa fa-volume-down\"></i></a></div>\n"
				+"<div class=\"volume-bar\" onclick=\"Ymplayer.ChangeVol("+tempID+",event)\"><div class=\"volume-current\"><span class=\"ym-circle\"></span></div></div>";

				conEle.appendChild(coverEle);
				conEle.appendChild(ctEle);

				ymplayer[i].appendChild(audioEle);

				lrcbox = document.createElement("div");
				lrcbox.id = tempID + "lrcbox";
				lrcbox.setAttribute("class","ym-lrcbox");
				lrcbox.innerHTML = "<div class=\"lrc-container\" onclick=\"Ymplayer.showFixer("+tempID+");\"></div>\n<div class=\"lrc-fixer\">\n"
				+"<a href=\"javascript:;\" title=\"将歌词延后0.5s\" onclick=\"Ymplayer.Fixer("+tempID+",'next')\" class=\"ym-fix-btn\"><i class=\"fa fa-angle-up\"></i></a>\n"
				+"<a href=\"javascript:;\" title=\"将歌词提前0.5s\" onclick=\"Ymplayer.Fixer("+tempID+",'prev')\" class=\"ym-fix-btn\"><i class=\"fa fa-angle-down\"></i></a>\n"				
				+"</div>\n";
				ymplayer[i].appendChild(lrcbox);
				ymplayer[i].appendChild(proEle);			
				ymplayer[i].appendChild(conEle);
				Ymplayer.lrcParse(tempID,0);
			}
		}
	},
	/** Automatically specify which style to use based on player's width */
	StyleByWidth: function(){
		var classes_max_width = [
			{maxWidth:686, className:'max-width-686'},
			{maxWidth:644, className:'max-width-644'},
			{maxWidth:560, className:'max-width-560'},
			{maxWidth:400, className:'max-width-400'},
		]
		var _StyleByWidth = function(player) {
			var width = player.offsetWidth;
			for (var i = 0; i < classes_max_width.length; i++) {
				removeClass(player, classes_max_width[i].className);
				if (width <= classes_max_width[i].maxWidth) {
					addClass(player, classes_max_width[i].className);
				}
			}
		}
		var ymplayer = document.getElementsByTagName("ymplayer");	/** 获取 Tagname 为 ymplayer 的元素 */
		if(ymplayer.length != 0){
			for(var i = 0; i < ymplayer.length; i ++){
				_StyleByWidth(ymplayer[i]);
			}
		}
	},
	/** Play and Pause Event */
	Play : function(obj){

		audioElement = typeof(obj) == "object" ? obj : document.getElementById(obj);
		obj = typeof(obj) == "object" ? obj.id : obj;
		if(audioElement.paused != false){
			audioElement.play();	
			btn = document.getElementById(obj+"-controller").getElementsByClassName("play-button");
			btn[0].innerHTML = "<i class=\"fa fa-pause\"></i>";

			par = audioElement.parentNode;
			if(par.getAttribute("init") == "no"){
				eval(obj+"Timeupdater = setInterval('Ymplayer.Change("+obj+")',1000);")
				currentTime = audioElement.currentTime;
				/** 获取歌曲时间 */
				function getTotal(){
					if(isNaN(audioElement.duration)){
						setTimeout(function(){getTotal();},200);
					}
					duration = "0"+parseInt(audioElement.duration/60) + ":";
					inter =  parseInt(audioElement.duration - (parseInt(audioElement.duration/60)*60));
					if(inter < 10) inter = "0"+inter;
					duration = duration + inter;
					if(isNaN(audioElement.duration)){
						par.getElementsByClassName("duration-time")[0].innerHTML = '00:00';
					} else {
						par.getElementsByClassName("duration-time")[0].innerHTML = duration;
					}
				}
				getTotal();
			}
			if(par.getAttribute("currentLrc") != null){
				setInterval(function(){
					Ymplayer.Lrc(obj);
				},20);
			}

		}
		else{
			audioElement.pause();
			btn = document.getElementById(obj+"-controller").getElementsByClassName("play-button");
			btn[0].innerHTML = "<i class=\"fa fa-play\"></i>";
		}

	},
	/** Stop event */
	Stop : function(obj){

		audioElement = document.getElementById(obj);
		parent = audioElement.parentNode;
		audioElement.pause();
		audioElement.currentTime = 0;
		btn = document.getElementById(obj+"-controller").getElementsByClassName("play-button");
		btn[0].innerHTML = "<i class=\"fa fa-play\"></i>";		
		parent.getElementsByClassName("ym-played")[0].style.width = "0%";

	},
	/** Loop or unloop event */
	Loop : function(obj){

		audioElement = document.getElementById(obj);
		ymParent = audioElement.parentNode;
		loopbtn = document.getElementById(obj+"-controller").getElementsByClassName("loop-button")[0];

		if(ymParent.getAttribute("loop") == 'no'){
			ymParent.setAttribute("loop","yes");
			addClass(loopbtn, "looping");
		}
		else{
			ymParent.setAttribute("loop","no");
			removeClass(loopbtn, "looping");
		}

	},
	/** Progress changer */
	Change : function(obj){
		ae = typeof(obj) == "object" ? obj : document.getElementById(obj);
		obj = typeof(obj) == "object" ? obj.id : obj;
		if (typeof ae == 'undefined' || ae == null)	return;	
		if(ae.currentTime == ae.duration)	{
			if(ae.parentNode.getAttribute("loop") == "yes"){
				ae.currentTime = 0;
				ae.parentNode.setAttribute("currentLrc",0);
				ae.parentNode.getElementsByClassName("lrc-container")[0].style.margin = "0px";
			}
			ae.parentNode.getElementsByClassName("play-button")[0].innerHTML = "<i class=\"fa fa-play\"></i>";
			eval("clearInterval("+obj+");");
		}
		now = ae.currentTime / ae.duration;
		percent = now*100 + "%";
		current = "0"+parseInt(ae.currentTime/60) + ":"; 
		inter =  parseInt(ae.currentTime - (parseInt(ae.currentTime/60)*60));
		if(inter < 10) inter = "0"+inter;
		current = current + inter;
		ae.parentNode.getElementsByClassName("ym-played")[0].style.width = percent;
		ae.parentNode.getElementsByClassName("current-time")[0].innerHTML = current;	
	},
	/** Show or hide lrcbox */
	LrcBox : function(obj){
		audioElement = typeof(obj) == "object" ? obj : document.getElementById(obj);
		var player = audioElement.parentNode;
		removeClass(player.querySelector(".ym-playlist"), 'ym-show');
		toggleClass(player.querySelector(".ym-lrcbox"), 'ym-show');
	},
	/** Click to skip progress */
	Skip : function(obj,event){
		obj = audioElement = typeof(obj) == "object" ? obj : document.getElementById(obj);
		pbarEle = audioElement.parentNode.getElementsByClassName("ym-pgbar")[0];
		playedEle = audioElement.parentNode.getElementsByClassName("ym-played")[0];
		clickarea = event.clientX;
		awayleft =  getRect(audioElement.parentNode.querySelector(".ym-pgbar")).left;				//获取进度条到屏幕左边的距离
		divwidth = pbarEle.offsetWidth;
		clickwidth = clickarea - awayleft;
		pro = clickwidth / divwidth;
		obj.currentTime = obj.duration * pro;
		propercent = pro*100 + "%";
		playedEle.style.width = propercent;
	},
	/** Click to change volume */
	ChangeVol : function(obj , event){
		obj = audioElement = typeof(obj) == "object" ? obj : document.getElementById(obj);
		barEle = audioElement.parentNode.getElementsByClassName("volume-bar")[0];
		currentEle = audioElement.parentNode.getElementsByClassName("volume-current")[0];
		clickarea = event.clientX;
		awayleft =  getRect(barEle).left;
		divwidth = barEle.offsetWidth;
		clickwidth = clickarea - awayleft;
		pro = clickwidth / divwidth;
		if(pro>1) pro=1;
		obj.volume =  pro;
		propercent = pro*100 + "%";
		currentEle.style.width = propercent;
	},
	/** No volume event */
	Novol : function(obj){
		obj = document.getElementById(obj);
		if(obj.volume === 0){
			obj.volume = 1;
			btn = obj.parentNode.getElementsByClassName("vol-button");
			btn[0].innerHTML = "<i class=\"fa fa-volume-down\"></i>";				
		}
		else{
			obj.volume = 0;
			btn = obj.parentNode.getElementsByClassName("vol-button");
			btn[0].innerHTML = "<i class=\"fa fa-volume-off\"></i>";				
		}
	},
	/** Move mouse to change progress */
	Move : function(a,event){
		a = typeof a == 'object' ? a : document.getElementById(a);
		played = a.parentNode.getElementsByClassName("ym-played")[0];
		currentWidth = getRect(played).left;
		last = a.parentNode.getElementsByClassName("ym-pgbar")[0].offsetWidth;
		document.onmousemove = function(event){
			var x = event.clientX - currentWidth;
			floater = percent = x/last;
			percent = percent * 100;
			if(percent > 100) {percent = 100; floater = 1;}
			percent = percent + "%";
			played.style.width=percent;
			a.currentTime = a.duration * floater;
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
		}
	},
	/** Show play list */
	List : function(obj){
		obj = typeof obj == "object" ? obj : document.getElementById(obj);
		player = obj.parentNode;
		removeClass(player.querySelector(".ym-lrcbox"), 'ym-show');
		toggleClass(player.querySelector(".ym-playlist"), 'ym-show');
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
	changeAudio : function(player,list_item){
		var num = Number(list_item.querySelector('.list-number').innerHTML) - 1;
		par.querySelector(".ym-song").innerHTML = list_item.getAttribute('song');
		par.querySelector(".ym-artist").innerHTML = list_item.getAttribute('artist');
		par.querySelector(".ym-cover-image").style.backgroundImage = "url("+list_item.getAttribute('cover')+")";
		var elem_active_all = par.querySelectorAll(".single-active");
		for (var i = 0; i < elem_active_all.length; i++) {
			removeClass(elem_active_all[i], "single-active");
		}
		addClass(list_item, "single-active");
		var player = (typeof player == "object" ? player : document.getElementById(player));
		player.pause();
		player.currentTime = 0;
		player.setAttribute('src', list_item.getAttribute('src'));
		this.lrcParse(player, num);
		this.Play(player);
	},
	/** Show LRC Fixer Box */
	showFixer : function(obj){
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
	}
}
window.addEventListener('resize', Ymplayer.StyleByWidth);
Ymplayer.StyleByWidth();

function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) ? true : false;
}
function addClass(ele,cls) {
	if (!cls || hasClass(ele,cls)) {
		return;
	}
	if (ele.className) {
		ele.className += ' ' + cls;
	} else {
		ele.className = cls;
	}
}
function removeClass(ele,cls) {
	if (!cls) {
		return;
	}
	ele.className = ele.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)', 'g'), ' ').replace(/\s+/g, ' ').replace(/(^\s*)|(\s*$)/g, '');
	if (!ele.className) {
		ele.removeAttribute('class');
	}
}
function toggleClass(ele,cls) {
	if (hasClass(ele,cls)) {
		removeClass(ele,cls);
	} else {
		addClass(ele,cls);
	}
}
function getRect( elements ){ 
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
function remove(element) {
	element.parentNode.removeChild(element);
}
