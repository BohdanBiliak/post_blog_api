import { Request } from "express";

export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;