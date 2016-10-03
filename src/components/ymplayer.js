/**
 * YMPlayer: Just a simple and diligent HTML5 audio player made with love.
 *
 * @package  ymplayer
 * @author   kirainmoe
 * @version  4.0
 * @link     https://github.com/kirainmoe/ymplayer
 * @license  MIT
 */

'use strict';

/* import scss stylesheet through Webpack sass-loader */
require('../styles/ymplayer.scss');

class YMPlayer
{
	/**
	 * SVG icons
	 *
	 * @type {Object}
	 */
	icons = {
		pause : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45zm-896 0v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45z"/></svg>',
		play : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1576 927l-1328 738q-23 13-39.5 3t-16.5-36v-1472q0-26 16.5-36t39.5 3l1328 738q23 13 23 31t-23 31z"/></svg>',
		stop : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 192v1408q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h1408q26 0 45 19t19 45z"/></svg>',
		loop : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1639 1056q0 5-1 7-64 268-268 434.5t-478 166.5q-146 0-282.5-55t-243.5-157l-129 129q-19 19-45 19t-45-19-19-45v-448q0-26 19-45t45-19h448q26 0 45 19t19 45-19 45l-137 137q71 66 161 102t187 36q134 0 250-65t186-179q11-17 53-117 8-23 30-23h192q13 0 22.5 9.5t9.5 22.5zm25-800v448q0 26-19 45t-45 19h-448q-26 0-45-19t-19-45 19-45l138-138q-148-137-349-137-134 0-250 65t-186 179q-11 17-53 117-8 23-30 23h-199q-13 0-22.5-9.5t-9.5-22.5v-7q65-268 270-434.5t480-166.5q146 0 284 55.5t245 156.5l130-129q19-19 45-19t45 19 19 45z"/></svg>',
		list : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M256 1312v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm1536 768v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm-1536-1152v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm1536 768v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5z"/></svg>',
		lyric : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1596 476q14 14 28 36h-472v-472q22 14 36 28zm-476 164h544v1056q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h800v544q0 40 28 68t68 28zm160 736v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23zm0-256v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23zm0-256v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23z"/></svg>',
		volume : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1088 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45zm384 544q0 76-42.5 141.5t-112.5 93.5q-10 5-25 5-26 0-45-18.5t-19-45.5q0-21 12-35.5t29-25 34-23 29-35.5 12-57-12-57-29-35.5-34-23-29-25-12-35.5q0-27 19-45.5t45-18.5q15 0 25 5 70 27 112.5 93t42.5 142z"/></svg>',
		mute : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1280 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45z"/></svg>',
		angleUp : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z"/></svg>',
		angleDown : '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"/></svg>'
	}

	balloonState = true
	fullscreenState = false

	/**
	 * constructor function, register self to global window
	 *
	 * @return {void}
	 */
	constructor () {
		window.YMPlayer = this;
		window.addEventListener('load', this.init.bind(this));
	}

	/**
	 * initialize YMPlayer DOM node structure
	 *
	 * @return {this}
	 */
	init () {
		if (!document.querySelectorAll)	throw('YMPlayer requires Internet Explorer 10 or higher version.');

		let ymplayers = document.querySelectorAll('ymplayer, .ymplayer');
		if (ymplayers.length != 0) {
			for (let i in ymplayers)
				if (ymplayers[i] instanceof HTMLElement)	this.serialize(ymplayers[i]);
		}
		
		return this;
	}

	/**
	 * serialize YMPlayer
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	serialize (element) {
		if (!document.createElement('audio').play) {
			element.innerHTML = '<div class="yp-upgradeBrowser">It seems that your browser does not support HTML 5 Audio.</div>';
			return false;
		}

		if (element.querySelector('audio'))	return;			// serialized

		element.setAttribute('box', 'inactive');
		element.oncontextmenu = e => e.preventDefault();

		this.resizer(element);
		window.addEventListener('resize', () => this.resizer(element));

		/* Init play list */
		var firstSingle = undefined,
				songTags = element.querySelectorAll('song'),
				singleArray = [],
				refs = this;

		for (var t = 0; t < songTags.length; t ++)
		{
			var single = this.make('single', {
				index: t,
				src: songTags[t].attributes.src.value,
				title: songTags[t].attributes.title.value,
				artist: songTags[t].attributes.artist.value,
				cover: songTags[t].attributes.cover.value
			}, [
				this.make('span', 'class=yp-listNumber', String(t + 1)),
				this.make('span', 'class=yp-listTitle', songTags[t].attributes.title.value),
				this.make('span', 'class=yp-listArtist', songTags[t].attributes.artist.value)
			], {
				click: function () {	refs.change(element, this, true);	}		// there should not have a => func
			});

			singleArray.push(single);				// push single element to array

			if (t === 0) {
				single.classList.add('yp-currentSingle');
				firstSingle = single;
			}
		}

		/* Progress bar element */
		var ProgressBar = this.make('div', 'class=yp-progressBar', [
				this.make('div', 'class=yp-progressBar__outside',
					this.make('div', 'class=yp-progressBar__inner', [
							this.make('span', 'class=yp-circle|for=progressBar', null, {
								mousedown: () => {
									element.setAttribute('drag', 'progressDragging');
									refs.mouseEvent = document.body.onmousemove;

									document.body.onmousemove = function (e) {
										refs.changeProgress(element, e);
										this.onmouseup = () => this.onmousemove = refs.mouseEvent;
									}
								} // mousedown
							}),
							this.make('div', 'class=yp-lyricBalloon|inactive=yes|empty=true', '<p></p><span class="yp-tail"></span>', {
								click: e => { e.preventDefault(); e.stopPropagation(); return; }
							})
						]) // inner
				,
				// 处理点击改变进度的事件
				{
					click: e => { element.setAttribute('drag', 'progress'); refs.changeProgress(element, e); }
				})
			]);

		/* Controller bar component */
		var Controller = this.make('div', 'class=yp-controller', [
			// single info for album image and title & artist
			this.make('div', 'class=yp-singleInfo', [
				this.make('div', { className: 'yp-albumImg', style: 'background-image: url();' }),
				this.make('div', 'class=yp-singleDetail', [
					this.make('p', 'class=yp-singleTitle', null),
					this.make('p', 'class=yp-singleArtist', null)
				])
			]),
			// toggler for buttons
			this.make('div', 'class=yp-toggler', [
				this.make('i', 'class=yp-button__play', this.icons.play, {click: () => this.togglePlay(element) }),
				this.make('i', 'class=yp-button__stop', this.icons.stop, {click: () => this.stop(element) }),
				this.make('i', 'class=yp-button__loop', this.icons.loop, {click: () => this.toggleLoop(element) }),
				this.make('i', 'class=yp-button__list', this.icons.list, {click: () => this.toggleBox(element) }),
				this.make('div', 'class=yp-volumeBar', [
					this.make('div', 'class=yp-volumeBar__inner', [this.make('span', 'class=yp-circle')])
				], {	click: function (e) {	refs.changeVolume(element, e);	}	})
			])
		]);

		/* Box component */
		var ExtendBox = this.make('div', 'class=yp-extendBox', [
			this.make('div', 'class=yp-lyricBox', [
				this.make('div', 'class=yp-lyricContainer'),
				this.make('div', 'class=yp-lrcFixer|disabled=disabled', [
					/* Lyric timeline fixer  */
					this.make('span', 'class=yp-fixButton__slower|title=将歌词延后 0.5s', this.icons.angleUp, {
						click: e => {
							if (this.parentNode.getAttribute('disabled'))	return;
							e.preventDefault();			e.stopPropagation();
							element.setAttribute('current-lrc-timeoffset', Number(element.getAttribute('current-lrc-timeoffset')) - 0.5);
							refs.syncLyric(element);
						}
					}),
					this.make('span', 'class=yp-fixButton__faster|title=将歌词提前 0.5s', this.icons.angleDown, {
						click: e => {
							if (this.parentNode.getAttribute('disabled'))	return;
							e.preventDefault();			e.stopPropagation();
							element.setAttribute('current-lrc-timeoffset', Number(element.getAttribute('current-lrc-timeoffset')) + 0.5);
							refs.syncLyric(element);
						}
					})
				])
			], {
				click: () => refs.toggleFixer(element)
			}),
			this.make('div', 'class=yp-playList', singleArray)
		]);

		var AudioComponent = this.make('audio', 'preload=no', null, {
			// 播放事件
			play: () => element.setAttribute('playing', 'playing'),
			// 暂停事件
			pause: () => element.removeAttribute('playing'),
			// 加载错误
			error: () => {
				var currentSingle = element.querySelector('.yp-currentSingle');
				if (!currentSingle)
					return;
				var nextSingle = currentSingle.nextSibling;
				if (!nextSingle)
					return;
				refs.change(element, nextSingle, true);
			},
			// 播放结束
			ended: () => {
				element.removeAttribute('playing');		// remove play state
				var currentSingle = element.querySelector('.yp-currentSingle');
				if (element.getAttribute('loop') == 'true') {
					refs.change(element, currentSingle, true);
				} else {
					currentSingle.nextSibling ? refs.change(element, currentSingle.nextSibling, true) : '';
				}
			},
			// 音量变化事件
			volumechange: () => element.querySelector('.yp-volumeBar__inner').style.width = String(this.volume * 100) + '%',
			// 播放进度变化事件
			timeupdate: function () {
				var percent = this.currentTime / this.duration,
						innerBar = element.querySelector('.yp-progressBar__inner');
				innerBar.style.width = String(percent * 100) + '%';
				refs.syncLyric(element, this.currentTime);		// sync lyric when time update
			}
		});
		var YMPlayerContainer = this.make('div', 'class=yp-container', [ProgressBar, Controller, ExtendBox, AudioComponent], {
			mousedown: e => e.button == 2 ? refs.requestFullscreen(element) : false
		});

		element.appendChild(YMPlayerContainer);

		if (firstSingle) {
			this.change(element, firstSingle, false);
		}

		return this;
	}

	/**
	 * Play / pause toggler
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	togglePlay (element) {
		let audioElement = element.querySelector('audio'),
				playBtn      = element.querySelector('.yp-button__play');
			
		if (audioElement.paused !== false) {
			playBtn.innerHTML = this.icons.pause;
			audioElement.play();
			if (element.getAttribute('box') == 'inactive')
				element.querySelector('.yp-lyricBalloon').setAttribute('inactive', 'no');
				this.balloonState ? this.changeBalloonPosition(element) : '';
		} else {
			playBtn.innerHTML = this.icons.play;
			audioElement.pause();

			element.querySelector('.yp-lyricBalloon').setAttribute('inactive', 'yes');
		}
		return this;
	}

	/**
	 * Stop playing audio
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	stop (element) {
		let audioElement = element.querySelector('audio'),
				balloon 		 = element.querySelector('.yp-lyricBalloon');

		element.setAttribute('playing', 'stoped');
		element.querySelector('.yp-button__play').innerHTML = this.icons.play;

		audioElement.pause();
		audioElement.currentTime = 0;

		balloon.setAttribute('inactive', 'yes');
		balloon.setAttribute('empty', 'true');

		return this;
	}

	/**
	 * Loop toggler
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	toggleLoop (element) {
		let currentState = element.getAttribute('loop'),
				button = element.querySelector('.yp-button__loop > svg > path');
		if (currentState == 'true') {
			element.setAttribute('loop', 'false');
			button.style.fill =  '#FFF';
		} else {
			element.setAttribute('loop', 'true');
			button.style.fill =  '#B3E5FC';
		}
		return this;
	}

	/**
	 * Lyric syncing
	 *
	 * @param  {Object} element
	 * @param  {Number} currentTime
	 * @return {this}
	 */
	syncLyric (element, currentTime) {
		if (!element.getAttribute('current-lrc'))	return;
		let time         = undefined == currentTime ? element.querySelector('audio').currentTime : currentTime,
				lyricsAll    = element.querySelectorAll('.yp-lyricContainer > lyric'),
				currentLyric = undefined;

		time += Number(element.getAttribute('current-lrc-timeoffset'));

		for (let i = 0;i < lyricsAll.length - 1; i ++)
		{
			let timeNow  = Number(lyricsAll[i].getAttribute('timeline')),
					timeNext = Number(lyricsAll[i + 1].getAttribute('timeline'));
			if (i <= 0 && time < timeNow) {
				currentLyric = -1;
			} else if (i == lyricsAll.length - 2 && time > timeNext) {
				currentLyric = i + 1;
			} else if (time < timeNext && time >= timeNow) {
				currentLyric = i;
			}
		}

		// failed to select lyric
		if (currentLyric === undefined)
			currentLyric = -1;

		// update lyric
		element.setAttribute('current-lrc', currentLyric);

		let lyricSelected  = element.querySelectorAll('.yp-currentLyric'),
				lyricBox       = element.querySelector('.yp-lyricBox'),
				lyricContainer = element.querySelector('.yp-lyricContainer');
		for (let i = 0; i < lyricSelected.length; i ++)
			lyricSelected[i].classList.remove('yp-currentLyric');

		if (currentLyric < 0) {
			lyricContainer.setAttribute('style', 'transform: translateY(0px)');
		} else {
			lyricsAll[currentLyric].classList.add('yp-currentLyric');

			/* Lyric balloon */

			if (currentLyric != -1) {
				let lyricContent = lyricsAll[currentLyric].querySelector('.yp-lyricContent'),
						balloon      = element.querySelector('.yp-lyricBalloon > p'),
						temp         = lyricsAll[currentLyric].getElementsByTagName('p')[0];

				if (lyricContent)	lyricContent = lyricContent.innerHTML;

				if (typeof temp != 'undefined') {
					balloon.parentNode.style.width = temp.offsetWidth + 'px';
					this.balloonState ? this.changeBalloonPosition(element) : '';
				}
				balloon.innerHTML = lyricContent;

				if (lyricContent == null) 	balloon.parentNode.setAttribute('empty', 'true');
				else if (balloon.parentNode.hasAttribute('empty'))	balloon.parentNode.removeAttribute('empty');
			}

			let boxHeight    = this.fullscreenState ? document.body.offsetHeight - 60 : lyricBox.offsetHeight,
					targetOffset = lyricsAll[currentLyric].offsetTop - Math.abs(boxHeight - lyricsAll[currentLyric].offsetHeight) / 2;
			if (targetOffset < 0) { targetOffset = 0; }

			let transf = String(-targetOffset);
			lyricContainer.setAttribute('style', 'transform: translateY(' + transf + 'px);'
				+ '-webkit-transform: translateY(' + transf + 'px);'
				+ '-moz-transform: translateY(' + transf + 'px);'
				+ '-ms-transform: translateY(' + transf + 'px);');
		}
		return this;
	}

	/**
	 * Lyric fixer toggler
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	toggleFixer (element) {
		if (element.hasAttribute('current-lrc')) {
			let fixer = element.querySelector('.yp-lrcFixer');
			if (fixer.getAttribute('disabled'))
				fixer.removeAttribute('disabled');
			else
				fixer.setAttribute('disabled', 'disabled');
		}
		return this;
	}

	/**
	 * Dynamic change lyric balloon position
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	changeBalloonPosition (element) {
		let length  = this.getRect(element.querySelector('.yp-circle[for="progressBar"]')).left - this.getRect(element).left + 8,			// add circle width / 2
				balloon = element.querySelector('.yp-lyricBalloon');
		balloon.style.left = String(Math.round(length) - balloon.offsetWidth / 2) + 'px';
		return this;
	}

	/**
	 * Change play progress
	 *
	 * @param  {Object} element
	 * @param  {Object} event
	 * @return {this}
	 */
	changeProgress (element, event) {
		let audioElement = element.querySelector('audio'),
				progressBar  = element.querySelector('.yp-progressBar'),
				progressRect = this.getRect(progressBar);
		if (!isNaN(audioElement.duration)) {
			audioElement.currentTime = audioElement.duration * (event.clientX - progressRect.left) / progressBar.offsetWidth;
		}
		return this;
	}

	/**
	 * Change player volume
	 *
	 * @param  {Object} element
	 * @param  {Object} event
	 * @return {this}
	 */
	changeVolume (element, event) {
		let audioElement = element.querySelector('audio'),
				volBar  = element.querySelector('.yp-volumeBar'),
				volRect = this.getRect(volBar),
				percentage = (event.clientX - volRect.left) / volBar.offsetWidth;
		audioElement.volume = percentage;
		volBar.querySelector('.yp-volumeBar__inner').style.width = percentage * 100 + '%';
		return this;
	}

	/**
	 * Parsing lyric and translation
	 *
	 * @param  {Object} element
	 * @param  {Number} index
	 * @return {this}
	 */
	parseLrc (element, index) {
		element.removeAttribute('current-lrc');
		element.removeAttribute('current-lrc-timeoffset');

		let lrcContainer = element.getElementsByClassName('yp-lyricContainer'),
				temp 				 = element.querySelectorAll('song')[index].querySelector('lyric'),
				result 			 = [];
		lrcContainer[0].innerHTML = '';			// make current container empty

		if (!temp) {
			lrcContainer[0].innerHTML = '<div class="yp-nolyric" style="text-align: center;"><p>没有找到这首歌的歌词 OvO 请欣赏。</p></div>';
			lrcContainer[0].style.transform = 'translateY(0px)';
		} else {
			var lyricData = temp.innerHTML.replace(/\\n/g, '\n').replace(/\\r/g, '\r');		// replace \\n and \\r for netease cloud music lyric...
		}

		if (!lyricData)	return false;

		let linesAll = String(lyricData).split('\n');

		for (let i = 0; i < linesAll.length; i ++)
		{
			let line = linesAll[i].replace(/(^\s*)|(\s*$)/g,'');
			if (!line || line.match(/\[(ti:|ar:|al:|by:)/g))		// filter [ti:xxx] [ar:xxx]...
				continue;

			let timestamps = [],
					match = /^(\[\d+:\d+(.\d+)?\])(.*)/g.exec(line);
			if (match) {
				timestamps.push(match[1]);
				line = match[match.length-1].replace(/(^\s*)|(\s*$)/g,'');
			} else {
				break;
			}	// if

			for (let j = 0; j < timestamps.length; j ++)
			{
				let tcmatch = /^\[(\d{1,2}):(\d|[0-5]\d)(\.(\d+))?\]$/g.exec(timestamps[j]);
				if (tcmatch) {
					result.push({
						timestamp: Number(tcmatch[1]) * 60 + Number(tcmatch[2]) +
												(tcmatch[4] ? Number('0.' + tcmatch[4]) : 0),
						text: line
					});
				} // if
			} // for
		}// for

		/* arrange */
		result.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);

		/* Translation parse */
		let translation = element.querySelectorAll('song')[index].querySelectorAll('translation'),
				parsedTrans = [],		translationEnable = false;
		if (translation.length > 0) {
			translation = translation[0].innerHTML.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
										.split('\n'), translationEnable = true;
			for (let l = 0; l < translation.length; l ++)
				parsedTrans.push(translation[l]);
		}

		if (result.length > 0) {
			for (let k = 0; k < result.length; k ++) {
				let lyricElement = this.make('lyric', {
					timeline: result[k].timestamp
				}, (result[k].text ? '<p>' + '<span class="yp-lyricContent">' + result[k].text + '</span>' +
					 (translationEnable ? '<br><span class="yp-translation">' + parsedTrans[k] : '</span>') + '</p>' : ''));

				lrcContainer[0].appendChild(lyricElement);
			} // for
			element.setAttribute('current-lrc', -1);
			element.setAttribute('current-lrc-timeoffset', 0);
		} // if

		return this;
	}

	/**
	 * Display or hide extend box
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	toggleBox (element) {
		let boxState = element.getAttribute('box');

		if (boxState == 'active') {
			element.setAttribute('box', 'inactive');
			element.classList.remove('yp-boxActived');
			this.balloonState ? element.querySelector('.yp-lyricBalloon').setAttribute('inactive', 'no') : '';
		}
		else {
			element.setAttribute('box', 'active');
			element.classList.add('yp-boxActived');
			element.querySelector('.yp-lyricBalloon').setAttribute('inactive', 'yes');
		}

		return this;
	}

	/**
	 * reset player width : responsive design
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	resizer (element) {
		let width = element.offsetWidth;
		if (width <= 640) {
			this.balloonState = false;
			let balloon = element.querySelector('.yp-lyricBalloon');
			if (balloon) balloon.setAttribute('inactive', 'yes');

			width <= 500 ? element.classList.add('yp-responsive__500px') : element.classList.add('yp-responsive__640px');
		} else {
			this.balloonState = true;
			element.classList.toggle('yp-responsive__640px', false);
			element.classList.toggle('yp-responsive__500px', false);
		}
		return this;
	}

	/**
	 * Change current single
	 *
	 * @param  {Object} element
	 * @param  {Object} nextSingle
	 * @param  {Boolean} autoplay
	 * @return {this}
	 */
	change (element, nextSingle, autoplay) {
		let player = element.querySelector('audio');

		element.removeAttribute('playing');
		element.querySelector('.yp-singleTitle').innerHTML = nextSingle.getAttribute('title');
		element.querySelector('.yp-singleArtist').innerHTML = nextSingle.getAttribute('artist');
		element.querySelector('.yp-albumImg').setAttribute('style', 'background-image: url('
			+ nextSingle.getAttribute('cover') + ');');
		element.querySelectorAll('single.yp-currentSingle')[0].classList.remove('yp-currentSingle');
		nextSingle.classList.add('yp-currentSingle');

		player.setAttribute('src', nextSingle.getAttribute('src'));
		this.parseLrc(element, nextSingle.getAttribute('index'));
		
		if (autoplay) {
			this.stop(element).togglePlay(element);
		}

		return this;
	}

	getRect (elements) {
		let rect 			 = elements.getBoundingClientRect(),
				clientTop  = document.documentElement.clientTop,
				clientLeft = document.documentElement.clientLeft;
		return {
			top : rect.top - clientTop,
			bottom : rect.bottom - clientTop,
			left : rect.left - clientLeft,
			right : rect.right - clientLeft
		};
	}

	inRect (rect, x, y) {
		return ((x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) ? true : false);
	}

	/**
	 * enter or exit fullscreen mode
	 *
	 * @param  {Object} element
	 * @return {this}
	 */
	requestFullscreen (element) {
		function getFullscreenState () {
			return document.fullscreenElement ? true :
						 document.webkitFullscreenElement ? true :
						 document.mozFullscreenElement ? true : false;
		}

		if (!getFullscreenState()) {

			var state = element.requestFFullscreenElementullscreen ? element.requestFullscreen() || true :
			element.webkitRequestFullscreen ? element.webkitRequestFullscreen() || true :
			element.mozRequestFullscreen ? element.mozRequestFullscreen() || true : false;

			if (!state) { throw('Microsoft 家的 Internet Explorer 暂时不支持（以后也不会支持） HTML5 fullscreen API.'); }

			this.fullscreenState = true;
			element.setAttribute('box', 'active');
		}
		else {
			document.exitFullscreen ? document.exitFullscreen() :
			document.webkitExitFullscreen ? document.webkitExitFullscreen() :
			document.mozExitFullscreen ? document.mozExitFullscreen() : '';

			this.fullscreenState = false;
			element.setAttribute('box', 'inactive');
			element.classList.toggle('yp-boxActived', false);
		}
		return this;
	}

	/**
	 * DOM Node creator
	 *
	 * @param  {string} element
	 * @param  {mixed} extra
	 * @param  {mixed} inner
	 * @param  {Object} events
	 * @return {Object}
	 */
	make (element, extra, inner, events) {
		var node = document.createElement(element);

		/* Inject attributes */
		if (extra && extra != null) {
			switch(typeof extra)
			{
				case 'string':
					var attrs = extra.split('|');
					attrs.forEach(function(index) {
						var detail = index.split('=');
						node.setAttribute(detail[0], detail[1]);
					});
					break;

				case 'object':
					for (var i in extra)
					{
						if (i == 'className')
							var attrName = 'class';
						else
							var attrName = i;
						node.setAttribute(attrName, extra[i]);
					}
					break;
			} // switch
		} // if

		/* Dangerously set inner content */
		if (inner && inner != null) {
			switch (typeof inner)
			{
				case 'object':
					inner instanceof HTMLElement ? node.appendChild(inner) :
					inner instanceof Array ? (inner.forEach(function (index) {
						node.appendChild(index);
					})) : '';
					break;

				case 'string':
					node.innerHTML = inner;
					break;
			}
		}

		/* Event listener */
		if (events && events != null) {
			for (var eventName in events)
			{
				node.addEventListener(eventName, events[eventName]);
			}
		}

		/* stringify for setting innerHTML */
		if (extra && extra.stringify) {
			var virtualDOM = document.createElement('div');
			virtualDOM.appendChild(node);
			return virtualDOM.innerHTML;
		}

		return node;
	}
	/**
	 * YMPlayer renderer
	 *
	 * @param  {Array} items
	 * @param  {Object} ele
	 * @return {this}
	 */
	render (items, ele) {
		let singles = [];
		items.forEach(index => {
			let title       = index.title,
					artist      = index.artist,
					albumImg    = index.cover,
					src 				= index.src,
					lyric       = index.lyric,
					translation = index.translation ? index.translation : undefined;

			let temp = [this.make('lyric', null, lyric)];
			translation == undefined ? '' : temp.push(this.make('translation', null, translation));

			let single = this.make('song', {
				title: title,
				artist: artist,
				cover: albumImg,
				src: src
			}, temp);

			singles.push(single);
		});

		let node = this.make('ymplayer', null, singles);
		ele.appendChild(node);
		this.serialize(node);
		return node;
	}
}

export default YMPlayer;
