import { Box, FilterList } from '@primer/react';
import React, { useEffect, useState } from 'react';

import KeyPressHandler from '../../components/KeyPressHandler/KeyPressHandler';
import SearchResults from '../../components/SearchResults/SearchResults';
import TopBar from '../../components/TopBar/TopBar';
import { useParams } from 'react-router-dom';
import { useProjectSearchResults } from '../../hooks/use-project-search-results';

export default function Home() {
    const [searchText, setSearchText] = useState('');

    let { result, loading } = useProjectSearchResults(searchText);

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!!result && !loading) {
            setProjects(result);
        }
    }, [result, loading, setProjects]);

    return (
        <>
            <KeyPressHandler onEscape={window.bridgeApis.hideApplication} />
            <TopBar searchTextChanged={setSearchText} />
            <Box
                display='grid'
                gridTemplateColumns='15rem auto'
                paddingLeft='1rem'
            >
                <HomeFilterList />
            </Box>
        </>
    );
}

function HomeFilterList() {
    const { filter } = useParams();
    return (
        <FilterList>
            <FilterList.Item selected={!filter} count={32} href='#/'>
                All
            </FilterList.Item>
            <FilterList.Item
                selected={filter === 'Maven'}
                count={32}
                href='#/Maven'
            >
                Maven
            </FilterList.Item>
            <FilterList.Item selected={filter === 'NPM'} count={2} href='#/NPM'>
                NPM
            </FilterList.Item>
            <FilterList.Item selected={filter === 'Rust'} href='#/Rust'>
                Rust
            </FilterList.Item>
        </FilterList>
    );
}
