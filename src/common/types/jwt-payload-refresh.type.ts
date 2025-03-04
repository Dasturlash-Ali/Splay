import { JwtPayload } from "./jwt-payload.type";

export type JwtPayloadWidthRefreshToken = JwtPayload & { refreshToken: string};