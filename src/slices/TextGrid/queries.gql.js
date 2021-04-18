import { graphql } from 'gatsby';

export const Queries = graphql`
  fragment TextGridPageFragment on PrismicPageBodyTextGrid {
    id
    slice_type
    primary {
      subtitle {
        html
        text
      }
      title {
        html
        text
      }
    }
    items {
      column_content {
        html
        text
      }
      price
      column_title {
        html
        text
      }
    }
  }
`;
