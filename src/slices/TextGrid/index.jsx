import React from 'react';
import { Section, Image } from 'components';
import './styles.scss';

const TextGrid = (props) => {
  const { data } = props;
  console.log(data);
  const { primary, items } = data;
  const { title, subtitle } = primary;

  return (
    <Section className="text-grid">
      <h1 className="text-grid-title">{title.text}</h1>
      <div className="text-grid-subtitle" dangerouslySetInnerHTML={{ __html: subtitle.html }} />
      <div className="text-grid-container">
        {items.map((item) => {
          const { column_content: content, column_title: colTitle, price } = item;
          return (
            <div className="text-grid-column">
              <div className="text-grid-column-title" dangerouslySetInnerHTML={{ __html: colTitle.html }} />
              <div className="text-grid-column-content" dangerouslySetInnerHTML={{ __html: content.html }} />
              {price && <div className="text-grid-column-price">From ${price}*</div>}
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default TextGrid;
