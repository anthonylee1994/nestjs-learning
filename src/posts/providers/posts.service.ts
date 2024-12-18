import {BadRequestException, Injectable, RequestTimeoutException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Post} from "../post.entity";
import {Repository} from "typeorm";
import {CreatePostDto} from "../dtos/create-post.dto";
import {UsersService} from "../../users/providers/users.service";
import {TagsService} from "src/tags/providers/tags.service";
import {PatchPostDto} from "../dtos/patch-post-dto";
import {Tag} from "../../tags/tag.entity";
import {GetPostsDto} from "../dtos/get-posts.dto";
import {PaginationProvider} from "../../common/pagination/providers/pagination.provider";
import {Paginated} from "../../common/pagination/interfaces/paginated.interface";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        private readonly usersService: UsersService,
        private readonly tagsService: TagsService,
        private readonly paginationProvider: PaginationProvider
    ) {}

    public async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
        return await this.paginationProvider.paginateQuery(
            {
                limit: postQuery.limit,
                page: postQuery.page,
            },
            this.postsRepository
        );
    }

    public async create(createPostDto: CreatePostDto): Promise<Post> {
        const author = await this.usersService.findOneById(createPostDto.authorId);
        const tags = await this.tagsService.findMultipleTags(createPostDto.tagIds);

        const post = this.postsRepository.create({
            ...createPostDto,
            author,
            tags,
        });
        return await this.postsRepository.save(post);
    }

    public async update(patchPostDto: PatchPostDto): Promise<Post> {
        let tags: Tag[] = undefined;
        let post: Post = undefined;

        try {
            tags = await this.tagsService.findMultipleTags(patchPostDto.tagIds);
        } catch (e) {
            throw new RequestTimeoutException();
        }

        if (!tags || tags.length !== patchPostDto.tagIds.length) {
            throw new BadRequestException("One or more tags not found");
        }

        try {
            post = await this.postsRepository.findOne({where: {id: patchPostDto.id}});
        } catch (e) {
            throw new RequestTimeoutException();
        }

        if (!post) {
            throw new BadRequestException("Post not found");
        }

        post.title = patchPostDto.title ?? post.title;
        post.content = patchPostDto.content ?? post.content;
        post.status = patchPostDto.status ?? post.status;
        post.postType = patchPostDto.postType ?? post.postType;
        post.slug = patchPostDto.slug ?? post.slug;
        post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
        post.publishOn = patchPostDto.publishOn ?? post.publishOn;

        post.tags = tags;

        try {
            return await this.postsRepository.save(post);
        } catch (e) {
            throw new RequestTimeoutException();
        }
    }

    public async delete(id: number): Promise<void> {
        await this.postsRepository.delete(id);
    }
}
