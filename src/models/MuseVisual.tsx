import * as React from 'react';
import {Component} from 'react';
import { Analyser } from './analyser';
import { AudioBars } from './bars';
import { Audio } from './styled';
import { Color, Dimensions } from './domain';

export interface MuseVisualProps {
  src: string;
  // autoPlay?: boolean; // TODO: does this make sense or just pass isPlaying=true initially
  isPlaying?: boolean;
  loop?: boolean;
  barNumber?: number;
  dimensions?: Dimensions;
  color?: Color;
}

export interface MuseVisualState {
  analyser?: Analyser;
}

const audioContext = new AudioContext();

export class MuseVisual extends Component<MuseVisualProps, MuseVisualState> {
  audioElement?: HTMLAudioElement;
  state: MuseVisualState = {

  }

  static defaultProps = {
    isPlaying: false,
    loop: false,
    src: ''
  }

  componentWillReceiveProps(nextProps: MuseVisualProps) {
    const {isPlaying} = this.props;
    const {isPlaying: nextIsPlaying} = nextProps;

    if (isPlaying !== nextIsPlaying) {
      this.togglePlay();
    }
  }

  private getAudioElement = (audioElement?: HTMLAudioElement) => {
    const {isPlaying} = this.props;
    if (!audioElement) {
      return;
    }

    this.audioElement = audioElement;

    if (isPlaying) {
      this.togglePlay();
    }

    this.setState({
      analyser: new Analyser({audioEl: audioElement, audioContext})
    });
  }

  togglePlay = () => {
    const {audioElement} = this;

    if (!audioElement) return;

    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  renderBars = () => {
    const {analyser} = this.state;
    const {barNumber, dimensions, color} = this.props;
    if (!analyser) return;

    return (
      <AudioBars
        analyser={analyser}
        barNumber={barNumber}
        dimensions={dimensions}
        color={color}
      />
    )
  }

  renderAudioElement = (src: string) => {
    const {loop} = this.props;

    return (
      <Audio
        src={src}
        loop={loop}
        innerRef={this.getAudioElement}
      />
    );
  }

  render() {
    const {src} = this.props;

    return (
      <div>
        {this.renderAudioElement(src)}
        {this.renderBars()}
      </div>
    );
  }
}
