import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength} from "class-validator";

export class CreateTagDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    @MaxLength(256)
    name: string;

    @ApiProperty({
        description: "For example: new-with-nestjs",
        example: "new-with-nestjs",
    })
    @IsString()
    @MinLength(4)
    @MaxLength(256)
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {message: "Slug must be lowercase and can only contain alphanumeric characters and hyphens"})
    slug: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsJSON()
    schema?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    @MaxLength(1024)
    featuredImageUrl?: string;
}
