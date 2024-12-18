import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from "@nestjs/common";
import {PostsService} from "./providers/posts.service";
import {CreatePostDto} from "./dtos/create-post.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {PatchPostDto} from "./dtos/patch-post-dto";
import {GetPostsDto} from "./dtos/get-posts.dto";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    public findAll(@Query() postQuery: GetPostsDto) {
        return this.postsService.findAll(postQuery);
    }

    @ApiOperation({summary: "Create a new blog post"})
    @ApiResponse({
        status: 201,
        description: "Post created successfully",
    })
    @Post()
    public create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @Patch()
    public update(@Body() patchPostDto: PatchPostDto) {
        return this.postsService.update(patchPostDto);
    }

    @Delete(":id")
    public delete(@Param("id", ParseIntPipe) id: number) {
        return this.postsService.delete(id);
    }
}
