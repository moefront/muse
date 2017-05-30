import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class LyricItemContainerWithoutStore extends Component
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

export default connect(state => {
  return {
    player: state.player
  };
})(LyricItemContainerWithoutStore);
