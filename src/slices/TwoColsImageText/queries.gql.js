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
            gatsbyImageData(quality: 90, layout: CONSTRAINED, width: 2000, placeholder: BLURRED)
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
