import Nedb from 'nedb';
import { Observable } from 'rxjs';
import { Project } from 'src/types';
import electron from 'electron';

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

export const countAllProjects = () =>
    new Observable<number>((o) => {
        db.count({}).exec((err, count) => {
            !!err ? o.error(err) : o.next(count);
            o.complete();
        });
    });

export const getProjectById = (_id: string) =>
    new Observable<Project>((o) => {
        db.findOne({ _id }, (err, project) => {
            !!err ? o.error(err) : o.next(project);
            o.complete();
        });
    });

export const getAllProjects = () => findProjects({});

export const searchProjects = (text: string) => findProjects(buildQuery(text));

export const findProjectsByPath = (path: string) =>
    findProjects({ inside: path });

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
export const insertProjects = (projects: Project[]): Observable<Project[]> => {
    return new Observable((observer) => {
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
    return new Observable((observer) => {
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

const buildQuery = (text: string) => {
    const tokenizedText = text.toLowerCase().replace(/\//g, '\\').split(' ');
    return {
        $and: [
            ...tokenizedText.map((token) => ({
                $or: [
                    {
                        $where: function () {
                            return !!(<string>this.name)
                                ?.toLowerCase()
                                .includes(token);
                        },
                    },
                    {
                        $where: function () {
                            return !!(<string>this.path)
                                ?.toLowerCase()
                                .includes(token);
                        },
                    },
                ],
            })),
        ],
    };
};

export function compact() {
    db.persistence.compactDatafile();
}
