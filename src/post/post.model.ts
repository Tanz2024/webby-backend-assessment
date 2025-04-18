import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TagModel } from '../tag/tag.model';

@ObjectType('PostModel')
export class PostModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => [TagModel], { nullable: true }) // ✅ fixed: make tags optional
  tags?: TagModel[] | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
