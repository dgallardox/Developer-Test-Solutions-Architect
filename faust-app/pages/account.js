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
import { useAuth } from "@faustwp/core";
import { useLogout } from "@faustwp/core";
import { getApolloAuthClient } from "@faustwp/core";

const GET_DATA = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetData(
    $headerLocation: MenuLocationEnum!
    $footerLocation: MenuLocationEnum!
  ) {
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

const GET_USER_CONTENT = gql`
  {
    viewer {
      name
    }
  }
`

export default function Account() {
  const { isAuthenticated, loginUrl } = useAuth();
   const { logout } = useLogout();
  
  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      headerLocation: MENUS.PRIMARY_LOCATION,
      footerLocation: MENUS.FOOTER_LOCATION,
    },
  });

  const client = getApolloAuthClient();

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_CONTENT, {
    skip: !isAuthenticated,
    client ,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data.headerMenuItems.nodes ?? [];
  const footerMenu = data.footerMenuItems.nodes ?? [];

  if (!!isAuthenticated) {
    return (
      <>
        <Header
          title={siteTitle}
          description={siteDescription}
          menuItems={primaryMenu}
        />
        <Main>
          <Container>
            <div className="font-semibold text-xl">Welcome, { userData.viewer.name }</div>
          </Container>
        </Main>
        <Footer title={siteTitle} menuItems={footerMenu} />
      </>
    );
  }

  return (
    <>
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <div className='font-semibold text-xl mb-[30px]'>
            Hello! Please login to see your account
          </div>
          <a className="bg-black p-[20px] text-white rounded-md" href={loginUrl}>Login</a>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}
