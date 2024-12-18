import {ConflictException, forwardRef, Inject, Injectable, RequestTimeoutException} from "@nestjs/common";
import {User} from "../user.entity";
import {DataSource} from "typeorm";
import {CreateManyUsersDto} from "../dtos/create-many-users.dto";
import {HashingProvider} from "../../auth/providers/hashing.provider";

@Injectable()
export class UsersCreateManyProvider {
    constructor(
        private readonly dataSource: DataSource,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ) {}

    public async createMany(createManyUsersDto: CreateManyUsersDto): Promise<User[]> {
        const newUsers: User[] = [];
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
        } catch (e) {
            throw new RequestTimeoutException();
        }

        try {
            for (const user of createManyUsersDto.users) {
                const newUser = queryRunner.manager.create(User, {
                    ...user,
                    password: await this.hashingProvider.hashPassword(user.password),
                });
                const result = await queryRunner.manager.save(newUser);
                newUsers.push(result);
            }
            await queryRunner.commitTransaction();
        } catch (e) {
            console.log(e);
            await queryRunner.rollbackTransaction();
            throw new ConflictException("Could not complete the transaction", {
                description: String(e),
            });
        } finally {
            try {
                await queryRunner.release();
            } catch (e) {
                throw new RequestTimeoutException("Could not release the transaction");
            }
        }

        return newUsers;
    }
}
