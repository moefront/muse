var docElm = document.documentElement, fullscreenElement = document.fullscreenEnabled || document.mozFullscreenElement || document.webkitFullscreenElement;
var Ymplayer = {
	than : 3,
	/** Init YmPlayer */
	Init : function(){
		ymplayer = document.getElementsByTagName("ymplayer");	/** 获取 Tagname 为 ymplayer 的元素 */

		if(ymplayer.length != 0){
			for(var i = 0; i < ymplayer.length; i ++){
				tempID = ymplayer[i].getAttribute("name");
				songTag = ymplayer[i].getElementsByTagName("song");
				if(songTag.length == 0){
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
					single.setAttribute("ondblclick", "Ymplayer.changeAudio("+tempID+")");
					single.innerHTML = "<span class=\"list-number\">"+(t+1)+"</span>"
					+"<span class=\"list-song\">"+songTag[t].attributes.song.value+"</span>"
					+"<span class=\"list-artist\">"+songTag[t].attributes.artist.value+"</span>";
					t == 0 ? single.setAttribute("class","single-active") : "";
					listEle.appendChild(single);
					if(t == 0){
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
					par.getElementsByClassName("duration-time")[0].innerHTML = duration;				
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
		if(ae.buffered.end(ae.buffered.length - 1) <= ae.duration)
			ae.parentNode.getElementsByClassName("ym-buffed")[0].style.width = (ae.buffered.end(ae.buffered.length - 1) / ae.duration)*100+"%";
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
		player = audioElement.parentNode;
		lrcbox = player.getElementsByClassName("ym-lrcbox")[0];
		if(player.getAttribute("inited") != "showed"){
			if(!document.fullscreen || !document.webkitIsFullScreen || !document.mozFullScreen){
				player.getAttribute("inited") == "list" ? player.getElementsByClassName("ym-playlist")[0].style.height = "0px" : "";
				player.style.height = "400px";
				lrcbox.style.height = "290px";
				player.setAttribute("inited","showed");
			}
			else{
				player.getAttribute("inited") == "list" ? player.getElementsByClassName("ym-playlist")[0].style.height = "0px" : "";
				player.style.height = "100%";
				lrcbox.style.height = "84%";
				player.setAttribute("inited","showed");	
			}
		}
		else{
			if(!document.fullscreen || !document.webkitIsFullScreen || !document.mozFullScreen){
				player.style.height = "120px";
				lrcbox.style.height = "0px";
				player.setAttribute("inited","hidden");					
			}
			else{
				player.style.height = "100%";
				lrcbox.style.height = "0px";
				player.setAttribute("inited","hidden");		
			}

		}

	},
	/** Click to skip progress */
	Skip : function(obj,event){
		obj = audioElement = typeof(obj) == "object" ? obj : document.getElementById(obj);
		pbarEle = audioElement.parentNode.getElementsByClassName("ym-pgbar")[0];
		playedEle = audioElement.parentNode.getElementsByClassName("ym-played")[0];
		clickarea = event.clientX;
		awayleft =  audioElement.parentNode.offsetLeft + pbarEle.offsetLeft;
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
		if(obj.volume == 0){
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
		list = player.getElementsByClassName("ym-playlist")[0];
		if(player.getAttribute("inited") != "list"){
			if(player.getAttribute("inited") == "showed")
				player.getElementsByClassName("ym-lrcbox")[0].style.height = "0px";
			player.style.height = "400px";
			list.style.height = "290px";
			player.setAttribute("inited","list");
		}
		else{
			player.style.height = "120px";
			list.style.height = "0px";
			player.setAttribute("inited","hidden");		
		}	
	},
	/** Lrc sync */
	Lrc : function(obj){
		audioElement = document.getElementById(obj);
		parent = audioElement.parentNode;
		if(audioElement.paused != false)	return;
		time = audioElement.currentTime;
		all = audioElement.duration;
		lrcEle = parent.getElementsByTagName("lyric");
		long = lrcEle.length;
		currentLrc = parseInt(parent.getAttribute("currentLrc"));
		lrccontainer = parent.getElementsByClassName("lrc-container")[0];

		if(time > lrcEle[long-1].getAttribute("timeline"))		return false;

		if (time >= lrcEle[currentLrc].getAttribute("timeline")) {
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

					for (var i = 0 in lrcEle) {
						if (time > lrcEle[currentLrc].getAttribute("timeline")) {
							i++;
						} else {
							marginHeight = lrcEle[this.than - 1].offsetTop - lrcEle[currentLrc].offsetTop;
							lrccontainer.style.transform = "transformY("+marginHeight+"px)";							
							parent.setAttribute("currentLrc",i);
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
			parent.setAttribute("currentLrc",currentLrc+1);
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
			for (var s = 0 in lrcEle) {
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
					parent.setAttribute("currentLrc",s);
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
				if (lyric[x].match(/(ti:|ar:|by:)/)) {
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
	changeAudio : function(obj,event){
		obj = typeof obj == "object" ? obj : document.getElementById(obj);
		par = obj.parentNode;
		response = window.event.srcElement || window.event.target;
		num = parseInt(response.getElementsByClassName("list-number")[0].innerHTML)-1;
		obj.pause();
		obj.currentTime = 0;
		obj.attributes.src.value = response.attributes.src.value;
		par.querySelector(".ym-song").innerHTML = response.attributes.song.value;
		par.querySelector(".ym-artist").innerHTML = response.attributes.artist.value;
		par.querySelector(".ym-cover-image").style.backgroundImage = "url("+response.attributes.cover.value+")";
		active = par.querySelector(".single-active");	removeClass(active,"single-active");
		response.setAttribute("class","single-active");
		par.querySelector(".lrc-container").style.marginTop = "0px";
		this.lrcParse(obj,num);
		this.Play(obj);
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

function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
	if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
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