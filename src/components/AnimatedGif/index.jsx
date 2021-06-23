import React from 'react';
import { Image } from 'components';
import './styles.scss';

const AnimatedGif = ({ gif, className }) => {
  if (!gif) return null;
  return (
    <div className={`animated-gif ${className || ''}`}>
      <Image className="animated-gif-image" image={{ url: `${gif}` }} />
    </div>
  );
};

export default AnimatedGif;
