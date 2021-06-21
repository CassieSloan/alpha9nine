import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Carousel, Image } from 'components';
import './styles.scss';

/* eslint react/destructuring-assignment: 0 */
const PhotoCarousel = (props) => {

  const {
    prismicSettings: { data },
  } = useStaticQuery(settingsQuery);
  const { photo_gallery: photos } = data;

  return (
    <Carousel className="photo-carousel">
      // <div>
        {photos.map((photo) => {
          const { image } = photo;
          return (
            <div>
              <Image image={image}  />
            </div>
          );
        })}
      // </div>
    </Carousel>
  );
};

export default PhotoCarousel;

export const settingsQuery = graphql`
  query Photos {
    prismicSettings {
      data {
        photo_gallery {
          image {
            url
          }
        }
      }
    }
  }
`;
