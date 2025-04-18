import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { PostModel } from './post.model';
import { CreatePostInput } from './create-post.input';
import { UpdatePostInput } from './update-post.input';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => PostModel)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  // Create a post (requires login)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostModel)
  async createPost(
    @CurrentUser() user: { id: string },
    @Args('data') input: CreatePostInput,
  ): Promise<PostModel> {
    const post = await this.postService.createPost(user.id, input);
    return {
      ...post,
      tags: post.postTags?.map(pt => pt.tag) ?? [],
    };
  }

  // Update a post (requires login)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostModel)
  async updatePost(
    @CurrentUser() user: { id: string },
    @Args('data') input: UpdatePostInput,
  ): Promise<PostModel> {
    const updated = await this.postService.updatePost(user.id, input);
    return {
      ...updated,
      tags: [], // Optional: fetch tags if needed
    };
  }

  // Delete a post (requires login)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostModel, { nullable: true })
  async deletePost(
    @CurrentUser() user: { id: string },
    @Args('postId') postId: string,
  ): Promise<PostModel | null> {
    const deleted = await this.postService.deletePost(user.id, postId);
    return deleted ? { ...deleted, tags: [] } : null;
  }

  // Get posts created by logged-in user
  @UseGuards(JwtAuthGuard)
  @Query(() => [PostModel])
  async getMyPosts(
    @CurrentUser() user: { id: string },
  ): Promise<PostModel[]> {
    const posts = await this.postService.getMyPosts(user.id);
    return posts.map(post => ({
      ...post,
      tags: post.postTags?.map(pt => pt.tag) ?? [],
    }));
  }

  // Get all posts (public)
  @Query(() => [PostModel])
  async allPosts(): Promise<PostModel[]> {
    const posts = await this.postService.getAllPosts();
    return posts.map(post => ({
      ...post,
      tags: post.postTags?.map(pt => pt.tag) ?? [],
    }));
  }
}
