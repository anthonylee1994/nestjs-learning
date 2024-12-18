import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {UsersService} from "../../users/providers/users.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Post} from "../post.entity";
import {Repository} from "typeorm";
import {TagsService} from "../../tags/providers/tags.service";
import {CreatePostDto} from "../dtos/create-post.dto";
import {ActiveUserData} from "../../auth/interfaces/active-user-data.interface";

@Injectable()
export class CreatePostProvider {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        private readonly tagsService: TagsService
    ) {}

    public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
        let author = undefined;
        let tags = undefined;

        try {
            // Find author from database based on authorId
            author = await this.usersService.findOneById(user.sub);
            // Find tags
            tags = await this.tagsService.findMultipleTags(createPostDto.tagIds);
        } catch (error) {
            throw new ConflictException(error);
        }

        if (createPostDto.tagIds.length !== tags.length) {
            throw new BadRequestException("Please check your tag Ids");
        }

        // Create post
        const post = this.postsRepository.create({
            ...createPostDto,
            author: author,
            tags: tags,
        });

        try {
            // return the post
            return await this.postsRepository.save(post);
        } catch (error) {
            throw new ConflictException(error, {
                description: "Ensure post slug is unique and not a duplicate",
            });
        }
    }
}
