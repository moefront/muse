import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

// Utils
import { getRect } from '../utils';

@observer
class Progress extends Component {
  static propTypes = {
    currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
      .isRequired,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
      .isRequired,
    store: PropTypes.object.isRequired
  };

  id = undefined;

  constructor(props) {
    super(props);
    this.id = props.id;
  }

  /* life cycles */
  componentDidMount() {
    this.progress.addEventListener('click', this.onProgressBarClick);
  }
  componentWillUnMount() {
    this.progress.removeEventListener('click', this.onProgressBarClick);
  }

  /* event listeners */
  onProgressBarClick = event => {
    const { duration } = this.props;
    const rect = getRect(this.progress),
      target = event.clientX,
      width = this.progress.offsetWidth;
    this.props.store.slideProgress(Number((target - rect.left) / width * duration));
  };

  /**
   * 进度条拖拽相关事件
   *
   * onHandlerMouseDown
   * onHandlerDrag
   * onHandlerMouseUp
   */
  onHandlerMouseDown = () => {
    document.body.addEventListener('mousemove', this.onHandlerDrag);
    document.body.addEventListener('mouseup', this.onHandlerMouseUp);
  };
  onHandlerDrag = event => {
    const { duration } = this.props;
    const rect = getRect(this.progress),
      target = event.clientX,
      width = this.progress.offsetWidth;
    this.props.store.slideProgress(Number((target - rect.left) / width * duration));
  };
  onHandlerMouseUp = () => {
    document.body.removeEventListener('mousemove', this.onHandlerDrag);
    document.body.removeEventListener('mouseup', this.onHandlerMouseUp);
  };

  onHandlerTouchStart = () => {
    document.body.addEventListener('touchmove', this.onHandlerTouchMove);
    document.body.addEventListener('touchend', this.onHandlerTouchEnd);
  };
  onHandlerTouchMove = () => {
    const { duration } = this.props;
    const rect = getRect(this.progress),
      target = event.touches[0].clientX,
      width = this.progress.offsetWidth;
    this.props.store.slideProgress(Number((target - rect.left) / width * duration));
  };
  onHandlerTouchEnd = () => {
    document.body.removeEventListener('touchmove', this.onHandlerTouchMove);
    document.body.removeEventListener('touchend', this.onHandlerMouseUp);
  };

  render() {
    const { currentTime, duration } = this.props;

    return (
      <div className={'muse-progress'} ref={ref => (this.progress = ref)}>
        <div className={'muse-progress__container'}>
          <div
            className={'muse-progress__played'}
            style={{
              width: duration == 0 ? '0%' : 100 * currentTime / duration + '%'
            }}
          >
            <span
              className={'muse-progress__handle'}
              ref={ref => (this.handler = ref)}
              onMouseDown={this.onHandlerMouseDown}
              onTouchStart={this.onHandlerTouchStart}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Progress;