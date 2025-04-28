export interface IMapper<InputDto, CreateInput, UpdateInput> {
  toCreateInput(dto: InputDto): CreateInput;
  toUpdateInput(dto: InputDto): UpdateInput;
}
