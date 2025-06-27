export interface IMapper<InputDto, CreateInput, UpdateInput> {
  toCreateInput(dto: InputDto): CreateInput | Promise<CreateInput>;
  toUpdateInput(dto: InputDto): UpdateInput | Promise<UpdateInput>;
}
