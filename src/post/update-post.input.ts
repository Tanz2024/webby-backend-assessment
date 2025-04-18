import { InputType, Field, ID } from '@nestjs/graphql';
import { Length, IsOptional, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdatePostInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(5, 100)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  content?: string;
}
