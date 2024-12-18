import {forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../../users/providers/users.service";
import {SignInDto} from "../dtos/sign-in.dto";
import {HashingProvider} from "./hashing.provider";
import {GenerateTokensProvider} from "./generate-tokens.provider";

@Injectable()
export class SignInProvider {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly hashingProvider: HashingProvider,
        private readonly generateTokensProvider: GenerateTokensProvider
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

        return await this.generateTokensProvider.generateTokens(user);
    }
}
