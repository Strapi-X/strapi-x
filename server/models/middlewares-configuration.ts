import { MiddlewareConfiguration } from "./middleware-configuration";

export interface MiddlewaresConfiguration {
    routes: { [uid: string]: string[]; };
    middlewares: MiddlewareConfiguration[];
}