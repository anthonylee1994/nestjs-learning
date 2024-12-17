import {Injectable} from "@nestjs/common";
import {CreateTagDto} from "../dtos/create-tag.dto";
import {In, Repository} from "typeorm";
import {Tag} from "../tag.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>
    ) {}

    public async create(createTagDto: CreateTagDto): Promise<Tag> {
        const tag = this.tagRepository.create(createTagDto);
        return this.tagRepository.save(tag);
    }

    public async delete(id: number): Promise<void> {
        await this.tagRepository.delete(id);
    }

    public async findMultipleTags(ids: number[]): Promise<Tag[]> {
        return this.tagRepository.find({where: {id: In(ids)}});
    }
}
