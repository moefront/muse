/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import createComponent from 'helpers/shallowRenderHelper';

import { MuseDOM as MUSE } from '../src';

// testcase
const playList = [
  {
    title: '僕たちはひとつの光',
    artist: "μ's",
    cover:
      'http://p3.music.126.net/_gfatO4AhgiBKDwOgrHEQg==/7706477001119945.jpg',
    src: 'http://other.web.rg01.sycdn.kuwo.cn/resource/n2/27/71/3547184289.mp3',
    lyric:
      '[00:27.540]Ah! ほのかな予感から始まり\n[00:32.970]Ah! 希望が星空駈けて\n[00:38.450]花を咲かせるにっこり笑顔は\n[00:43.920]ずっと同じさ 友情の笑顔\n[00:49.160]\n[00:49.510]忘れない いつまでも忘れない\n[00:54.940]こんなにも心がひとつになる\n[01:00.410]世界を見つけた喜び(ともに)歌おう\n[01:09.940]最後まで(僕たちはひとつ)\n[01:16.660]\n[01:17.040]小鳥の翼がついに大きくなって\n[01:25.010]旅立ちの日だよ\n[01:28.130]遠くへと広がる海の色暖かく\n[01:36.050]夢の中で描いた絵のようなんだ\n[01:40.300]切なくて時をまきもどしてみるかい?\n[01:52.490]No no no いまが最高!\n[01:58.620]\n[02:20.460]みんなと出会えたこと嬉しくて\n[02:27.090]離れたくないよ本当だよ\n[02:31.550]涙はいらない このまま踊ろう\n[02:36.980]手を振ってもっと振って\n[02:42.890]\n[02:45.370]光を追いかけてきた僕たちだから\n[02:53.190]さよならは言わない\n[02:56.320]また会おう 呼んでくれるかい?\n[03:00.300]僕たちのこと\n[03:04.320]素敵だった未来に繋がった夢\n[03:08.560]夢の未来 君と僕のLIVE&LIFE\n[03:15.430]\n[03:37.800]小鳥の翼がついに大きくなって\n[03:45.640]旅立ちの日だよ\n[03:48.760]遠くへと広がる海の色暖かく\n[03:56.730]夢の中で描いた絵のようなんだ\n[04:00.990]切なくて時をまきもどしてみるかい?\n[04:13.240]No no no いまが最高!\n[04:18.670]だってだって、いまが最高!\n[04:30.500]\n[04:31.520]Ah! ほのかな予感から始まり\n[04:37.410]Ah! 光を追いかけてきたんだよ…\n[04:48.410]',
    translation:
      'Ah! 从微小的预感开始\nAh! 希冀在星空中驰骋\n笑开花儿的真切笑容是\n亘久不变 友情的笑容\n\n无法忘却 永远铭记\n心灵能如此合而为一\n让我们（一同）歌唱发现世界的喜悦\n直到最后（我们已成为一体）\n\n小鸟终也羽翼丰满\n到了展翅翱翔的日子\n一望无垠的大海 颜色是如此温暖\n如同在梦中描绘的画\n若感到惆怅要让时光倒流吗？\nNo no no 此刻就是最好的！\n\n与大家相遇是如此幸福\n不舍别离 真的\n不必流泪 就此起舞吧\n挥舞起手 用力挥舞吧\n\n因为我们已经追上了那束光芒\n所以不需要道别\n再会之时 能否轻唤\n我们的名字？\n通往美好未来的梦想\n梦想的未来 属于你与我的LIVE&LIFE\n\n小鸟终也羽翼丰满\n到了展翅翱翔的日子\n一望无垠的大海 颜色是如此温暖\n如同在梦中描绘的画\n若感到惆怅要让时光倒流吗？\nNo no no 此刻就是最好的！\n因为因为，此刻就是最好的！\n\nAh! 从微小的预感开始\nAh! 追逐到了那束光芒……'
  }
];

// Player instance test
describe('Player', function() {
  beforeEach(function() {
    const player = MUSE.render(playList, undefined);
    this.player = player.component;
  });

  it('should have the playlist to be an Array', function() {
    expect(typeof this.player.props.playList.length).to.equal('number');
  });

  it('should have the layout to be default.', function() {
    expect(this.player.props.layout).to.equal('muse-layout-default');
  });

});

// API test
describe('API', function() {
  beforeEach(function() {
    const dom = document.createElement('div');
    const player = MUSE.render(playList, dom);
    (this.component = player.component), (this.id = player.id);
    this.dom = dom;
  });

  it('should change playing state after calling MUSE.togglePlay()', function() {
    MUSE.togglePlay(this.id);
    expect(MUSE.getState(this.id, 'isPlaying')).to.equal(true);
  });

  it('should add new items after calling MUSE.addMusicToList()', function() {
    const item = {
      title: 'キラキラだとか夢だとか ～Sing Girls～',
      artist: "Poppin'Party",
      cover:
        'http://p3.music.126.net/gKlVvWTk9-TSlqfbuUhyJA==/18554258720497910.jpg',
      src:
        'http://other.web.ri01.sycdn.kuwo.cn/resource/n1/20/5/2778169782.mp3',
      lyric:
        '[00:12.60]夢の途中キミと出会った！\n[00:15.33]そのときから はじけそうな胸の予感\n[00:19.88]ずっと膨らみ続けてた\n[00:22.29]\n[00:23.11]まだ誰も知らないこの歌\n[00:25.88]いつの日にか 世界中に届けたいな\n[00:29.98]ずっと願っていたとしたら？ キミが訊いた(だからね)\n[00:38.66]\n[00:38.84]誰にだって負けない この気持ちを\n[00:44.20]ぎゅっとつめて ぜんぶあつめて Believing！\n[00:49.19]時よ動きだせ！ Final Countdown！ (10, 9, 8, 7, 6, 5,)\n[00:54.28]あと５秒！ (4, 3, 2, 1 ―― Ready Go！)\n[00:56.44]\n[00:56.80]キラキラだとか夢だとか 希望だとかドキドキだとかで\n[01:02.90]この世界は まわり続けている！\n[01:07.12]昨日は今日になって 明日になって 未来になって 永遠になってた\n[01:13.92]世界中の勇気 あつめて行こう！\n[01:17.86]\n[01:18.70]手をあわせ 肩よせあって (いつも)ステキに Girls！ Girls！\n[01:24.22]夢を奏でよう? (キミと)大好きなこの場所で?\n[01:29.34]\n[01:40.33]夢のつぼみ そっと膨らんだ\n[01:43.98]愛おしくて 大事なもの 枯れないように\n[01:47.50]一人強く育て続けた\n[01:50.65]\n[01:51.10]ホントのこと伝えたかった\n[01:53.62]いまはまだね この想いが足りないかな？\n[01:57.77]いつか追いかけ続けたいと キミは言った(だけどね)\n[02:06.98]\n[02:07.04]誰より本気だよ この気持ちを\n[02:11.34]もうこれ以上 きっと待てない Starting！\n[02:16.98]時は動きだす！ Final Countdown！\n[02:20.90](Sing！ Sing！ Sing！ Sing！ Sing Girls！)\n[02:22.20]今すぐ！ (4, 3, 2, 1 ―― Ready Go！)\n[02:24.81]\n[02:25.10]ためらいだとか不安だとか 挫折だとか焦燥感だとかで\n[02:31.30]あふれだした涙 とまらないの\n[02:35.20]それでも優しくて まぶしくて愛おしくて 心強いんだね\n[02:41.89]かみしめてた 仲間がいるってこと\n[02:45.56]\n[02:46.90]手をかさね 声かけあって (いつも)夢みる Girls！ Girls！\n[02:52.40]キミと歌いたい? (キミの)大切なこの場所で?\n[02:57.94]\n[03:42.28]かたく閉ざされた最後の(届かない)\n[03:47.54]とびら解き放つものはなに？(それはなに？)\n[03:52.54]\n[03:52.71]夢の地図をぜんぶつなぎあわせて\n[03:58.16]音楽(キズナ)という魔法の鍵を見つけること！\n[04:04.80](Sing！ Sing！ Sing！ Sing Girls！)\n[04:06.50]\n[04:08.92]キラキラだとか夢だとか 希望だとかドキドキだとかで\n[04:15.40]この世界は まわり続けている！\n[04:18.94]昨日は今日になって 明日になって 未来になって 永遠になってた\n[04:25.92]これ以上は 時よ進まないで！\n[04:29.43]\n[04:29.78]手をあわせ 肩よせあって (いつも)ステキに Girls！ Girls！\n[04:35.92]夢を奏でよう? (キミの)大好きなこの場所で? Sing Girls?\n[04:46.34]',
      translation:
        '在梦想的途中与你相遇\n从那时起 我的内心就怦然有了预感\n不断地膨胀着\n\n这首仍未有人知道的歌\n希望有一天 能让全世界都听到\n我一直期盼着 于是有了与你的相遇\n\n我要把这份不输给任何人的心情\n一下子填满 全部合在一起\n时间啊动起来吧Final Countdown！ (10, 9, 8, 7, 6, 5,)\n还有5秒！ (4, 3, 2, 1 —— Ready Go！)\n\n那些闪闪发光的被称为希望的和那些心跳不已的\n让这个世界因此不停来回运转着\n昨天已经变成今天 又变成了明天 变成了未来 又成为了永远\n收集全世界的勇气 向前进\n\n手牵手 肩并肩 一直都是最棒的Girls！Girls！\n在这个最喜欢的地方 和你一起奏响梦想\n\n梦想的花蕾 悄然间绽放\n希望我视为珍宝的一切 永远都不会枯萎凋谢\n一个人坚强的培育它长大\n\n一直想传达自己真正的心情\n不过却不是现在 现在我的梦想还不够强大\n总有一天想要一直追寻下去 你曾那么说过 (可是呢)\n\n我的这份心情比任何人都热忱\n已经迫不及待 踏出最初一步\n时间开始运转 Final Countdown！\n(Sing！ Sing！ Sing！ Sing！ Sing Girls！)\n现在马上(4, 3, 2, 1 ―― Ready Go！)\n\n那些犹豫 那些不安 那些挫折 那些焦躁感\n让我不由得热泪盈眶 止不住地往外流\n尽管如此那些温柔的耀眼的眷恋的一切 给了我莫大的鼓舞\n让我深刻地体会到 还有朋友在我身边\n\n手心相叠 齐声呐喊 一直追逐梦想的Girls！Girls！\n在这对你而言很重要的地方 想和你一起放声歌唱\n\n在这紧紧封锁的最后的门扉(遥不可及)\n得以重获自由的是什么？(是什么？)\n\n把梦想的地图全部拼在一体\n找到那把名为音乐(羁绊)的魔法钥匙\n(Sing！ Sing！ Sing！ Sing Girls！)\n\n那些闪闪发光的 被称为梦想的 被称为希望的和那些心跳不已的\n让这个世界因此不停来回运转着\n昨天已经变成今天 又变成了明天 变成了未来 又成为了永远\n时间啊 愿停在这一刻\n\n手牵手 肩并肩 一直都是最棒的Girls！Girls！\n在这个最喜欢的地方 和你一起奏响梦想 Sing Girls\n'
    };
    MUSE.addMusicToList(this.id, item);
    expect(JSON.stringify(MUSE.getState(this.id, 'playList'))).to.equal(
      JSON.stringify([playList[0], item])
    );
  });

  it('should change drawer state after calling MUSE.toggleDrawer()', function() {
    MUSE.toggleDrawer(this.id);
    expect(
      this.dom
        .querySelector('.muse-drawer')
        .classList.contains('muse-drawer__state-open')
    ).to.equal(true);
  });

  it('should change player layout after calling MUSE.changePlayerLayout()', function() {
    MUSE.changePlayerLayout(this.id, 'muse-layout-landscape');
    expect(
      this.dom
        .querySelector('#' + this.id)
        .classList.contains('muse-layout-landscape')
    ).to.equal(true);
  });

  it('should destroy the player after calling MUSE.destroy()', function() {
    MUSE.destroy(this.id, this.dom);
    expect(
      this.dom.querySelector('#' + this.id)
    ).to.equal(null);
  });
});