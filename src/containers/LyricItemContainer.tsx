import * as React from 'react';
import { observer } from 'mobx-react';

interface LyricItemContainerProps {
  timeline: number;
  text: string;
  translation: string | object;
  index: number;
}

@observer
export default class LyricItemContainer extends React.Component<LyricItemContainerProps> {
  constructor(props: LyricItemContainerProps) {
    super(props);
  }

  render() {
    const { text, translation, index } = this.props;
    return (
      <li
        className={ 'muse-lyric__item' }
        data-lyric-item-id={ index }
      >
        <span className={ 'muse-lyric__text' }>{ text }</span>

        {(() => {
          if (translation) {
            return (
              <span className={ 'muse-lyric__translation' }>
                { translation }
              </span>
            );
          } // inject translation if exists
        })()}
      </li>
    );
  }
}
