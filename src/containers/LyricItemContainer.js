import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
export default class LyricItemContainer extends Component
{
  static propTypes = {
    timeline: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    translation: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    index: PropTypes.number.isRequired
  }

  constructor(props) {
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
