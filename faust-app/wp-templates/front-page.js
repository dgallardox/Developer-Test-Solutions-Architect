import { useQuery, gql } from "@apollo/client";
import * as MENUS from "../constants/menus";
import { BlogInfoFragment } from "../fragments/GeneralSettings";
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
} from "../components";
import Image from "next/image";
import Link from "next/link";

const GET_PAGE_DATA_AND_CTA = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageDataAndCTA(
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
    page(id: "/", idType: URI) {
      uri
      cta {
        image {
          node {
            sourceUrl
          }
        }
        text
        link {
          url
          title
        }
      }
    }
  }
`;

export default function Component() {

  const { data, loading, error } = useQuery(GET_PAGE_DATA_AND_CTA, {
    variables: Component.variables(),
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const items = data?.items.nodes;
  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const CTA = data?.page?.cta;

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
          <div className='relative w-full'>
            <Image
              src={CTA?.image.node.sourceUrl}
              height={450}
              width={1000}
              priority={true}
              className='object-cover w-full h-auto'
            />
            <div className='absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-40 p-8'>
              <div className='text-white text-4xl font-bold mb-6'>
                {CTA?.text}
              </div>

              <div className='bg-blue-600 text-white py-3 px-6 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors'>
                <Link href={CTA?.link.url}>{CTA?.link.title}</Link>
              </div>
            </div>
          </div>

          <div className='my-[10px] font-semibold text-xl'>Featured Items:</div>
          <div className='flex flex-wrap justify-between'>
            {items.map((item) => {
              const { uri, title } = item
              const { featured } = item.itemFields;
              const { cost, description } = item.itemFields;
              const { sourceUrl: imageUrl } = item.itemFields.image.node;
              if (!!featured) {
                return (
                  <div
                    key={uri}
                    className='w-full sm:w-[100%] md:w-[30%] border rounded-lg p-[20px] mb-[20px] shadow-md hover:shadow-lg cursor-pointer'
                  >
                    <div className='font-semibold mb-[5px]'>{title}</div>
                    <Image src={imageUrl} height={250} width={300} />
                    <div>cost: ${cost}</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: description,
                      }}
                    />
                    <Link href={uri}>
                      <div className='text-black py-3 px-6 w-[60%] rounded-lg shadow-md hover:bg-[#cbd5e1] transition-colors'>
                        Learn more
                      </div>
                    </Link>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
