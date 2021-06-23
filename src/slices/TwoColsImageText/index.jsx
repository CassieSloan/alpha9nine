import React from 'react';
import OnVisible from 'react-on-visible';
import { Section, Image, Link, AnimatedGif } from 'components';
import flowerDog from '../../images/flower-dog.gif'
import './styles.scss';

const TwoColsImageText = props => {
  const { data } = props;
  console.log(data)
  const { primary } = data;
  const { content, image, title } = primary;

  // content checks
  const titleHtml = title?.html;
  const contentHtml = content?.html;

  return (
    <OnVisible className="text-image">
      <Section>
        <div className="text-image-grid">
          <AnimatedGif className="flower-dog" gif={flowerDog} />
          <div className="text-image-text">
            {titleHtml && <div className="text-image-title" dangerouslySetInnerHTML={{ __html: titleHtml }} />}
            {contentHtml && <div className="text-image-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />}
          </div>
          {image && (
            <div className="text-image-img">
              <Image image={image}/>
            </div>
          )}
        </div>
      </Section>
    </OnVisible>
  );
};

export default TwoColsImageText;
