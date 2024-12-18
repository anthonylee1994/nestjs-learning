import {Injectable, RequestTimeoutException, UnauthorizedException} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "../user.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class FindOneUserByEmailProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    public async findOneByEmail(email: string): Promise<User> {
        let user: User | undefined = undefined;
        try {
            user = await this.usersRepository.findOneBy({email});
        } catch (e) {
            throw new RequestTimeoutException();
        }

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
