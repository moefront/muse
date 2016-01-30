# YmPlayer
Just a Music Player : )

### Description

一个简单的音乐播放器（颜值不高 _ (:з」∠) _），全 CSS/Javascript 完成，需要 Font-Awesome 图标库，无需 jQuery。

-----

### Screenshot

正常形态：

![with no lrc](https://www.imim.pw/usr/uploads/with-no-lrc.jpg)

贴入 LRC 的时候：

![with lrc](https://www.imim.pw/usr/uploads/with-lrc.jpg)

播放列表：

![with list](https://www.imim.pw/usr/uploads/with-playlist.jpg)

### Plugins

以下是一些将 YmPlayer 和别的程序融合的产物（好像怪怪的）……使用它们可以十分方便快速地调用 YmPlayer。

##### Typecho Plugin YmPlayer

_ (:з」∠) _ 谢谢小伙伴的帮忙

[@kokororin](https://github.com/kokororin) : https://github.com/kokororin/typecho-plugin-ymplayer

### How to use?

> 引入 ymplayer.css 和 ymplayer.js：

```html
<link rel="stylesheet" type="text/css" href="ymplayer.css">
<script type="text/javascript" src="ymplayer.js"></script>
```

//注意：需要引入 font-awesome 图标库，可以自行引入，也可以复制 /demo/res/ 下的文件并引入 /demo/font-awesome.css 。

> 构造 HTML DOM：

//如果没有歌词

```html
<ymplayer  name="标识ID，支持 0-9 A-Z a-z _" loop="是否单曲循环，yes or no">
	<song  src="mp3 文件地址" song="歌曲名" artist="歌手" cover="歌曲专辑封面"></song>
</ymplayer>
```

//如果有歌词

```html
<ymplayer  name="标识ID，支持 0-9 A-Z a-z _" loop="是否单曲循环，yes or no">
	<song  src="mp3 文件地址" song="歌曲名" artist="歌手" cover="歌曲专辑封面">歌词内容</song>
</ymplayer>
```

//如果有多首歌
```html
<ymplayer  name="标识ID，支持 0-9 A-Z a-z _" loop="是否单曲循环，yes or no">
	<song  src="mp3 文件地址1" song="歌曲名1" artist="歌手1" cover="歌曲专辑封面1">歌词内容1</song>
	<song  src="mp3 文件地址2" song="歌曲名2" artist="歌手2" cover="歌曲专辑封面2">歌词内容2</song>
</ymplayer>
```

### Argument

```
src    string    歌曲文件的地址，必填

name     string    标识ID，用于在一个页面摆放多个 YmPlayer 时区分，*必须唯一*

song      string     歌曲名

artist       string     歌手

cover      string      专辑封面，或者你喜欢的图片

loop      string       是否开启单曲循环，如果是填写 yes ， 否则填 no，在播放时可以通过播放器按钮改动
```

### Color your YmPlayer!

YmPlayer 内置了好多好多种配色方案（由于时间有限，目前只适配包括原版在内的 5 种配色方案）。

> 浅蓝色：默认颜色

> 橙色：在 <ymplayer> 标签添加： class="honoka"

> （近似灰色）？：在 <ymplayer> 标签添加：  class="kotori"

> 深蓝色：在 <ymplayer> 标签添加：  class="umi"

> 粉色：在 <ymplayer> 标签添加：  class="nico"

其他的方案日后将会完善_ (:з」∠) _

### Issues

> Q:使用 PJAX 时不加载 YmPlayer 怎么办 _ (:з」∠) _
A:在 PJAX 的 end 事件中，插入 YmPlayer 的 Initer 函数，如：

```javascript
$(document).pjax("end",function(){
	YmplayerIniter();
});
```

### Other

目前处于 Beta 阶段，在不同的站点上可能出现不同程度的错位，还请自己解决，或者开 issues 告知作者。

欢迎开 issues 报告问题。

**不求您 star，不求您向他人推荐（当然如果您愿意也是可以哒_(:з」∠)_）如果您喜欢 YmPlayer，就请多多给我们提出意见或者建议，有什么 idea 告诉我们让我们帮你实现。YmPlayer 的完善需要您的帮助！**

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

遵循 GPL v2 开源。
