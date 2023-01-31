import { Box, NavList, Text, themeGet } from '@primer/react';
import {
  ProjectDatabaseType,
  ProjectType,
  ProjectTypeNameMap,
  ProjectTypes
} from '../../../constants/types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import ButtonLink from '../../components/ButtonLink/ButtonLink';
import { HomeIcon } from '@primer/octicons-react';
import KeyPressHandler from '../../components/KeyPressHandler/KeyPressHandler';
import TopBar from '../../components/TopBar/TopBar';
import classNames from 'classnames';
import { projectsTable } from '../../indexed-db';
import styled from 'styled-components';
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

  const [selectedProject, setSelectedProject] = useState(0);

  useEffect(() => {
    setSelectedProject(0);
  }, [projectsMatchingType]);

  const onDownArrow = useCallback(() => {
    if (selectedProject < projectsMatchingType.length - 1) {
      setSelectedProject(selectedProject + 1);
    }
  }, [selectedProject, projectsMatchingType]);

  const onUpArrow = useCallback(() => {
    if (selectedProject > 0) {
      setSelectedProject(selectedProject - 1);
    }
  }, [selectedProject]);

  return (
    <>
      <KeyPressHandler
        onEscape={window.BRIDGE.hideApplication}
        onDownArrow={onDownArrow}
        onUpArrow={onUpArrow}
      />
      <TopBar searchTextChanged={setSearchText} />
      <Box
        display='grid'
        gridTemplateColumns='15rem auto'
        paddingLeft='1rem'
        minHeight={0}
        flex={1}
      >
        <HomeFilterList projectCountsByType={projectCountsByType} />
        <HomeProjects
          projects={projectsMatchingType}
          selectedProject={selectedProject}
        />
      </Box>
    </>
  );
}

const ProjectTypeNavListImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

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
        <NavList.Item
          key={type}
          aria-current={filter === type ? 'page' : false}
          href={`#/${type}`}
        >
          <NavList.LeadingVisual>
            <ProjectTypeNavListImage
              src={require(`../../../assets/${type}.png`)}
            />
          </NavList.LeadingVisual>
          {ProjectTypeNameMap.get(type)}
          <NavList.TrailingVisual>
            {projectCountsByType.get(type)}
          </NavList.TrailingVisual>
        </NavList.Item>
      )),
    [projectTypesToShow]
  );

  return (
    <NavList>
      <NavList.Item href='#/' aria-current={!filter ? 'page' : false}>
        <NavList.LeadingVisual>
          <HomeIcon />
        </NavList.LeadingVisual>
        All
        <NavList.TrailingVisual>
          {projectCountsByType.get('ALL')}
        </NavList.TrailingVisual>
      </NavList.Item>
      {children}
    </NavList>
  );
}

type HomeProjectsProps = {
  projects: ProjectDatabaseType[];
  selectedProject: number;
};

function HomeProjects({ projects, selectedProject }: HomeProjectsProps) {
  return (
    <Box display={'flex'} flexDirection='column' overflowY={'auto'}>
      {projects.map((project, index) => (
        <Project
          key={project.path}
          project={project}
          selected={selectedProject === index}
        />
      ))}
    </Box>
  );
}

const ProjectWrapper = styled.button`
  display: flex;
  align-items: center;
  padding: 6px 14px 12px;
  user-select: none;
  gap: 16px;
  -webkit-appearance: none;
  font-family: inherit;
  border: none;
  background: transparent;
  text-align: start;
  cursor: pointer;
  color: ${themeGet('colors.btn.text')};
  outline: none;
  width: 100%;
  &:hover {
    background: ${themeGet('colors.btn.bg')};
  }
  &:active {
    background: ${themeGet('colors.btn.activeBg')};
  }
  &.selected {
    background: ${themeGet('colors.accent.subtle')};
  }
  &.selected:hover {
    background: ${themeGet('colors.accent.muted')};
  }
  &.selected:active {
    background: ${themeGet('colors.accent.emphasis')};
  }
`;

type ProjectProps = {
  project: ProjectDatabaseType;
  selected: boolean;
};

function Project({ project, selected }: ProjectProps) {
  const previouslySelected = useRef(false);

  const wrapper = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!previouslySelected.current && selected) {
      wrapper.current?.focus();
    }
    previouslySelected.current = selected;
  });

  return (
    <Box position={'relative'}>
      <ProjectWrapper
        className={classNames(selected && 'selected')}
        ref={wrapper}
        onClick={() => alert(project.name)}
      >
        <Box height={24} width={36}>
          <img
            src={require(`../../../assets/${project.type}.png`)}
            height={'100%'}
            width={'100%'}
            style={{ objectFit: 'contain' }}
          ></img>
        </Box>
        <Box flex={1} display='flex' flexDirection='column'>
          <ProjectText fontWeight={600} fontSize={3}>
            {project.name}
          </ProjectText>
          <ProjectText fontSize={1}>{project.path}</ProjectText>
          <Box height={'24px'} />
        </Box>
      </ProjectWrapper>
      <Box position={'absolute'} bottom='1rem' left='66px'>
        <ButtonLink
          tabIndex={-1}
          onClick={() => window.BRIDGE.openProjectDirectory(project.path)}
        >
          View in Explorer
        </ButtonLink>
      </Box>
    </Box>
  );
}

const ProjectText = styled(Text)`
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  overflow-x: hidden;
`;
