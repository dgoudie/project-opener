import { Box, FilterList, Text, useTheme } from '@primer/react';
import {
  ProjectDatabaseType,
  ProjectType,
  ProjectTypeNameMap,
  ProjectTypes,
} from '../../../constants/types';
import React, { useMemo, useState } from 'react';

import KeyPressHandler from '../../components/KeyPressHandler/KeyPressHandler';
import TopBar from '../../components/TopBar/TopBar';
import { projectsTable } from '../../indexed-db';
import styles from './Home.module.css';
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
      <Box
        display='grid'
        gridTemplateColumns='15rem auto'
        paddingLeft='1rem'
        minHeight={0}
        flex={1}
      >
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
    <Box
      display={'flex'}
      flexDirection='column'
      overflowY={'auto'}
      px={2}
      pb={2}
      gridGap={2}
    >
      {projects.map((project) => (
        <Project key={project.path} project={project} />
      ))}
    </Box>
  );
}

type ProjectProps = {
  project: ProjectDatabaseType;
};

function Project({ project }: ProjectProps) {
  const { theme } = useTheme();
  return (
    <Box
      display={'flex'}
      // bg='canvas.overlay'
      px={3}
      py={1}
      alignItems='center'
      gridGap={3}
      className={styles.Project}
    >
      <Box height={24} width={36}>
        <img
          src={`/assets/${project.type}.png`}
          height={'100%'}
          width={'100%'}
          style={{ objectFit: 'contain' }}
        ></img>
      </Box>
      <Box flex={1} display={'grid'} gridTemplateRows='1fr 1fr'>
        <Text fontWeight={600} fontSize={3} className={styles.ProjectText}>
          {project.name}
        </Text>
        <Text fontSize={1} className={styles.ProjectText}>
          {project.path}
        </Text>
      </Box>
    </Box>
  );
}
