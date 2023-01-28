import { Box, NavList, useConfirm } from '@primer/react';
import {
  ChevronLeftIcon,
  CodeIcon,
  FileDirectoryFillIcon,
  FilterIcon,
  GearIcon,
  InfoIcon,
  XCircleIcon,
} from '@primer/octicons-react';
import React, { useCallback } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import KeyPressHandler from '../../components/KeyPressHandler/KeyPressHandler';
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
          padding='1rem'
          display='grid'
          gridTemplateColumns='max-content max-content'
          justifyContent='space-between'
          style={{
            //@ts-ignore
            WebkitAppRegion: 'drag',
          }}
        ></Box>
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
  const confirm = useConfirm();
  const confirmExit = useCallback(async () => {
    if (
      await confirm({
        title: `Quit project-opener?`,
        content: '',
        confirmButtonType: 'danger',
        confirmButtonContent: 'Quit',
      })
    ) {
      window.BRIDGE?.closeApplication();
    }
  }, [confirm]);
  return (
    <Box paddingLeft='.5rem'>
      <NavList>
        <NavList.Item href={`#/`}>
          <NavList.LeadingVisual>
            <ChevronLeftIcon />
          </NavList.LeadingVisual>
          Home
        </NavList.Item>
        <NavList.Divider />
        {settingsRoutes.map((route) => {
          return (
            <NavList.Item
              href={`#/settings${route.pathname}`}
              key={route.pathname}
              aria-current={
                `/settings${route.pathname}` === pathname ? 'page' : false
              }
            >
              <NavList.LeadingVisual>
                <route.icon />
              </NavList.LeadingVisual>
              {route.name}
            </NavList.Item>
          );
        })}
        <NavList.Divider />
        <NavList.Item onClick={confirmExit}>
          <NavList.LeadingVisual>
            <XCircleIcon />
          </NavList.LeadingVisual>
          Quit
        </NavList.Item>
      </NavList>
    </Box>
  );
}
