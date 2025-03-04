import { PassportStrategy } from "@nestjs/passport";
import { JwtFromRequestFunction, Strategy } from "passport-jwt";
import { JwtPayload } from "../types/jwt-payload.type";
import { JwtPayloadWidthRefreshToken } from "../types/jwt-payload-refresh.type";
import { ForbiddenException } from "@nestjs/common";
import { Request } from 'express';
// import { Strategy } from "passport-local";


export const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
    if(req && req.cookies) {
        return req.cookies['refresh_token'];
    }

    return null
}


export class RefreshTokenCookieStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor() {
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.REFRESH_TOKEN_KEY!,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload): JwtPayloadWidthRefreshToken {
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken) {
            throw new ForbiddenException("Refresh token noto'g'ri");
        }

        return { ...payload, refreshToken};
    }
}