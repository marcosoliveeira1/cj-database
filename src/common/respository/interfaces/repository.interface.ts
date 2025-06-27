export interface IRepository<Entity, WhereInput, CreateInput, UpdateInput> {
  upsert(
    where: WhereInput,
    create: CreateInput,
    update: UpdateInput,
  ): Promise<Entity | null>;
  findById(id: number): Promise<Entity | null>;
  createPlaceholder({ id }: { id: number }): Promise<Entity | null>;
}
