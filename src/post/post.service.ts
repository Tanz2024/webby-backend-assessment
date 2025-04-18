import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostInput } from './create-post.input';
import { UpdatePostInput } from './update-post.input';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: string, input: CreatePostInput) {
    const { title, content, tagIds } = input;
  
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
  
    // ✅ Check if all tagIds exist
    const existingTags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true },
    });
  
    const foundIds = existingTags.map(t => t.id);
    const missingTagIds = tagIds.filter(id => !foundIds.includes(id));
  
    if (missingTagIds.length > 0) {
      throw new NotFoundException(`Tag not found: ${missingTagIds.join(', ')}`);
    }
  
    return this.prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
        postTags: {
          create: tagIds.map(tagId => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        postTags: { include: { tag: true } },
      },
    });
  }
  

  async updatePost(userId: string, input: UpdatePostInput) {
    const post = await this.prisma.post.findUnique({
      where: { id: input.id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own post');
    }

    return this.prisma.post.update({
      where: { id: input.id },
      data: {
        title: input.title,
        content: input.content,
      },
    });
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You cannot delete a post that does not belong to you');
    }

    await this.prisma.postTag.deleteMany({ where: { postId } });

    return this.prisma.post.delete({ where: { id: postId } });
  }

  async getMyPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    });
  }
}
