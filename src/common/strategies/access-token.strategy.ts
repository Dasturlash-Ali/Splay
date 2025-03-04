import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types/jwt-payload.type";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    'access-jwt',
){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_KEY!,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload): JwtPayload {
        console.log("request", req);
        console.log("payload", payload);
        return payload;
    }
}