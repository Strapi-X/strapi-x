export type MiddlewareConfiguration = {
    uid: string;
    type: string;
    enabled: boolean;
    config: { [key: string]: any; };
    route: string;
    method: string;
};