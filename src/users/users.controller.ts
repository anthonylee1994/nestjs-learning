import {Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors} from "@nestjs/common";
import {CreateUserDto} from "./dtos/create-user.dto";
import {GetUsersParamDto} from "./dtos/get-users-param.dto";
import {PatchUserDto} from "./dtos/patch-user.dto";
import {UsersService} from "./providers/users.service";
import {ApiOperation, ApiQuery, ApiResponse} from "@nestjs/swagger";
import {CreateManyUsersDto} from "./dtos/create-many-users.dto";
import {AccessTokenGuard} from "../auth/guards/access-token/access-token.guard";
import {Auth} from "../auth/decorator/auth.decorator";
import {AuthType} from "../auth/enums/auth-type.enum";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":id?")
    @ApiOperation({summary: "Get users"})
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Limit the number of users to return",
        example: 10,
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
        description: "Page number",
        example: 1,
    })
    @ApiResponse({
        status: 200,
        description: "Users fetched successfully",
    })
    public getUsers(
        @Param() getUsersParamDto: GetUsersParamDto,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number
    ) {
        return this.usersService.findAll(getUsersParamDto, limit, page);
    }

    @Post()
    @Auth(AuthType.None)
    @UseInterceptors(ClassSerializerInterceptor)
    public signUp(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(AccessTokenGuard)
    @Post("create-many")
    public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
        return this.usersService.createMany(createManyUsersDto);
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto): string {
        console.log(patchUserDto);
        return "User patched";
    }
}
