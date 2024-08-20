import { useQuery, gql } from "@apollo/client";
import * as MENUS from "../constants/menus";
import { BlogInfoFragment } from "../fragments/GeneralSettings";
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  Hero,
  SEO,
} from "../components";
import Image from "next/image";
import Link from "next/link";

const GET_CTA = gql`
query GET_CTA {
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
}`;

export default function Component() {
  const { data } = useQuery(Component.query, {
    variables: Component.variables(),
  });
  const { data: CTA, loading, error } = useQuery(GET_CTA);
  console.log(CTA)
  
  const items = data?.items.nodes;
  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];

  if (error) {
    console.error(error)
  }

  if (loading) {
    return (
      <>
        ...loading
      </>
    )
  }
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
              src={CTA.page.cta.image.node.sourceUrl}
              height={450}
              width={1000}
              priority={true}
              className='object-cover w-full h-auto'
            />
            <div className='absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-40 p-8'>
              <div className='text-white text-4xl font-bold mb-6'>
                {CTA.page.cta.text}
              </div>

              <div className='bg-blue-600 text-white py-3 px-6 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors'>
                <Link
                  href={CTA.page.cta.link.url}
                >
                  {CTA.page.cta.link.title}
                </Link>
              </div>
            </div>
          </div>

          <div className='my-[10px] font-semibold text-xl'>Featured Items:</div>
          <div className='flex flex-wrap justify-between'>
            {items.map((item) => {
              const { cost, description } = item.itemFields;
              const { sourceUrl: imageUrl } = item.itemFields.image.node;

              if (item.itemFields.featured) {
                return (
                  <div className='w-full sm:w-[100%] md:w-[30%] border rounded-lg p-[20px] mb-[20px] shadow-md hover:shadow-lg cursor-pointer'>
                    <div className='font-semibold mb-[5px]'>{item.title}</div>
                    <Image src={imageUrl} height={250} width={300} />
                    <div>cost: ${cost}</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: description,
                      }}
                    />
                    <div className='text-black py-3 px-6 w-[60%] text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors'>
                      <Link href={item.uri}>Learn more</Link>
                    </div>
                  </div>
                );
              }
              return null;
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
