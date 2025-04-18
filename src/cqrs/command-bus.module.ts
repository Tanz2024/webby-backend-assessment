import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './commands/handlers/create-post.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';

@Module({
  imports: [CqrsModule],
  providers: [CreatePostHandler, GetUserHandler],
  exports: [],
})
export class CommandBusModule {}
