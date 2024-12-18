import {HttpException, HttpStatus, Injectable, RequestTimeoutException} from "@nestjs/common";
import {GetUsersParamDto} from "../dtos/get-users-param.dto";
import {Repository} from "typeorm";
import {User} from "../user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto} from "../dtos/create-user.dto";
import {UsersCreateManyProvider} from "./users-create-many.provider";
import {CreateManyUsersDto} from "../dtos/create-many-users.dto";
import {CreateUserProvider} from "./create-user.provider";
import {FindOneUserByEmailProvider} from "./find-one-user-by-email.provider";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly usersCreateManyProvider: UsersCreateManyProvider,
        private readonly createUserProvider: CreateUserProvider,
        private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider
    ) {}

    public async createMany(createManyUsersDtos: CreateManyUsersDto): Promise<User[]> {
        return await this.usersCreateManyProvider.createMany(createManyUsersDtos);
    }

    public async create(createUserDto: CreateUserDto): Promise<User> {
        return await this.createUserProvider.create(createUserDto);
    }

    public findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
        throw new HttpException(
            {
                status: HttpStatus.MOVED_PERMANENTLY,
                error: `The API endpoint doesn't exist anymore`,
                fileName: "users.service.ts",
                lineNumber: 103,
            },
            HttpStatus.MOVED_PERMANENTLY
        );
    }

    public async findOneById(id: number) {
        try {
            return await this.userRepository.findOneBy({id});
        } catch (e) {
            throw new RequestTimeoutException();
        }
    }

    public async findOneByEmail(email: string): Promise<User> {
        return await this.findOneUserByEmailProvider.findOneByEmail(email);
    }
}
