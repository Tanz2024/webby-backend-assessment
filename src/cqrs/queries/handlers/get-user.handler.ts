import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { PrismaService } from '../../../prisma/prisma.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(query: GetUserQuery) {
    return this.prisma.user.findUnique({
      where: { id: query.userId },
      include: { profile: true },
    });
  }
}
