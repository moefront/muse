/**
 * muse player lyric parser
 * @param  {String} rawLyric
 * @return {Object}
 */
export const lyricParser = (rawLyric) => {
  let res = {
    author: undefined,
    lyric: []
  },
  raw = rawLyric,
  version = 0;      // specify lyric version


  if (!raw || typeof raw != 'string') {
    return false;
  }

  // simple version lyric: [time1][time2]lyric
  if (raw.match(/\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\]\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\]/)) {
    version = 1;
  }

  // replace \\n and \\r to \n and \r -- for netease cloud music lyric
  raw = raw.replace(/\\n/g, '\n').replace(/\\r/g, '\r');

  let lines = String(raw).split('\n');
  lines.forEach(index => {
    // filter the information that is known
    if (!index || index.match(/\[ti:|ar:|al:\.*]/g))
      return;

    // lyric author
    if (index.match(/\[by:(.*)\]/g)) {
      res.author = /\[by:(.*)\]/g.exec(index)[1];
      return;
    }

    let tags, texts;

    switch (version)
    {
      // legacy
      case 0:
        const match = /^\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\](.*)/g.exec(index);
        res.lyric.push({
          timeline: Number(Number(match[1]) * 60) + parseInt(Number(match[2])) +
                    (match[3] ? Number('0' + match[3]) : 0),
          text: match[4]
        });
        break;

      // simple
      case 1:
        tags = index.match(/\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\]/g);
        texts = /\[.*\](.*)/g.exec(index);

        tags.forEach(tag => {
          const match = /^\[(\d{1,2}):(\d|[0-5]\d)(\.\d+)?\](.*)/g.exec(tag);
          res.lyric.push({
            timeline: Number(Number(match[1]) * 60) + parseInt(Number(match[2])) +
                    (match[3] ? Number('0' + match[3]) : 0),
            text: texts[1]
          });
        });

        break;
    }
  });

  // add lyric author information
  if (res.author != undefined) {
    res.lyric.push({
      timeline: 9999,
      text: '歌词作者：' + res.author
    });
  }


  // sort lyrics
  if (version == 1) {
    const cmp = (a, b) => a.timeline - b.timeline;
    res.lyric = res.lyric.sort(cmp);
  }

  return res;
};
