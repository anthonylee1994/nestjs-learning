import {Injectable} from "@nestjs/common";
import {GetUsersParamDto} from "../dtos/get-users-param.dto";
import {Repository} from "typeorm";
import {User} from "../user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto} from "../dtos/create-user.dto";

/**
 * Class that provides methods to interact with the users table
 */
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    public async create(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({where: {email: createUserDto.email}});
        let newUser = this.userRepository.create(createUserDto);
        newUser = await this.userRepository.save(newUser);
        return newUser;
    }

    public findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
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

    public async findOneById(id: number) {
        return await this.userRepository.findOneBy({id});
    }
}
