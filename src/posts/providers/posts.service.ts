import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Post} from "../post.entity";
import {Repository} from "typeorm";
import {CreatePostDto} from "../dtos/create-post.dto";
import {UsersService} from "../../users/providers/users.service";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        private readonly usersService: UsersService
    ) {}

    public async findAll(): Promise<Post[]> {
        return await this.postsRepository.find();
    }

    public async create(createPostDto: CreatePostDto): Promise<Post> {
        const author = await this.usersService.findOneById(createPostDto.authorId);

        const post = this.postsRepository.create({
            ...createPostDto,
            author,
        });
        return await this.postsRepository.save(post);
    }

    public async delete(id: number): Promise<void> {
        const post = await this.postsRepository.findOne({where: {id}});
        await this.postsRepository.remove(post);
    }
}
