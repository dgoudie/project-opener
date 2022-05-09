import { Box, useColorSchemeVar } from '@primer/react';
import {
  HashRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import SnackbarProvider, {
  SnackbarContext,
} from './providers/SnackbarProvider';

import DirectoryProvider from './providers/DirectoryProvider';
import FilteredPatternProvider from './providers/FilteredPatternProvider';
import FirstTimeSetupChecker from './components/FirstTimeSetupChecker/FirstTimeSetupChecker';
import Home from './views/Home/Home';
import Settings from './views/Settings/Settings';
import SettingsProvider from './providers/SettingsProvider';
import primatives from '@primer/primitives';

export default function App() {
  const boxBackground = useColorSchemeVar(
    {
      light: primatives.colors.light.scale.gray[1],
      dark: primatives.colors.dark.scale.gray[9],
    },
    primatives.colors.light.scale.gray[1]
  );
  return (
    <Box bg={boxBackground} height='100vh'>
      <SettingsProvider>
        <DirectoryProvider>
          <FilteredPatternProvider>
            <SnackbarProvider>
              <HashRouter basename='/'>
                <NavigateHomeListener />
                <ExceptionListener />
                <FirstTimeSetupChecker />
                <RouteReporter />
                <Routes>
                  <Route path='/settings/*' element={<Settings />} />
                  <Route path='/:filter' element={<Home />} />
                  <Route path='/' element={<Home />} />
                </Routes>
              </HashRouter>
            </SnackbarProvider>
          </FilteredPatternProvider>
        </DirectoryProvider>
      </SettingsProvider>
    </Box>
  );
}

const NavigateHomeListener: React.FunctionComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.BRIDGE.onNavigateHomeRequested(() => navigate('/'));
  }, []);
  return null;
};

const ExceptionListener: React.FunctionComponent = () => {
  const { showNotification } = useContext(SnackbarContext);

  useEffect(() => {
    window.BRIDGE.onExceptionReceived((event, type, message) =>
      showNotification(type, message, 5000)
    );
  }, []);
  return null;
};

const RouteReporter: React.FunctionComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.BRIDGE?.reportActiveRoute(pathname);
  }, [pathname]);
  return null;
};
