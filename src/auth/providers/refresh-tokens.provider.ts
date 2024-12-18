import {forwardRef, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {RefreshTokenDto} from "../dtos/refresh-token.dto";
import {JwtService} from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import {ConfigType} from "@nestjs/config";
import {UsersService} from "../../users/providers/users.service";
import {GenerateTokensProvider} from "./generate-tokens.provider";
import {ActiveUserData} from "../interfaces/active-user-data.interface";

@Injectable()
export class RefreshTokensProvider {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly generateTokensProvider: GenerateTokensProvider
    ) {}

    public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const {sub} = await this.jwtService.verifyAsync<Pick<ActiveUserData, "sub">>(refreshTokenDto.refreshToken, {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
            });
            // Fetch the user from the database
            const user = await this.usersService.findOneById(sub);

            // Generate the tokens
            return await this.generateTokensProvider.generateTokens(user);
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }
}
