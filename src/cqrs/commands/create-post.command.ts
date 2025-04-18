export class CreatePostCommand {
  constructor(
    public readonly authorId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly tagIds: string[],
  ) {}
}
