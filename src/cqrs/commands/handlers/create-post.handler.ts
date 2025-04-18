import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../create-post.command';
import { PrismaService } from '../../../prisma/prisma.service';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private prisma: PrismaService) {}

  async execute(command: CreatePostCommand) {
    const { authorId, title, content, tagIds } = command;

    return this.prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        tags: true,
      },
    });
  }
}
