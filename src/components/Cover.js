import React from 'react';
import PropTypes from 'prop-types';

const Cover = ({ cover }) => {
  return (
    <div
      className={ 'muse-cover' }
      style={{
        background: 'url(\'' + cover + '\') no-repeat center / cover'
      }}>
    </div>
  );
};

Cover.propTypes = {
  cover: PropTypes.string.isRequired
};

export default Cover;
