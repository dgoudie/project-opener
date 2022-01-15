export const isDefined = (val: any) =>
    typeof val !== 'undefined' && val !== null;

export const isNullOrUndefined = (val: any) =>
    typeof val === 'undefined' || val === null;
