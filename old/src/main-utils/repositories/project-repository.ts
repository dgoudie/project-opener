import Nedb from 'nedb';
import { Observable, merge } from 'rxjs';
import { Project } from 'src/types';
import electron from 'electron';
import { map, switchMap, tap } from 'rxjs/operators';

const filename = `${electron.app.getPath('userData')}\\data\\projects.db`;

console.debug(`Projects DB path:`, filename);

const db: Nedb<Project> = new Nedb<Project>({
    filename,
    autoload: true,
    corruptAlertThreshold: 1,
    onload: (err: any) => !!err && db.persistence.compactDatafile(),
});
db.persistence.setAutocompactionInterval(14400000);

//create indexes
db.ensureIndex({ fieldName: 'name' });
db.ensureIndex({ fieldName: 'path' });

export const incrementClickCount = (_id: string) => {
    return new Observable((observer) => {
        db.update(
            { _id },
            { $inc: { clickCount: 1 } },
            {},
            (err: Error, numberOfUpdated: number) => {
                if (!!err) {
                    observer.error(err);
                }
                if (numberOfUpdated !== 1) {
                    observer.error(
                        new Error(
                            'Unexpected number of items updated in database during click count increment.'
                        )
                    );
                } else {
                    observer.next();
                }
                observer.complete();
            }
        );
    });
};

export const countAllProjectsWithoutParent = () =>
    findChildProjectIds().pipe(
        switchMap((childProjectIds) =>
            findProjectCount(
                buildQueryWithTextSearchAndExludedProjectIds(
                    '',
                    Array.from(childProjectIds)
                )
            )
        )
    );

export const getProjectById = (_id: string) =>
    new Observable<Project>((o) => {
        db.findOne({ _id }, (err, project) => {
            !!err ? o.error(err) : o.next(project);
            o.complete();
        });
    });

export const getProjectsByIdsAndSearchText = (ids: string[], text = '') =>
    new Observable<Project[]>((o) => {
        db.find(buildQueryWithTextSearchAndIncludedProjectIds(text, ids))
            .sort({ clickCount: -1, name: 1, path: 1 })
            .exec((err, projects) => {
                !!err ? o.error(err) : o.next(projects);
                o.complete();
            });
    });

export const getAllProjectsWithoutParent = () =>
    findChildProjectIds().pipe(
        switchMap((childProjectIds) =>
            findProjects({ _id: { $nin: Array.from(childProjectIds) } })
        )
    );

export const searchProjectsWithoutParent = (text: string) =>
    findChildProjectIds().pipe(
        switchMap((childProjectIds) =>
            findProjects(
                buildQueryWithTextSearchAndExludedProjectIds(
                    text,
                    Array.from(childProjectIds)
                )
            )
        )
    );

export const findProjectsByPath = (path: string) =>
    findProjects({ inside: path });

const findChildProjectIds = () =>
    findProjects({
        $where: function () {
            return !!(<string[]>this.children)?.length;
        },
    }).pipe(
        map((projects) =>
            projects.reduce((set, project) => {
                project.children.forEach((child) => set.add(child));
                return set;
            }, new Set<string>())
        )
    );

const findProjects = (query: any) => {
    return new Observable<Project[]>((o) => {
        db.find(query)
            .sort({ clickCount: -1, name: 1, path: 1 })
            .exec((err, projects) => {
                !!err ? o.error(err) : o.next(projects);
                o.complete();
            });
    });
};

const findProjectCount = (query: any) => {
    return new Observable<number>((o) => {
        db.count(query).exec((err, count) => {
            !!err ? o.error(err) : o.next(count);
            o.complete();
        });
    });
};

export const insertProjects = (projects: Project[]): Observable<Project[]> => {
    return new Observable<Project[]>((observer) => {
        db.insert(projects, (err) => {
            if (!!err) {
                observer.error(err);
            } else {
                observer.next(projects);
            }
            observer.complete();
        });
    });
};

export function removeProjectsByPath(path: string): Observable<string> {
    return new Observable<string>((observer) => {
        db.remove({ inside: path }, { multi: true }, (err) => {
            if (!!err) {
                observer.error(err);
            } else {
                compact();
                observer.next(path);
            }
            observer.complete();
        });
    });
}

export function removeProjects(projects: Project[]): Observable<Project[]> {
    return new Observable<Project[]>((observer) => {
        const ids = projects.map((proj) => proj._id);
        db.remove({ _id: { $in: ids } }, { multi: true }, (err) => {
            if (!!err) {
                observer.error(err);
            } else {
                compact();
                observer.next(projects);
            }
            observer.complete();
        });
    });
}

export const setChildren = () => {
    const projects$ = new Observable<Project[]>((o) => {
        db.find({}).exec((err, projects) => {
            !!err ? o.error(err) : o.next(projects);
            o.complete();
        });
    });
    const parentChildrenMap$ = projects$.pipe(
        map((projects) => getParentChildMap(projects))
    );
    return parentChildrenMap$.pipe(switchMap(updateChildIds));
};

const updateChildIds = (parentChildrenMap: Map<string, string[]>) => {
    const clearChildren$ = new Observable<void>((observer) => {
        db.update({}, { $set: { children: [] } }, {}, (err) => {
            if (!!err) {
                observer.error(err);
            }
            observer.complete();
        });
    });
    let updateEach$: Observable<void>[] = [];
    parentChildrenMap.forEach((childIdList, parentId) => {
        updateEach$ = [
            ...updateEach$,
            new Observable((observer) => {
                db.update(
                    { _id: parentId },
                    { $set: { children: childIdList } },
                    {},
                    (err) => {
                        if (!!err) {
                            observer.error(err);
                        }
                        observer.complete();
                    }
                );
            }),
        ];
    });

    return clearChildren$.pipe(() => merge(...updateEach$));
};

const buildQueryWithTextSearchAndExludedProjectIds = (
    text: string,
    excludedProjectIds: string[]
) => {
    return {
        $and: [
            { _id: { $nin: excludedProjectIds } },
            ...buildQueryForText(text),
        ],
    };
};

const buildQueryWithTextSearchAndIncludedProjectIds = (
    text: string,
    includedProjectIds: string[]
) => {
    return {
        $and: [
            { _id: { $in: includedProjectIds } },
            ...buildQueryForText(text),
        ],
    };
};

const buildQueryForText = (text: string) => {
    const tokenizedText = text.toLowerCase().replace(/\//g, '\\').split(' ');
    return tokenizedText.map((token) => ({
        $or: [
            {
                $where: function () {
                    return !!(<string>this.name)?.toLowerCase().includes(token);
                },
            },
            {
                $where: function () {
                    return !!(<string>this.path)?.toLowerCase().includes(token);
                },
            },
        ],
    }));
};

const getParentChildMap = (projects: Project[]) => {
    const pathSegmentIdMap = new Map<string, Project>();

    projects.forEach((project) => {
        const segments = segmentPath(project);
        pathSegmentIdMap.set(JSON.stringify(segments), project);
    });
    const parentChildrenMap = new Map<string, string[]>();
    projects.forEach((project) => {
        const segments = segmentPath(project);
        const fullJoinedPath = JSON.stringify(segments);
        let allParents: Project[] = [];
        for (let i = 0; i < segments.length; i++) {
            let joinedSegments: string[] = [];
            for (let j = 0; j - 1 < i; j++) {
                joinedSegments = [...joinedSegments, segments[j]];
            }
            const joinedPath = JSON.stringify(joinedSegments);
            if (
                fullJoinedPath !== joinedPath &&
                pathSegmentIdMap.has(joinedPath)
            ) {
                allParents = [...allParents, pathSegmentIdMap.get(joinedPath)];
            }
        }
        const parent = allParents.sort(
            (parent1, parent2) => parent1.path.length - parent2.path.length
        )[0];
        if (!!parent) {
            const childIds = parentChildrenMap.get(parent._id);
            if (!childIds) {
                parentChildrenMap.set(parent._id, [project._id]);
            } else {
                parentChildrenMap.set(parent._id, [...childIds, project._id]);
            }
        }
    });
    return parentChildrenMap;
};

const segmentPath = (project: Project) =>
    project.path
        .replace(project.inside, '')
        .split(/[\/\\]/)
        .filter(
            (segment) => !!segment && segment !== project.type.projectFileName
        );

export function compact() {
    db.persistence.compactDatafile();
}
