import { Box, useColorSchemeVar } from '@primer/react';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

import FirstTimeSetupChecker from './components/FirstTimeSetupChecker/FirstTimeSetupChecker';
import Home from './views/Home/Home';
import Settings from './views/Settings/Settings';
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
            <HashRouter basename='/'>
                <NavigateHomeListener />
                <FirstTimeSetupChecker />
                <Routes>
                    <Route path='/settings/*' element={<Settings />} />
                    <Route path='/:filter' element={<Home />} />
                    <Route path='/' element={<Home />} />
                </Routes>
            </HashRouter>
        </Box>
    );
}

const NavigateHomeListener: React.FunctionComponent = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // window.bridgeApis.onNavigateHomeRequested(() => navigate('/'));
    }, []);
    return null;
};
