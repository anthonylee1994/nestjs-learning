import {BadRequestException, HttpException, HttpStatus, Injectable, RequestTimeoutException} from "@nestjs/common";
import {GetUsersParamDto} from "../dtos/get-users-param.dto";
import {Repository} from "typeorm";
import {User} from "../user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto} from "../dtos/create-user.dto";
import {UsersCreateManyProvider} from "./users-create-many.provider";
import {CreateManyUsersDto} from "../dtos/create-many-users.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly usersCreateManyProvider: UsersCreateManyProvider
    ) {}

    public async createMany(createManyUsersDtos: CreateManyUsersDto): Promise<User[]> {
        return await this.usersCreateManyProvider.createMany(createManyUsersDtos);
    }

    public async create(createUserDto: CreateUserDto): Promise<User> {
        let existingUser = undefined;
        try {
            existingUser = await this.userRepository.findOne({where: {email: createUserDto.email}});
        } catch (e) {
            throw new RequestTimeoutException();
        }

        if (existingUser) {
            throw new BadRequestException("A user with that email already exists.");
        }

        let newUser = this.userRepository.create(createUserDto);
        try {
            newUser = await this.userRepository.save(newUser);
        } catch (e) {
            throw new RequestTimeoutException();
        }
        return newUser;
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
}
