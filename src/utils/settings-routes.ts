export interface SettingsRoute {
    name: string;
    url: string;
    icon: string;
    key: string;
}

export const settingsRoutes: SettingsRoute[] = [
    {
        name: 'General',
        url: `#/settings/general`,
        icon: 'Settings',
        key: 'general',
    },
    {
        name: 'Filtered Patterns',
        url: `#/settings/filtered-patterns`,
        icon: 'Filter',
        key: 'filtered-patterns',
    },
    {
        name: 'Directories',
        url: `#/settings/directories`,
        icon: 'FolderList',
        key: 'directories',
    },
    {
        name: 'IDEs',
        url: `#/settings/ides`,
        icon: 'CodeEdit',
        key: 'ides',
    },
    {
        name: 'About',
        url: `#/settings/about`,
        icon: 'Info',
        key: 'about',
    },
];
