import {IsArray, IsEnum, IsInt, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength, ValidateNested} from "class-validator";
import {PostStatus} from "../enums/post-status.enum";
import {PostType} from "../enums/post-type.enum";
import {CreatePostMetaOptionsDto} from "../../meta-options/dtos/create-post-meta-options.dto";
import {Type} from "class-transformer";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({
        description: "The title of the post",
        example: "My First Post",
    })
    @IsString()
    @MinLength(4)
    @MaxLength(512)
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
    @MaxLength(256)
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
    @MaxLength(1024)
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
        example: [1, 2],
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    tags?: number[];

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => CreatePostMetaOptionsDto)
    metaOptions?: CreatePostMetaOptionsDto | null;

    @ApiProperty({
        type: "integer",
        required: true,
        description: "The ID of the author",
        example: 1,
    })
    @IsNotEmpty()
    @IsInt()
    authorId: number;
}
