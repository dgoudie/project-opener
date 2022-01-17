export interface Job {
    start: () => void | Promise<void>;
    stop: () => void | Promise<void>;
}
