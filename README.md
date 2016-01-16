# YmPlayer
Just a Music Player : )

---

### Description

一个简单的音乐播放器（颜值不高 _ (:з」∠) _），全 CSS/Javascript 完成，需要 Font-Awesome 图标库，无需 jQuery。

### Screenshot

正常形态：

![with no lrc](https://www.imim.pw/usr/uploads/with-no-lrc.jpg)

贴入 LRC 的时候：

![with lrc](https://www.imim.pw/usr/uploads/with-lrc.jpg)

### Plugin for Typecho

_ (:з」∠) _ 谢谢小伙伴的帮忙

[@kokororin](https://github.com/kokororin) : [typecho-plugin-ymplayer](https://github.com/kokororin/typecho-plugin-ymplayer)

### How to use?

> 引入 ymplayer.css 和 ymplayer.min.js：

```html
<link rel="stylesheet" type="text/css" href="ymplayer.css">
<script type="text/javascript" src="ymplayer.min.js"></script>
```

//注意：需要引入 font-awesome 图标库，可以自行引入，也可以复制 /demo/res/ 下的文件并引入 /demo/font-awesome.css 。

> 构造 HTML DOM：

//如果没有歌词

```html
<ymplayer src="mp3 文件地址" name="标识ID，支持 0-9 A-Z a-z _" song="歌曲名" artist="歌手" cover="歌曲专辑封面" loop="是否单曲循环，yes or no"></ymplayer>
```

//如果有歌词

```html
<ymplayer src="mp3 文件地址" name="标识ID，支持 0-9 A-Z a-z _" song="歌曲名" artist="歌手" cover="歌曲专辑封面" loop="是否单曲循环，yes or no">
	<lrc>歌词内容</lrc>
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

```
$(document).pjax("end",function(){
	YmplayerIniter();
});
```

### Other

目前处于 Alpha 阶段，在不同的站点上可能出现不同程度的错位，还请自己解决。

欢迎开 issues 报告问题。

### To do

- [ x ] 播放进度拖拽控制（目前支持点击控制）
- [ x ] 响应式的优化
- [ ] 多音乐播放（播放列表）
- [ ] 更多种形态和颜色

### License

遵循 GPL v2 开源。
