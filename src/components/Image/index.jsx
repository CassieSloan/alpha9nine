import React from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import './styles.scss';

const Image = (props) => {
  const { image, alt, className = '', imgStyle, loading } = props;
  if (!image) return <div className={`gatsby-image placeholder ${className}`} />;

  const imageData = getImage(image?.localFile);

  if (imageData) {
    return (
      <GatsbyImage
        className={`gatsby-image ${className}`}
        loading={loading || 'eager'}
        image={imageData}
        alt={image.alt || alt || ''}
        imgStyle={imgStyle}
      />
    );
  }

  if (image.url) {
    return (
      <div className={`gatsby-image ${className}`}>
        <img src={image.url} alt={image.alt || alt || ''} style={imgStyle} />
      </div>
    );
  }

  return <div className={`gatsby-image placeholder ${className}`} />;
};

export default Image;
