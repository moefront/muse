import * as React from 'react';

import { observer, inject } from 'mobx-react';

// Utils
import { getRect } from '../utils';

interface ProgressProps {
  currentTime: any;
  duration: any;
  store?: any;
  id: number | string;
}

@inject('store') @observer
export class Progress extends React.Component<ProgressProps> {

  id: any = undefined;
  finalProgress: any = undefined;

  progress: HTMLElement;
  handler: HTMLElement;

  constructor(props: ProgressProps) {
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
  onProgressBarClick = (event: any) => {
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
    document.body.addEventListener('touchmove', this.onHandlerDrag);
    document.body.addEventListener('touchend', this.onHandlerMouseUp);
  };
  onHandlerDrag = (event: any) => {
    const { duration } = this.props;
    const rect = getRect(this.progress),
      target = (event.touches ? event.touches[0].clientX : event.clientX),
      width = this.progress.offsetWidth;

    this.finalProgress = Math.max(Number((target - rect.left) / width * duration), 0);
    this.props.store.slideTimeOnly(this.finalProgress);
  };
  onHandlerMouseUp = () => {
    this.props.store.slideProgress(this.finalProgress);

    document.body.removeEventListener('mousemove', this.onHandlerDrag);
    document.body.removeEventListener('mouseup', this.onHandlerMouseUp);
    document.body.removeEventListener('touchmove', this.onHandlerDrag);
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
              width: duration === 0 ? '0%' : 100 * currentTime / duration + '%'
            }}
          >
            <span
              className={'muse-progress__handle'}
              ref={ref => (this.handler = ref)}
              onMouseDown={this.onHandlerMouseDown}
              onTouchStart={this.onHandlerMouseDown}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Progress;