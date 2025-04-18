import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(160, { message: 'Bio must be 160 characters or less' })
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;
}