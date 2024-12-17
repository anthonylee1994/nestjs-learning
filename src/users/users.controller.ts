import {Controller, Get, Param, Post, Query, ParseIntPipe, DefaultValuePipe, Body, Patch} from "@nestjs/common";
import {CreateUserDto} from "./dtos/create-user.dto";
import {GetUsersParamDto} from "./dtos/get-users-param.dto";
import {PatchUserDto} from "./dtos/patch-user.dto";
import {UsersService} from "./providers/users.service";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":id?")
    public getUsers(
        @Param() getUsersParamDto: GetUsersParamDto,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number
    ) {
        return this.usersService.findAll(getUsersParamDto, limit, page);
    }

    @Post()
    public createUser(@Body() createUserDto: CreateUserDto): string {
        console.log(createUserDto);
        return "User created";
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto): string {
        console.log(patchUserDto);
        return "User patched";
    }
}
