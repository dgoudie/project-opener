export interface AppNotification {
    text: string;
    dismissTimeMs: number | null;
    id: string;
    iconName: string;
    _displayStarted?: boolean;
}
