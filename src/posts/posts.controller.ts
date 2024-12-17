import {Body, Controller, Get, Param, Patch, Post} from "@nestjs/common";
import {PostsService} from "./providers/posts.service";
import {CreatePostDto} from "./dtos/create-post.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {PatchPostDto} from "./dtos/patch-post-dto";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("/:userId?")
    public getPosts(@Param("userId") userId: string) {
        return this.postsService.findAll(userId);
    }

    @ApiOperation({summary: "Create a new blog post"})
    @ApiResponse({
        status: 201,
        description: "Post created successfully",
    })
    @Post()
    public createPost(@Body() createPostDto: CreatePostDto) {
        console.log(createPostDto);
    }

    @Patch()
    public updatePost(@Body() patchPostDto: PatchPostDto) {
        console.log(patchPostDto);
    }
}
