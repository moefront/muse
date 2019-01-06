import * as React from 'react';
import {Component} from 'react';

import {Analyser} from '../analyser';
import {BarsCanvas} from './styled';
import { Color, Bar, Dimensions } from '../domain';

export interface AudioBarsProps {
  analyser: Analyser;
  dimensions?: Dimensions;
  barNumber?: number;
  color?: Color;
}

const defaultDimensions: Dimensions = {
  width: 400,
  height: 400
}
const maxNumBarsToDraw = 64;
const maxByteValue = 256;
const defaultBarNumber = 30;

// TODO: add tests
export const getBarStyle = ({height}: Bar, canvasDimensions: Dimensions): string => {
  const percentage = height / canvasDimensions.height;
  const red = 255 * (percentage);
  const green = 100 * (percentage);
  const blue = 155;

  return `rgba(${red}, ${green}, ${blue}, 1)`;
}

export class AudioBars extends Component<AudioBarsProps, {}> {
  private canvasEl?: HTMLCanvasElement;
  private canvasContext?: CanvasRenderingContext2D;
  private animationId?: number;

  static defaultProps: Partial<AudioBarsProps> = {
    barNumber: defaultBarNumber,
    dimensions: defaultDimensions
  }

  componentDidMount() {
    const {audioEl} = this.props.analyser;

    audioEl.addEventListener('playing', this.onPlaying);
    audioEl.addEventListener('pause', this.onPause);
    audioEl.addEventListener('ended', this.onEnded);
  }

  componentWillUnmount() {
    this.stopAnimation();
  }

  render() {
    const {width, height} = this.props.dimensions || defaultDimensions;
    return (
      <BarsCanvas
        width={width}
        height={height}
        innerRef={this.saveCanvasRef}
      />
    );
  }

  private saveCanvasRef = (ref?: HTMLCanvasElement): void => {
    if (!ref) {
      return;
    }

    this.canvasEl = ref;
  }

  private onPlaying = () => {
    this.draw();
  }

  private draw = (): void => {
    if (!this.canvasEl) return;

    const context = this.canvasEl.getContext('2d');

    if (!context) {
      return;
    }

    this.canvasContext = context;
    this.drawBars();
  }

  // TODO-Perf: we can store the higher bar value XY and only clear the canvas from those points
  private clearCanvas = () => {
    const {width, height} = this.props.dimensions || defaultDimensions;
    const {canvasContext} = this;
    if (!canvasContext) return;
    canvasContext.clearRect(0, 0, width, height);
  }

  private drawBars = (): void => {
    const {canvasContext, barWidth} = this;
    const {analyser} = this.props;
    const dimensions = this.props.dimensions || defaultDimensions;
    if (!canvasContext) return;

    const barValues = analyser.getBucketedByteFrequencyData(maxNumBarsToDraw);
    this.clearCanvas();

    for (let i = 0; i < barValues.length; i++) {
      const x = i * barWidth + i;
      if (x >= dimensions.width) {break;} // Don't paint bars outside the visible canvas

      const percentBarHeight = barValues[i] / maxByteValue;
      const height = dimensions.height * percentBarHeight;

      if (height < 1) {continue;} // Don't paint invisible bars

      const y = dimensions.height - height;
      const bar: Bar = {x, y, width: barWidth, height};

      canvasContext.fillStyle = this.getFillStyle(bar, dimensions);
      canvasContext.fillRect(x, y, barWidth, height);
    }

    this.animationId = requestAnimationFrame(this.drawBars);
  }

  getFillStyle = (bar: Bar, canvasDimensions: Dimensions): string => {
    const {color} = this.props;

    if (typeof color === 'function') {
      return color(bar, canvasDimensions);
    } else if (typeof color === 'string') {
      return color;
    }

    return getBarStyle(bar, canvasDimensions);
  }

  private onPause = () => {
    this.stopAnimation();
  }

  private onEnded = () => {
    this.stopAnimation();
  }

  private stopAnimation = () => {
    this.animationId && cancelAnimationFrame(this.animationId);
  }

  private get barWidth(): number {
    const {width} = this.props.dimensions || defaultDimensions;
    const {barNumber} = this;

    return width / barNumber;
  }

  private get barNumber(): number {
    const {barNumber = defaultBarNumber} = this.props;
    return Math.min(barNumber, maxNumBarsToDraw);
  }
}
