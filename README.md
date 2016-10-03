# YMPlayer

[![npm](https://img.shields.io/npm/v/npm.svg?maxAge=2592000)]()
[![devDependencies](https://img.shields.io/david/strongloop/express.svg?maxAge=2592000)]()
[![Build](https://img.shields.io/teamcity/http/teamcity.jetbrains.com/s/bt345.svg?maxAge=2592000)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

Just a simple and diligent HTML5 audio player made with ❤ :) (current version: 4)

## Install

YMPlayer has been published to **npmjs.com**, so you can install it from npm:
```shell
$ npm install ymplayer
```

Or, via Git repository :
```shell
$ git clone https://github.com/kirainmoe/ymplayer
$ cd ymplayer
$ npm install
```

Pay attention that YMPlayer used a dependency named **node-sass** may not be installed by npm successfully sometimes. To avoid that, run **npm install -g cnpm && cnpm install node-sass** yourself, or use **npm run setup** instead of command **npm install**.

## Run in your local machine

Run in webpack dev-server mode:

```shell
$ npm run serve
```

Run in dist mode:
```shell
$ npm run demo
```

## Online Demo

Have a look at https://kirainmoe.github.io/ymplayer/demo .

## Usage

#### Easily render player for single page

There are two methods for you to render a player on your own web page. Both of them requires you to import **ymplayer.js** at first. This file is included in the *dist/* directory. PS: Stylesheet has been injected in this Javascript file.

```html
<script type="text/javascript" src="./dist/ymplayer.js"></script>
```

You can render a player component as we used to construct *<ymplayer>* tag in DOM:

```html
<ymplayer>
	<song title="Your song title" artist="Your artist" cover="Album image src" src="Audio file src">
		<lyric>Your lyric here. If you do not have a raw lyric, delete this tag.</lyric>

		<translation>Translation should be put here. If you do not need a translation, delete this tag.</translation>
	</song>

	<!-- You can add far more musics by adding more <song> tag. -->
</ymplayer>
```

You are permitted to use ```YMPlayer.render()``` method to render a player in YMPlayer 4, just like this:

```javascript
/**
 * render a YMPlayer component on your page.
 *
 * @param data {Array}  musics' detail
 * @param node {Object} HTML element in which new player will be put.
 */

YMPlayer.render([{
	title: '',
	artist: '',
	cover: '',
	src: '',
	lyric: '',
	translation: ''			// if you do not need translation, delete this row.
}, {
	// ......
}], document.getElementById('player'));
```

#### Use player in your own project

Copy ```src/styles``` and ```src/components``` to your project directory, and import YMPlayer as an expoted class:

```javascript
import YMPlayer from './src/components/ymplayer.js';
```

## Related project

There are some project related to YMPlayer. They can help you construct YmPlayer on your site more easily.

 - Typecho Plugin YmPlayer by @kokororin : https://github.com/kokororin/typecho-plugin-ymplayer

_ (:з」∠) _ Thanks to my friend for her help~.

## Developing & APIs

You can find a detailed documentation about APIs, methods, specification, etc. on [WiKi](https://github.com/kirainmoe/ymplayer/wiki) soon.

## Troubleshooting

You can find most problems solution on [WiKi](https://github.com/kirainmoe/ymplayer/wiki). If not, please open an issue / pull a request whenever you face a problem or have some suggestions, or contact me at kirainmoe@gmail.com.

## Thanks

Thank those who have contributed to this project or solved problems: @frank-deng, @kokororin.

Thank those projects that make this player more easy and effective to be developed: Yeoman, generator-react-webpack as well as their dependence.

Finally, thanks to all of you for your likes, thanks to myself for the best code I have ever written.

## Browser supports

![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
IE 10+ ✔ | Chrome 24.0+ ✔ | Firefox 24.0+ ✔ | Opera 15.0+ ✔ | Safari 7.0+ ✔ |

PS: Because of the ClassList API, some elder browser can not be support well.

## Known issues

 - [x] <s>Can not parse [ti:] [ar:] [by:] [al:]</s> solved : )
 - [ ] Responsive design may not work well on Internet Explorer.
 - [ ] Lyric balloon may not display normally.

## Other

If you have any good idea, just tell me, let me make it come true. I NEED YOUR HELP TO MAKE THIS PLAYER BETTER !!

## Todo list

 - [x] Responsive design
 - [x] Play list
 - [x] Fullscreen mode (testing)
 - [x] Rendering method of pure Javascript
 - [ ] Right-click menu
 - [ ] Support of different environment

## License

The MIT License (MIT).

