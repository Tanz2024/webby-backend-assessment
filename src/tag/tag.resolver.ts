import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { TagModel } from './tag.model';
import { CreateTagInput } from './create-tag.input';

@Resolver(() => TagModel)
export class TagResolver {
  constructor(private tagService: TagService) {}

  @Mutation(() => TagModel)
  async createTag(@Args('data') data: CreateTagInput): Promise<TagModel> {
    data.name = data.name.trim().toLowerCase();
    return this.tagService.createTag(data);
  }

  @Query(() => [TagModel])
  async allTags(
    @Args('order', { type: () => String, nullable: true, defaultValue: 'asc' })
    order?: 'asc' | 'desc',
  ): Promise<TagModel[]> {
    return this.tagService.getAllTags(order);
  }
}
