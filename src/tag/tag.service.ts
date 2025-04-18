import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagInput } from './create-tag.input';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async createTag(input: CreateTagInput) {
    const normalizedName = input.name.trim().toLowerCase();

    try {
      return await this.prisma.tag.create({
        data: { name: normalizedName },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        // Message used by GraphQL formatter to return cleaner error
        throw new ConflictException('Tag name must be unique');
      }

      throw error;
    }
  }

  async getAllTags(order: 'asc' | 'desc' = 'asc') {
    return this.prisma.tag.findMany({
      orderBy: { name: order },
    });
  }
}
