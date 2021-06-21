import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Image, Section, Layout, OnVisible } from 'components';
import * as styles from './styles.module.scss';

const PhotoGallery = (props) => {
  const {
    prismicSettings: { data },
  } = useStaticQuery(settingsQuery);
  const { photo_gallery: photos } = data;

  return (
    <Layout>
      <Section className={styles.photoGallery}>
      <div>
        <h1>Alpha K Nine Hall of Fame</h1>
      </div>
        <div className={styles.photoGrid}>
          {photos.map((photo) => {
            const { image } = photo;
            return (
              <div className={styles.imageContainer}>
                <Image image={image} className={styles.image} />
              </div>
            );
          })}
        </div>
      </Section>
    </Layout>
  );
};
export default PhotoGallery;

export const settingsQuery = graphql`
  query FooterDisclaimer {
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
