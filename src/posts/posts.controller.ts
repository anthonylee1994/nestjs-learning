import {Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseInterceptors} from "@nestjs/common";
import {PostsService} from "./providers/posts.service";
import {CreatePostDto} from "./dtos/create-post.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {PatchPostDto} from "./dtos/patch-post-dto";
import {GetPostsDto} from "./dtos/get-posts.dto";
import {ActiveUser} from "../auth/decorator/active-user.decorator";
import {ActiveUserData} from "../auth/interfaces/active-user-data.interface";

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
    @UseInterceptors(ClassSerializerInterceptor)
    public create(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
        return this.postsService.create(createPostDto, user);
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
