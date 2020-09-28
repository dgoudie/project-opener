import { ConnectedComponent } from 'react-redux';
import Settings_About from 'src/routes/Settings_About';
import Settings_Directories from 'src/routes/Settings_Directories';
import Settings_FilteredPatterns from 'src/routes/Settings_FilteredPatterns';
import Settings_General from 'src/routes/Settings_General';
import Settings_IDEs from 'src/routes/Settings_IDEs';

export interface SettingsRoute {
    name: string;
    url: string;
    icon: string;
    key: string;
    Component: ConnectedComponent<any, any>;
}

export const settingsRoutes: SettingsRoute[] = [
    {
        name: 'General',
        url: `#/settings/general`,
        icon: 'Settings',
        key: 'general',
        Component: Settings_General,
    },
    {
        name: 'Filtered Patterns',
        url: `#/settings/filtered-patterns`,
        icon: 'Filter',
        key: 'filtered-patterns',
        Component: Settings_FilteredPatterns,
    },
    {
        name: 'Directories',
        url: `#/settings/directories`,
        icon: 'FolderList',
        key: 'directories',
        Component: Settings_Directories,
    },
    {
        name: 'IDEs',
        url: `#/settings/ides`,
        icon: 'CodeEdit',
        key: 'ides',
        Component: Settings_IDEs,
    },
    {
        name: 'About',
        url: `#/settings/about`,
        icon: 'Info',
        key: 'about',
        Component: Settings_About,
    },
];
