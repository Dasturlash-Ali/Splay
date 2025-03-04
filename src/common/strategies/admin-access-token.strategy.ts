import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { JwtAdminPayload } from "../types/admin-jwt-payload.type";

@Injectable()
export class AdminAccessTokenStrategy extends PassportStrategy(
    Strategy,
    "access-jwt"
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_KEY!,
        });
    }
    validate(payload: JwtAdminPayload): JwtAdminPayload {
        return payload;
    }
}
