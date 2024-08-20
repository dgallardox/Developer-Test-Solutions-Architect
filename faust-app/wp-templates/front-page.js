import { useQuery, gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  Hero,
  SEO,
} from '../components';
import Image from 'next/image';
import Link from 'next/link';

export default function Component() {
  const { data } = useQuery(Component.query, {
    variables: Component.variables(),
  });

  const items = data.items.nodes
  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <Image src='/header.png' height={450} width={1000} priority={true} />
          <div className="my-[10px] font-semibold text-xl">Featured Items:</div>
          <div className='flex justify-between flex-wrap'>

            {items.map((item) => {
              const { cost, description } = item.itemFields;
              const { sourceUrl: imageUrl } = item.itemFields.image.node

              if (!!item.itemFields.featured) {
                return (
                  <>
                    <Link href={item.uri}>
                      <div className='w-[30%] border rounded-lg p-[20px] mb-[20px] shadow-md hover:shadow-lg cursor-pointer'>
                        {/* <Link href={item.uri}> */}
                        <div className='font-semibold mb-[5px]'>{item.title}</div>

                        <Image src={imageUrl} height={250} width={300} />
                        <div>cost: ${cost}</div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: description,
                          }}
                        />
                        {/* </Link> */}
                      </div>
                    </Link>
                  </>
                );
              }
              })}
            
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    items(first: 100) {
      nodes {
        title
        uri
        itemFields {
          cost
          description
          featured
          image {
            node {
              sourceUrl
            }
          }
        }
      }
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

Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
