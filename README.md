# ymplayer
Just a Music Player : )

---

### Description

一个简单的音乐播放器（颜值不高 _ (:з」∠) _），全 CSS/Javascript 完成，需要 Font-Awesome 图标库，无需 jQuery。

### Screenshot

正常形态：

![with no lrc](https://www.imim.pw/usr/uploads/with-no-lrc.jpg)

贴入 LRC 的时候：

![with lrc](https://www.imim.pw/usr/uploads/with-lrc.jpg)

### How to use?

> 引入 ymplayer.css 和 ymplayer.min.js：

```
<link rel="stylesheet" type="text/css" href="ymplayer.css">
<script type="text/javascript" src="ymplayer.min.js"></script>
```

> 构造 HTML DOM：

//如果没有歌词

```
<ymplayer src="mp3 文件地址" name="标识ID，支持 0-9 A-Z a-z _" song="歌曲名" artist="歌手" cover="歌曲专辑封面" loop="是否单曲循环，yes or no"></ymplayer>
```

//如果有歌词

```
<ymplayer src="mp3 文件地址" name="标识ID，支持 0-9 A-Z a-z _" song="歌曲名" artist="歌手" cover="歌曲专辑封面" loop="是否单曲循环，yes or no">
	<lrc>歌词内容</lrc>
</ymplayer>
```

### Other

目前处于 Alpha 阶段，在不同的站点上可能出现不同程度的错位，还请自己解决。

欢迎开 issues 报告问题。

### To do

- [ ] 播放进度拖拽控制（目前支持点击控制）
- [ ] 响应式的优化
- [ ] 多音乐播放

### License

遵循 GPL v2 开源。
