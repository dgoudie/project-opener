import { Box, useColorSchemeVar, useTheme } from '@primer/react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import React, { useMemo } from 'react';

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
                <Routes>
                    <Route path='/settings/*' element={<Settings />} />
                    <Route path='/:filter' element={<Home />} />
                    <Route path='/' element={<Home />} />
                </Routes>
            </HashRouter>
        </Box>
    );
}
