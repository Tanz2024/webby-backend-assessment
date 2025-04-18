// src/user/models/change-password-response.model.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ChangePasswordResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
