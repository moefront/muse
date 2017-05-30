import React from 'react';

export const PlayButton = () => {
  return (
    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5v14l11-7z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

export const PauseButton = () => {
  return (
    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

export const StopButton = () => {
  return (
    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 6h12v12H6z"/>
    </svg>
  );
};

export const PrevButton = () => {
  return (
    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
        <path d="M0-.5h24v24H0z" fill="none"/>
    </svg>
  );
};

export const NextButton = () => {
  return (
    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
        <path d="M0-.25h24v24H0z" fill="none"/>
    </svg>
  );
};

export const LyricToggler = () => {
  return (
    <svg fill="#000000" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

export const PlayListToggler = () => {
  return (
    <svg enableBackground="new 0 0 24 24" fill="#000000" height="20" id="Layer_1" version="1.1" viewBox="0 0 24 24" width="20" x="0px" xmlns="http://www.w3.org/2000/svg" y="0px">
    <g id="XMLID_1_">
    	<path d="M0,0h24v24H0V0z" fill="none"/>
    	<g id="XMLID_2_">
    		<rect height="2" id="XMLID_3_" width="12" x="4" y="10"/>
    		<rect height="2" id="XMLID_4_" width="12" x="4" y="6"/>
    		<rect height="2" id="XMLID_5_" width="8" x="4" y="14"/>
    		<polygon id="XMLID_6_" points="14,14 14,20 19,17   "/>
    	</g>
    </g>
    </svg>
  );
};
