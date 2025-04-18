import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PostTagsModel {
  @Field()
  postId: string;

  @Field()
  tagId: string;
}
