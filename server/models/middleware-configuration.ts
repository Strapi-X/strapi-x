import { MiddlewareConfig, Middlewares } from "../middlewares";

export interface MiddlewareConfiguration {
    uid: string;
    type: Middlewares;
    config: MiddlewareConfig;
    enabled: boolean;
    route: string;
    method: string;
}