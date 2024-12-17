import {IsArray, IsEnum, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MinLength, ValidateNested} from "class-validator";
import {PostStatus} from "../enums/post-status.enum";
import {PostType} from "../enums/post-type.enum";
import {CreatePostMetaOptionsDto} from "./create-post-meta-options.dto";
import {Type} from "class-transformer";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({
        description: "The title of the post",
        example: "My First Post",
    })
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        enum: PostType,
        description: "Post type",
    })
    @IsEnum(PostType)
    @IsNotEmpty()
    postType: PostType;

    @ApiProperty({
        description: "Post slug",
        example: "new-with-nestjs",
    })
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {message: "Slug must be lowercase and can only contain alphanumeric characters and hyphens"})
    slug: string;

    @ApiProperty({
        enum: PostStatus,
        description: "Post status",
    })
    @IsEnum(PostStatus)
    @IsNotEmpty()
    status: PostStatus;

    @ApiPropertyOptional({
        description: "Post content",
        example: "This is the content of my first post",
    })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiPropertyOptional({
        description: "Post schema",
        example: '{"key": "value"}',
    })
    @IsJSON()
    @IsOptional()
    schema?: string;

    @ApiPropertyOptional({
        description: "Post featured image URL",
        example: "https://example.com/image.jpg",
    })
    @IsUrl()
    @IsOptional()
    featuredImageUrl?: string;

    @ApiPropertyOptional({
        description: "Post publish date",
        example: "2024-01-01T00:00:00.000Z",
    })
    @IsISO8601()
    @IsOptional()
    publishOn?: Date;

    @ApiPropertyOptional({
        description: "Post tags",
        example: ["nestjs", "typescript"],
    })
    @IsArray()
    @IsOptional()
    @IsString({each: true})
    @MinLength(3, {each: true})
    tags?: string[];

    @ApiPropertyOptional({
        type: "array",
        required: false,
        items: {
            type: "object",
            properties: {
                key: {type: "string"},
                value: {type: "any"},
            },
        },
        description: "Post meta options",
        example: '[{"key": "sidebarEnabled", "value": true}]',
    })
    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => CreatePostMetaOptionsDto)
    metaOptions?: CreatePostMetaOptionsDto[];
}
