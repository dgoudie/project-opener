import { Box, FilterList } from '@primer/react';
import { Collection, IndexableType } from 'dexie';
import {
  ProjectDatabaseType,
  ProjectType,
  ProjectTypeNameMap,
  ProjectTypes,
} from '../../../constants/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import KeyPressHandler from '../../components/KeyPressHandler/KeyPressHandler';
import TopBar from '../../components/TopBar/TopBar';
import { projectsTable } from '../../indexed-db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';

const PAGE_SIZE = 20;

export default function Home() {
  const { filter: projectType } = useParams();

  const [searchText, setSearchText] = useState('');
  const tokenizedText = useMemo(
    () =>
      searchText
        .toLowerCase()
        .replace(/\//g, '\\')
        .split(' ')
        .filter((item) => !!item.length),
    [searchText]
  );

  const projectsMatchingType = useLiveQuery(
    () =>
      projectsTable
        .orderBy('openedCount')
        .filter(
          (project) =>
            !tokenizedText.length ||
            !!tokenizedText.find(
              (token) =>
                !!project.name.toLowerCase().includes(token) ||
                project.path.toLowerCase().includes(token)
            )
        )
        .and((project) => !projectType || project.type === projectType)
        .toArray(),
    [tokenizedText, projectType],
    [] as ProjectDatabaseType[]
  );

  const allProjects = useLiveQuery(
    () =>
      projectsTable
        .orderBy('openedCount')
        .filter(
          (project) =>
            !tokenizedText.length ||
            !!tokenizedText.find(
              (token) =>
                !!project.name.toLowerCase().includes(token) ||
                project.path.toLowerCase().includes(token)
            )
        )
        .toArray(),
    [tokenizedText, projectType],
    [] as ProjectDatabaseType[]
  );

  const projectCountsByType = useMemo(() => {
    const map = new Map<ProjectType | 'ALL', number>();
    allProjects.forEach((project) => {
      map.set('ALL', (map.get('ALL') ?? 0) + 1);
      map.set(project.type, (map.get(project.type) ?? 0) + 1);
    });
    return map;
  }, [allProjects]);

  return (
    <>
      <KeyPressHandler onEscape={window.BRIDGE.hideApplication} />
      <TopBar searchTextChanged={setSearchText} />
      <Box display='grid' gridTemplateColumns='15rem auto' paddingLeft='1rem'>
        <HomeFilterList projectCountsByType={projectCountsByType} />
        <HomeProjects projects={projectsMatchingType} />
      </Box>
    </>
  );
}

type HomeFilterListProps = {
  projectCountsByType: Map<ProjectType | 'ALL', number>;
};

function HomeFilterList({ projectCountsByType }: HomeFilterListProps) {
  const { filter } = useParams();

  const projectTypesToShow = useMemo(
    () =>
      ProjectTypes.filter(
        (type) => filter === type || projectCountsByType.get(type) > 0
      ),
    [filter, projectCountsByType]
  );

  const children = useMemo(
    () =>
      projectTypesToShow.map((type) => (
        <FilterList.Item
          key={type}
          selected={filter === type}
          count={projectCountsByType.get(type)}
          href={`#/${type}`}
        >
          {ProjectTypeNameMap.get(type)}
        </FilterList.Item>
      )),
    [projectTypesToShow]
  );

  return (
    <FilterList>
      <FilterList.Item
        selected={!filter}
        count={projectCountsByType.get('ALL')}
        href='#/'
      >
        All
      </FilterList.Item>
      {children}
    </FilterList>
  );
}

type HomeProjectsProps = {
  projects: ProjectDatabaseType[];
};

function HomeProjects({ projects }: HomeProjectsProps) {
  return (
    <div>
      {projects.map((project) => (
        <p key={project.path}>{JSON.stringify(project)}</p>
      ))}
    </div>
  );
}
