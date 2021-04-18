import React from 'react';
import { Section, Image } from 'components';
import './styles.scss';

const IntroSection = (props) => {
  const { data } = props;
  const { primary } = data;
  const { title, subtitle, logo } = primary;
  return (
    <Section className="intro-section">
      <Image className="intro-section-logo" image={logo} />
      <h1 className="intro-section-title">{title.text}</h1>
      <p className="intro-section-subtitle" dangerouslySetInnerHTML={{ __html: subtitle.html }} />
    </Section>
  );
};

export default IntroSection;
