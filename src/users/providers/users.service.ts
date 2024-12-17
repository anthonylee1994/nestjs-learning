import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {GetUsersParamDto} from "../dtos/get-users-param.dto";
import {AuthService} from "src/auth/providers/auth.service";

/**
 * Class that provides methods to interact with the users table
 */
@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}

    public findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
        const isAuth = this.authService.isAuth();
        console.log(isAuth);

        return [
            {
                firstName: "John",
                email: "john@example.com",
            },
            {
                firstName: "Jane",
                email: "jane@example.com",
            },
        ];
    }

    public findOneById(id: string) {
        return {
            id,
            firstName: "John",
            email: "john@example.com",
        };
    }
}
