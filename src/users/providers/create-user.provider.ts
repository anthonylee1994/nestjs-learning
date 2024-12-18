import {BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException} from "@nestjs/common";
import {CreateUserDto} from "../dtos/create-user.dto";
import {User} from "../user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HashingProvider} from "../../auth/providers/hashing.provider";

@Injectable()
export class CreateUserProvider {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ) {}

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

        let newUser = this.userRepository.create({
            ...createUserDto,
            password: await this.hashingProvider.hashPassword(createUserDto.password),
        });
        try {
            newUser = await this.userRepository.save(newUser);
        } catch (e) {
            throw new RequestTimeoutException();
        }
        return newUser;
    }
}
