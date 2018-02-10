import * as React from 'react';

interface CoverProps {
  cover: string;
  id: string | number;
  parent?: React.Component;
}

export const Cover: React.SFC<CoverProps> = ({ cover }) => {
  return (
    <div
      className={ 'muse-cover' }
      style={{
        background: 'url(\'' + cover + '\') no-repeat center / cover'
      }}>
    </div>
  );
};

export default Cover;
