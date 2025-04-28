export interface IRepository<Entity, WhereInput, CreateInput, UpdateInput> {
  upsert(
    where: WhereInput,
    create: CreateInput,
    update: UpdateInput,
  ): Promise<Entity | null>;
}
