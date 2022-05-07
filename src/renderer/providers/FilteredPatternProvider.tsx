import React, { createContext, useCallback, useEffect, useState } from 'react';

import { FilteredPatternDatabaseType } from '../types';
import { filteredPatternsTable } from '../indexed-db';

type FilteredPatternContextType = {
  filteredPatterns: FilteredPatternDatabaseType[];
  addFilteredPattern: (pattern: string) => Promise<void>;
  deleteFilteredPattern: (pattern: string) => Promise<void>;
};

export const FilteredPatternContext = createContext<
  FilteredPatternContextType | undefined
>(undefined);

export default function FilteredPatternProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [filteredPatterns, setFilteredPatterns] =
    useState<FilteredPatternDatabaseType[]>(undefined);

  const syncStateWithDatabase = useCallback(
    () =>
      filteredPatternsTable
        .orderBy('pattern')
        .toArray()
        .then((filteredPatterns) => setFilteredPatterns(filteredPatterns)),
    []
  );

  useEffect(() => {
    syncStateWithDatabase();
  }, []);

  const addFilteredPattern = useCallback((pattern: string) => {
    const addAsync = async () => {
      const newDirectory: FilteredPatternDatabaseType = {
        pattern,
        createdAt: new Date(),
      };
      await filteredPatternsTable.add(newDirectory);
      await syncStateWithDatabase();
    };
    return addAsync();
  }, []);

  const deleteFilteredPattern = useCallback((pattern: string) => {
    const deleteAsync = async () => {
      await filteredPatternsTable.delete(pattern);
      await syncStateWithDatabase();
    };
    return deleteAsync();
  }, []);

  if (typeof filteredPatterns === 'undefined') {
    return null;
  }

  return (
    <FilteredPatternContext.Provider
      value={{ filteredPatterns, addFilteredPattern, deleteFilteredPattern }}
    >
      {children}
    </FilteredPatternContext.Provider>
  );
}
