import {Body, Controller, forwardRef, HttpCode, HttpStatus, Inject, Post} from "@nestjs/common";
import {AuthService} from "./providers/auth.service";
import {SignInDto} from "./dtos/sign-in.dto";
import {UsersService} from "../users/providers/users.service";
import {Auth} from "./decorator/auth.decorator";
import {AuthType} from "./enums/auth-type.enum";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {}

    @Post("sign-in")
    @Auth(AuthType.None)
    @HttpCode(HttpStatus.OK)
    public async signIn(@Body() signInDto: SignInDto) {
        return await this.authService.signIn(signInDto);
    }
}
