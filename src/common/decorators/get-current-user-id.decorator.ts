import { createParamDecorator, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { JwtPayload } from "../types/jwt-payload.type";


export const GetCurrentUserId = createParamDecorator(
    (_: undefined, context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;

        if(!user){
            throw new ForbiddenException("Token noto'g'ri");
        }
        return user.id;
    },
);