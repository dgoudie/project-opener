import React from 'react';

interface Props {
    searchText: string;
    children: (searchResults: any[]) => JSX.Element;
}

export default function SearchResults({ searchText, children }: Props) {
    return children([]);
}
