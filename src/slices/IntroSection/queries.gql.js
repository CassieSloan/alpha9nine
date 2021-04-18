import { graphql } from 'gatsby';

export const Queries = graphql`
  fragment IntroSectionPageFragment on PrismicPageBodyIntroSection {
    slice_type
    id
    primary {
      logo {
        url
      }
      title {
        text
      }
      subtitle {
        html
      }
    }
  }
`;
