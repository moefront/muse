/**
 * muse player lyric parser
 * @param  {String} rawLyric
 * @return {Object}
 */
const calcTime = match => {
  return (
    Number(Number(match[1]) * 60) +
    parseInt(Number(match[2])) +
    (match[3] ? Number('0' + match[3]) : 0)
  );
};

export const lyricParser = (rawLyric, rawTranslation) => {
  let res = {
    author: undefined,
    transAuthor: undefined,
    lyric: []
  },
    raw = rawLyric,
    version = 0, // specify lyric version
    transVersion = 0, // 0: lines, 1: timelines
    lyricArr = [],
    transArr = [];

  if (!raw || typeof raw != 'string') {
    return false;
  }

  if (
    rawTranslation &&
    rawTranslation.match(/\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\]/)
  ) {
    transVersion = 1;
  }
  // simplified version of lyric: [time1][time2]lyric
  if (
    raw.match(
      /\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\]\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\]/
    )
  ) {
    version = 1;
  }

  // replace \\n and \\r to \n and \r -- for netease cloud music lyric
  raw = raw.replace(/\\n/g, '\n').replace(/\\r/g, '\r');

  let lines = String(raw).split('\n');
  lines.forEach(index => {
    // filter the information that is known
    if (!index || index.match(/\[ti:|ar:|al:.*\]/g)) return;

    // lyric author
    if (index.match(/\[by:(.*)\]/g)) {
      res.author = /\[by:(.*)\]/g.exec(index)[1];
      return;
    }

    let tags, texts;

    switch (version) {
      // legacy
      case 0:
        const match = /^\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\](.*)/g.exec(index),
          timeline = calcTime(match);
        lyricArr.push({
          timeline: timeline,
          text: match[4]
        });
        break;

      // simplified
      case 1:
        tags = index.match(/\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\]/g);
        texts = /\[.*\](.*)/g.exec(index);

        tags.forEach(tag => {
          const match = /^\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\](.*)/g.exec(tag),
            timeline = calcTime(match);
          lyricArr.push({
            timeline: timeline,
            text: texts[1]
          });
        });
        break;
    }
  });

  /* Translation parse block */
  if (rawTranslation) {
    rawTranslation = rawTranslation.replace(/\\n/g, '\n').replace(/\\r/g, '\r');

    lines = String(rawTranslation).split('\n');
    lines.forEach(index => {
      if (index.match(/\[ti:|ar:|al:\.*]/g)) return;

      // translation author
      if (index.match(/\[by:(.*)\]/g)) {
        res.transAuthor = /\[by:(.*)\]/g.exec(index)[1];
        return;
      }

      switch (transVersion) {
        // lines
        case 0:
          transArr.push(index);
          break;

        // simplified
        case 1:
          if (!index) break;

          const match = /\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\](.*)/g.exec(index),
            timeline = calcTime(match);
          transArr.push({
            timeline: timeline,
            text: match[4]
          });
          break;
      }
    });
  }

  // sort lyrics
  const cmp = (a, b) => a.timeline - b.timeline;
  if (version == 1) lyricArr = lyricArr.sort(cmp);
  if (transVersion == 1) transArr = transArr.sort(cmp);
  // merge lyrics and translations
  let itor = 0,
    transLength = transArr.length;
  if (transVersion == 0) {
    lyricArr.forEach(index => {
      res.lyric.push({
        timeline: index.timeline,
        text: index.text,
        translation: itor < transLength ? transArr[itor++] : ''
      });
    });
  } else {
    lyricArr.forEach(index => {
      res.lyric.push({
        timeline: index.timeline,
        text: index.text,
        translation: itor < transLength &&
          index.timeline == transArr[itor].timeline
          ? transArr[itor++].text
          : ''
      });
    });
  }

  // add lyric author information
  if (res.author != undefined) {
    res.lyric.push({
      timeline: 9999,
      text: '歌词作者：' + res.author,
      translation: res.transAuthor ? '翻译作者：' + res.transAuthor : ''
    });
  }

  return res;
};