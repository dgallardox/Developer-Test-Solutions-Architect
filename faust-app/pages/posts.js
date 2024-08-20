import { useQuery, gql } from "@apollo/client";
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

const GET_POSTS = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPosts(
    $headerLocation: MenuLocationEnum!
    $footerLocation: MenuLocationEnum!
  ) {
    posts {
      nodes {
        uri
        title
        excerpt
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

export default function Posts() {
  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: {
      headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

    const { title: siteTitle, description: siteDescription } =
      data?.generalSettings;
    const primaryMenu =
      data.headerMenuItems.nodes ?? [];
    const footerMenu =
      data.footerMenuItems.nodes ?? [];

  return (
    <>
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <h1 className='text-2xl font-bold mb-4'>All Posts:</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {data.posts.nodes.map((post) => (
              <div
                key={post.uri}
                className='border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer'
              >
                <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
                <div
                  className='text-gray-700'
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              </div>
            ))}
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}
