import { useAsync } from 'react-async-hook';

export const useProjectSearchResults = (searchText: string) => {
    return useAsync<any[], [searchText: string]>(
        async (searchText: string) => [searchText] as any[],
        [searchText]
    );
};
