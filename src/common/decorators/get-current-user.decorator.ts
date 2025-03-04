import { createParamDecorator, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { JwtPayloadWidthRefreshToken } from "../types/jwt-payload-refresh.type";
import { JwtPayload } from "../types/jwt-payload.type";

export const GetCurrentUser = createParamDecorator(
    (data: keyof JwtPayloadWidthRefreshToken, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;

        if(!user){
            throw new ForbiddenException("Token noto'g'ri");
        }
        if(!data){
            return user;
        }

        return user[data];
    },
);