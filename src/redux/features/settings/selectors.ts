import { ProjectType } from 'src/types';
import { RootState } from 'src/redux/store/types';

export const selectSettings = (state: RootState) => state.settings;

export const findIde = (state: RootState) => (projectType: ProjectType) =>
    state.settings.ides.find((ide) => ide.projectType.key === projectType.key);

export const selectPaths = (state: RootState) => state.settings.paths;

export const selectFilteredPatterns = (state: RootState) =>
    state.settings.filteredPatterns;
