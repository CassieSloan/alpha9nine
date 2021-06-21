import { graphql } from 'gatsby';

export const Queries = graphql`
  fragment TwoColsImageTextPageFragment on PrismicPageBodyTwoColsImageText {
    slice_type
    id
    primary {
      content {
        html
        text
      }
      image {
        url
        localFile {
          childImageSharp {
            gatsbyImageData(quality: 90, layout: FULL_WIDTH)
          }
        }
      }
      title {
        html
        text
      }
    }
  }
`;
