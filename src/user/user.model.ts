import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserProfileModel } from './user-profile.model';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => UserProfileModel, { nullable: true })
  profile?: UserProfileModel | null;
}
