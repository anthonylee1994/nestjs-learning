import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import jwtConfig from "../../config/jwt.config";
import {ConfigType} from "@nestjs/config";
import {Request} from "express";

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractRequestFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
            request.user = payload;
        } catch (e) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractRequestFromHeader(request: Request) {
        const [, token] = request.headers.authorization?.split(" ") ?? [];
        return token;
    }
}
