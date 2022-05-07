import {
  Box,
  Button,
  Details,
  Popover,
  SideNav,
  StyledOcticon,
  Text,
  UnderlineNav,
  useDetails,
} from '@primer/react';
import {
  ChevronLeftIcon,
  CodeIcon,
  FileDirectoryFillIcon,
  FilterIcon,
  GearIcon,
  InfoIcon,
  XIcon,
} from '@primer/octicons-react';
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import KeyPressHandler from '../../components/KeyPressHandler/KeyPressHandler';
import React from 'react';
import Settings_Directories from './Settings_Directories';
import Settings_FilteredPatterns from './Settings_FilteredPatterns';
import Settings_General from './Settings_General';

const settingsRoutes = [
  {
    name: 'General',
    pathname: '/general',
    element: <Settings_General />,
    icon: GearIcon,
  },
  {
    name: 'Filtered Patterns',
    pathname: '/filtered-patterns',
    element: <Settings_FilteredPatterns />,
    icon: FilterIcon,
  },
  {
    name: 'Directories',
    pathname: '/directories',
    element: <Settings_Directories />,
    icon: FileDirectoryFillIcon,
  },
  {
    name: 'IDEs',
    pathname: '/ides',
    icon: CodeIcon,
  },
  {
    name: 'About',
    pathname: '/about',
    icon: InfoIcon,
  },
];

export default function Settings() {
  const navigate = useNavigate();
  return (
    <>
      <KeyPressHandler onEscape={() => navigate('/')} />
      <Box display='grid' gridTemplateRows='max-content auto' height='100%'>
        <Box
          bg='canvas.subtle'
          padding='.5rem'
          display='grid'
          gridTemplateColumns='max-content max-content'
          justifyContent='space-between'
          style={{
            //@ts-ignore
            WebkitAppRegion: 'drag',
          }}
        >
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <Button
              leadingIcon={ChevronLeftIcon}
              variant='invisible'
              style={{
                justifySelf: 'start',
                cursor: 'pointer',
                //@ts-ignore
                WebkitAppRegion: 'no-drag',
              }}
            >
              Home
            </Button>
          </Link>
          <ExitApplicationButton />
        </Box>
        <Box
          display='grid'
          gridTemplateColumns='max-content auto'
          minHeight={0}
        >
          <SettingsNav />
          <Box minHeight={0} paddingX='1rem'>
            <Routes>
              {settingsRoutes.map((route) => (
                <Route
                  key={route.pathname}
                  path={route.pathname}
                  element={route.element}
                >
                  {route.name}
                </Route>
              ))}
            </Routes>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function SettingsNav() {
  const { pathname } = useLocation();
  return (
    <Box padding='1rem 0 1rem 1rem'>
      <SideNav aria-label='Settings Navigation' bordered>
        {settingsRoutes.map((route) => {
          return (
            <SideNav.Link
              as={NavLink}
              to={`/settings${route.pathname}`}
              key={route.pathname}
              selected={`/settings${route.pathname}` === pathname}
            >
              <StyledOcticon sx={{ mr: 2 }} size={16} icon={route.icon} />
              <Text>{route.name}</Text>
            </SideNav.Link>
          );
        })}
      </SideNav>
    </Box>
  );
}

function ExitApplicationButton() {
  const { getDetailsProps, setOpen, open } = useDetails({
    closeOnOutsideClick: true,
  });
  return (
    <Box
      position='relative'
      style={{
        //@ts-ignore
        WebkitAppRegion: 'no-drag',
      }}
    >
      <Details {...getDetailsProps()}>
        <summary>
          <Button
            variant='invisible'
            sx={{ paddingX: '10px' }}
            onClick={() => setOpen(!open)}
          >
            <StyledOcticon size={16} icon={XIcon} />
          </Button>
        </summary>
        <Popover
          open={true}
          caret='right-top'
          sx={{ top: 0, right: `calc(100% + 1rem)` }}
        >
          <Popover.Content>
            <Text as='p' sx={{ marginTop: 0 }}>
              Are you sure you'd like to exit?
            </Text>
            <Button variant='danger' onClick={window.BRIDGE?.closeApplication}>
              Yes
            </Button>
          </Popover.Content>
        </Popover>
      </Details>
    </Box>
  );
}
