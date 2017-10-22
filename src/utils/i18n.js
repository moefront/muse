/** MUSE Player i18n framework */
export const i18nTexts = {
  default: {
    backward: '延后',
    currentLyricOffset: '当前偏移',
    disabled: '关闭',
    devMode: '开发者模式',
    devModeAlert: '将会开启开发者模式，此模式下会显示更多调试信息并注销右键菜单以方便检查元素，你可以重载页面来重新激活右键菜单\n\n' +
          '确定要进入开发者模式吗？',
    enabled: '开启',
    exit: '退出',
    forward: '提前',
    fullscreenMode: '全屏模式',
    looping: '单曲循环',
    modulation: '音量调整',
    playRate: '播放速度',
    setLyricOffset: '校正歌词',
    stop: '停止播放',
    updateAvailable: '发现新版本'
  },
  chineseTraditional: {
    backward: '延後',
    currentLyricOffset: '當前偏移',
    disabled: '關閉',
    devMode: '開發者模式',
    devModeAlert: '將會進入開發者模式，此模式下將銷毀右鍵菜單以便於審查元素，你可以重載頁面來重新激活菜單。\n\n' +
          '確實要進入開發者模式嗎？',
    enabled: '開啟',
    exit: '退出',
    forward: '提前',
    fullscreenMode: '全屏模式',
    looping: '單曲循環',
    modulation: '音量調整',
    playRate: '播放速度',
    setLyricOffset: '校正歌詞',
    stop: '停止播放',
    updateAvailable: '發現新版本'
  },
  english: {
    backward: '',
    currentLyricOffset: 'Current',
    disabled: 'Disabled',
    devMode: 'Developer mode',
    devModeAlert: 'This operation will remove right-click listener so that you can inspect the player. You can refresh the page and activate the right-click listener again.\n\n' +
          'Enable developer mode?',
    enabled: 'Enable',
    exit: 'Exit',
    forward: '',
    fullscreenMode: 'Fullscreen mode',
    looping: 'Loop',
    modulation: 'Modulation',
    playRate: 'Playing rate',
    setLyricOffset: 'Lyric offset',
    stop: 'Stop',
    updateAvailable: 'Update available'
  },
  japanese: {
    backward: '延ばす',
    currentLyricOffset: '当面のオフセット',
    disabled: '無効にする',
    devMode: '開発者モード',
    devModeAlert: '開発者モードが開くと、このモードでより多くの調整情報が表示されるそして右ボタンメニューをログオフして要素検査に便利です。ページを再ロードして右ボタンメニューを復活します\n\n' +
          '開発者モードに入りますか？',
    enabled: '有効にする',
    exit: '退出する',
    forward: '繰り上げる',
    fullscreenMode: '全画面モード',
    looping: '一曲リピート',
    modulation: '音量調整',
    playRate: '再生速度',
    setLyricOffset: '歌詞を校正する',
    stop: '再生の停止',
    updateAvailable: '新しいバージョンを発見'
  }
};

export const i18n = (key, lang = undefined) => {
  lang = lang ? lang : window.navigator.languages[0] || window.navigator.language || 'zh-CN';
  switch (lang)
  {
    case 'zh-CN':
    case 'zh':
    default:
      return i18nTexts.default[key];

    case 'zh-HK':
    case 'zh-TW':
      return i18nTexts.chineseTraditional[key];

    case 'ja':
    case 'ja-JP':
      return i18nTexts.japanese[key];

    case 'en-US':
    case 'en-GB':
    case 'en-CA':
    case 'en-AU':
    case 'en-SA':
    case 'en-NZ':
    case 'en':
      return i18nTexts.english[key];
  }
};

export default i18n;
