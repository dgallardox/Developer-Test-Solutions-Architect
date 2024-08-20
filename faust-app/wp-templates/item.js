import { gql } from "@apollo/client";
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  Hero,
  SEO,
} from "../components";
import { BlogInfoFragment } from "../fragments/GeneralSettings";
import * as MENUS from "../constants/menus";
import Image from "next/image";

export default function Component(props) {
  const { title } = props.data.nodeByUri;
  const { cost, description } = props.data.nodeByUri.itemFields;
  const { sourceUrl } = props.data.nodeByUri.itemFields.image.node
  const { title: siteTitle, description: siteDescription } =
    props.data?.generalSettings;
  const primaryMenu = props.__TEMPLATE_QUERY_DATA__.headerMenuItems.nodes ?? [];
  const footerMenu = props.__TEMPLATE_QUERY_DATA__.footerMenuItems.nodes ?? [];

return (
  <>
    <Header
      title={siteTitle}
      description={siteDescription}
      menuItems={primaryMenu}
    />
    <Main>
      <Container>
        <div className='flex items-start'>
          <div className='w-[30%]'>
            <Image src={sourceUrl} height={250} width={300} />
          </div>
          <div className='w-[70%] pl-4'>
            <span className='block font-semibold text-lg'>{title}</span>
            <span className='block text-gray-700'>Cost: ${cost}</span>
            <div dangerouslySetInnerHTML={{ __html: description }} />
            <button>Learn more</button>
          </div>
        </div>
      </Container>
    </Main>
    <Footer title={siteTitle} menuItems={footerMenu} />
  </>
);

}

Component.variables = ({ uri }) => {
  return {
    uri,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetItemByUri(
    $uri: String!
    $headerLocation: MenuLocationEnum!
    $footerLocation: MenuLocationEnum!
  ) {
    nodeByUri(uri: $uri) {
      ... on Item {
        id
        title
        itemFields {
          cost
          description
          image {
            node {
              sourceUrl
            }
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;
