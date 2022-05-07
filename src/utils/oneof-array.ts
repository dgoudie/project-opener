export function literals<T extends string | number>(...args: T[]): T[] {
    return args;
}
export type ElementOf<T extends ReadonlyArray<unknown>> =
    T extends ReadonlyArray<infer ElementOf> ? ElementOf : never;
