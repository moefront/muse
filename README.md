# YmPlayer
Just a Music Player : )

### Description

A simple HTML5 music player with lyric support and play list.

### Demo

See https://kirainmoe.github.io/ymplayer/demo/ .

### Related Project

There are some project related to YmPlayer. They can help you construct YmPlayer on your site more easily.

##### Typecho Plugin YmPlayer

_ (:з」∠) _ Thanks to my friend for her help~.

[@kokororin](https://github.com/kokororin) : https://github.com/kokororin/typecho-plugin-ymplayer

### How to use?

> Import CSS and Javascript File, you can find them in the directory ./dist/ .

Insert the code below into your <head> tag.

```html
<link rel="stylesheet" type="text/css" href="ymplayer.css">
<script type="text/javascript" src="ymplayer.js"></script>
```

> Construct HTML DOM

//If there isn't any lyric

```html
<ymplayer  name="给你的播放器一个 独一无二 的名字，支持 0-9 A-Z a-z _">
	<song  src="歌曲文件地址" song="歌曲名" artist="歌手" cover="歌曲专辑封面"></song>
</ymplayer>
```

//Else

```html
<ymplayer  name="给你的播放器一个 独一无二 的名字，支持 0-9 A-Z a-z _">
	<song  src="歌曲文件地址" song="歌曲名" artist="歌手" cover="歌曲专辑封面">
		把歌词内容填写在这里
	</song>
</ymplayer>
```

//如果有多首歌
```html
<ymplayer  name="给你的播放器一个 独一无二 的名字，支持 0-9 A-Z a-z _">
	<song  src="歌曲文件地址1" song="歌曲名1" artist="歌手1" cover="歌曲专辑封面1">
		把歌曲 1 的歌词内容填写在这里
	</song>

	<song  src="歌曲文件地址2" song="歌曲名2" artist="歌手2" cover="歌曲专辑封面2">
		把歌曲 2 的歌词内容填写在这里
	</song>
</ymplayer>
```

> Finally we should init the YmPlayer

Add the code below before your <body> tag end.

```html

<script type="text/javascript">
	window.Ymplayer.Init();
</script>

```

### Params

| Param Name    | Type    | Description                                                                   					|
| --------------------- | --------- | ------------------------------------------------------------------------------|
| src           					 | string  | <song> 标签的属性，歌曲文件的地址，必填        			        |
| name      					 | string  | <ymplayer> 标签的属性，标识ID，必须唯一 										 |
| song									 | string	 | <song> 标签的属性，歌曲																										 |
| artist				          | string	| <song> 标签的属性，歌手																											 |
| cover									 | string	 | <song> 标签的属性，专辑封面，或者你喜欢的图片			   		|
| loop										| string	| <ymplayer> 标签的属性，是否开启单曲循环，yes or no	 |


### Color your YmPlayer!

Light Blue : default color.

Orange : add ```class="honoka"``` to <ymplayer> tag.

Grey : add ```class="kotori"``` to <ymplayer> tag.

Deep Blue : add ```class="umi"``` to <ymplayer> tag.

Pink : add add ```class="nico"``` to <ymplayer> tag.

 More color is discovering ! _ (:з」∠) _


 ### Interface (API)

Go to wiki and learn more about APIs of YmPlayer. 

### Issues

> Q: 使用 PJAX 时，新页面的 YmPlayer  无法 Init
A: 在 PJAX 的 end 事件中，使用 YmPlayer 的 Init 方法。

以 jquery-pjax 库为例，如：

```javascript
$(document).pjax("end",function(){
	window.Ymplayer.Init();
});
```

再以 PJAX.js 为例：

```javascript
document.addEventListener("pjax:complete", function () {
	window.Ymplayer.Init();
});
```

### Other

If there are any problems, please open an issue and talk about it with me.
But you may need to try to fix it by yourself on some occasions.

**If you have any good idea, just open an issue and tell me, let me make it come true.
WE NEED YOUR HELP TO MAKE THIS PLAYER BETTER !!**

### To do

- [x] 播放进度拖拽控制（目前支持点击控制）
- [x] 响应式的优化
- [x] 多音乐播放（播放列表） 注：目前处于 Alpha 阶段！
- [ ] 更多种形态和颜色
- [ ] 类似2.0的全屏模式
- [ ] 右键菜单啥的
- [ ] 调整不同环境下的兼容性
- [ ] 无需构建 HTML DOM 的调用方法？

### License

The MIT License (MIT).
