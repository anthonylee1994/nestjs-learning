import {Body, Controller, Delete, Param, ParseIntPipe, Post} from "@nestjs/common";
import {CreateTagDto} from "./dtos/create-tag.dto";
import {TagsService} from "./providers/tags.service";

@Controller("tags")
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    public async create(@Body() createTagDto: CreateTagDto) {
        return await this.tagsService.create(createTagDto);
    }

    @Delete(":id")
    public async delete(@Param("id", ParseIntPipe) id: number) {
        return await this.tagsService.delete(id);
    }
}
