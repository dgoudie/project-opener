export const partition = <T>(ary: T[], predicate: (_: T) => boolean) =>
    ary.reduce(
        (acc: [T[], T[]], e: T) => {
            acc[predicate(e) ? 0 : 1] = [...acc[predicate(e) ? 0 : 1], e];
            return acc;
        },
        [[], []]
    );

export const spliceOneFromArray = <T>(
    ary: T[],
    predicate: (_: T) => boolean
): [T, T[]] => {
    const [tResults, fResults] = partition(ary, predicate);

    if (tResults.length !== 1) {
        throw new Error(
            `${tResults.length} were partitioned. Only one should be returned.`
        );
    }
    return [tResults[0], fResults];
};
