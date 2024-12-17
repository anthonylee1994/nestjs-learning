import {PostType} from "./enums/post-type.enum";
import {PostStatus} from "./enums/post-status.enum";
import {Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {MetaOption} from "../meta-options/meta-option.entity";
import {User} from "../users/user.entity";
import {Tag} from "src/tags/tag.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 512,
        nullable: false,
    })
    title: string;

    @Column({
        type: "enum",
        enum: PostType,
        nullable: false,
        default: PostType.POST,
    })
    postType: PostType;

    @Column({
        type: "varchar",
        length: 256,
        nullable: false,
        unique: true,
    })
    slug: string;

    @Column({
        type: "enum",
        enum: PostStatus,
        nullable: false,
        default: PostStatus.DRAFT,
    })
    status: PostStatus;

    @Column({
        type: "text",
        nullable: true,
    })
    content?: string;

    @Column({
        type: "text",
        nullable: true,
    })
    schema?: string;

    @Column({
        type: "varchar",
        length: 1024,
        nullable: true,
    })
    featuredImageUrl?: string;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    publishOn?: Date;

    @OneToOne(() => MetaOption, metaOptions => metaOptions.post, {
        eager: true,
        cascade: true,
    })
    metaOptions?: MetaOption;

    @ManyToOne(() => User, user => user.posts, {
        eager: true,
        onDelete: "CASCADE",
    })
    author: User;

    @ManyToMany(() => Tag, tag => tag.posts, {
        eager: true,
        cascade: true,
    })
    tags?: Tag[];
}
