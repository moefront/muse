import chunk = require('lodash.chunk');
import sum = require('lodash.sum');

export interface AnalyserSpec {
  audioEl: HTMLAudioElement;
  audioContext: AudioContext;
}

export interface Analyser {
  audioEl: HTMLAudioElement;
  analyserNode: AnalyserNode;
  closeAudioNodes: () => void;
}

export class Analyser {
  audioEl: HTMLAudioElement;
  analyserNode: AnalyserNode;
  private source: MediaElementAudioSourceNode;
  private dataArray?: Uint8Array;

  constructor(spec: AnalyserSpec) {
    const {audioContext, audioEl} = spec;
    this.source = audioContext.createMediaElementSource(audioEl);
    this.analyserNode = audioContext.createAnalyser();
    this.audioEl = spec.audioEl;
    this.createAnalyserNode(spec);
  }

  closeAudioNodes = () => {
    const {analyserNode, source} = this;
    if (analyserNode) { analyserNode.disconnect(); }
    if (source) { source.disconnect(); }
  }

  getBucketedByteFrequencyData = (maxNumBuckets: number): Array<number> => {
    const {analyserNode} = this;

    const bufferLength = analyserNode.frequencyBinCount;
    if (!this.dataArray) {
      this.dataArray = new Uint8Array(bufferLength);
    }

    const {dataArray} = this;
    analyserNode.getByteFrequencyData(dataArray);

    const numBuckets = Math.min(dataArray.length, maxNumBuckets);

    // bucket values
    const numValuesPerChunk = Math.ceil(bufferLength / numBuckets);
    const chunkedData = chunk(dataArray, numValuesPerChunk);

    return chunkedData.map((arr: Array<number>) => sum(arr) / arr.length);
  }

  private createAnalyserNode = ({audioContext}: AnalyserSpec): void => {
    const numDataPoints = 512;
    this.analyserNode.fftSize = 2 * numDataPoints;

    this.source.connect(this.analyserNode);
    this.analyserNode.connect(audioContext.destination);
  }
}
