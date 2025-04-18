import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserProfileModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  bio: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;
}
