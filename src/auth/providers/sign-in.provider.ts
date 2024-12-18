import {forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../../users/providers/users.service";
import {SignInDto} from "../dtos/sign-in.dto";
import {HashingProvider} from "./hashing.provider";
import {JwtService} from "@nestjs/jwt";
import {ConfigType} from "@nestjs/config";
import jwtConfig from "../config/jwt.config";

@Injectable()
export class SignInProvider {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly hashingProvider: HashingProvider,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {}

    public async signIn(signInDto: SignInDto) {
        const user = await this.usersService.findOneByEmail(signInDto.email);
        let isEqual = false;

        try {
            isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password);
        } catch (e) {
            throw new RequestTimeoutException();
        }

        if (!isEqual) {
            throw new UnauthorizedException();
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.accessTokenTtl,
            }
        );

        return {
            accessToken,
        };
    }
}
