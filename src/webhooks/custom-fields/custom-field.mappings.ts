import { Prisma } from '@prismaClient';

// Helper type to ensure our prismaField names are valid keys of Prisma inputs
type MappingInfo = {
  prismaField: keyof (Prisma.DealCreateInput &
    Prisma.PersonCreateInput &
    Prisma.OrganizationCreateInput);
  pipedriveType: string;
};

export type CustomFieldMappingType = Record<string, MappingInfo>;
export type EntityType = 'deal' | 'person' | 'organization';

export const dealFieldMappings: CustomFieldMappingType = {
  '00c27645ca220b30c64ced9c3398ea83942851f6': {
    prismaField: 'tipos_de_processos',
    pipedriveType: 'enum',
  },
  '96dcd4a2a2123a074c7c7d141fd17d00fd62fe8e': {
    prismaField: 'link_proposta',
    pipedriveType: 'varchar',
  },
  '2046bb1cb61a34cff93eac97965dfe0077eee017': {
    prismaField: 'link_pre_busca_it',
    pipedriveType: 'varchar',
  },
  b98c22b6466e08e95eb621a588c8ef4a198bcabe: {
    prismaField: 'resultado_pre_busca',
    pipedriveType: 'enum',
  },
  f4d367d9bc16187215377eff69acf3e9334124af: {
    prismaField: 'link_pre_busca_br',
    pipedriveType: 'varchar',
  },
  d4b275856e681ca3892799cff08254def06b12db: {
    prismaField: 'link_guru',
    pipedriveType: 'varchar',
  },
  a66092badb6b87c18c65487719a8a5d464455d9d: {
    prismaField: 'type_parente_portugues',
    pipedriveType: 'enum',
  },
  '8b6bb81b6241ed46eba3d3dd138326a2d2a9618c': {
    prismaField: 'type_docs_portugues',
    pipedriveType: 'enum',
  },
  '106ebca3a9643cfbf0abd8f2071fda0116bd5b11': {
    prismaField: 'type_outros_familiares',
    pipedriveType: 'enum',
  },
  '6af323a3c60ba6a4d0709d65ee9b0830c319ee78': {
    prismaField: 'type_visitou_portugal',
    pipedriveType: 'enum',
  },
  '0b4cbe2f290ed20958f8755288343c4b8340b0fe': {
    prismaField: 'type_objetivo',
    pipedriveType: 'enum',
  },
  f033b1803d77f942fb44d928e21be2fe885ee7d0: {
    prismaField: 'loja_sdr',
    pipedriveType: 'varchar',
  },
  '3f02bbd18f37f216687b2007f1e6254d4bfe1a92': {
    prismaField: 'loja_inside',
    pipedriveType: 'varchar',
  },
  '14991a9aa74392fed21b5420c9bc743cf10c909c': {
    prismaField: 'sdr_passagem_sdr',
    pipedriveType: 'enum',
  },
  c642efe3eca46528668f2d4f97986a2bed23b88d: {
    prismaField: 'sdr_data_passagem',
    pipedriveType: 'date',
  },
  '2ccf1731fb6091da7023341b7d53d304d4f02780': {
    prismaField: 'sdr_quem_passou_id',
    pipedriveType: 'user',
  },
  d0f3c33d7735b19a1b0047ad7a65672d01479a83: {
    prismaField: 'sdr_original_id',
    pipedriveType: 'user',
  },
  '5d076eabe09fb6acf53066983aef5f4635656cf7': {
    prismaField: 'tipo_de_venda',
    pipedriveType: 'enum',
  },
  ca1c3665fe34cbe3bfba2f495c5b2909015ce2dd: {
    prismaField: 'data_retorno',
    pipedriveType: 'date',
  },
  '5aa0a96b68114ccc0fa96b51bb5bf35437ecb295': {
    prismaField: 'valor_total_processo_automacao',
    pipedriveType: 'varchar',
  },
  '0225c93e607f9cfe3dc9881e99436287191b213d': {
    prismaField: 'forma_pagamento_automacao',
    pipedriveType: 'text',
  },
  '13f4288b53d43763147706ece90225b98f8b6b3b': {
    prismaField: 'processos_fechados_automacao',
    pipedriveType: 'text',
  },
  f1dc44ba9745dc20638cba49cb20fd5dbb993a60: {
    prismaField: 'infos_pt_automacao',
    pipedriveType: 'text',
  },
  '7f57afe5ac32d7c6e52636c84ebc6d670e256051': {
    prismaField: 'tipo_certidao_pt_automacao',
    pipedriveType: 'varchar',
  },
  c0efad0e6e314baa3c479a25c5fd6ed9a614af30: {
    prismaField: 'versao_precificacao_automacao',
    pipedriveType: 'varchar',
  },
  e6f26faad4b12ca071d67b122ed8e5f9ef1109fa: {
    prismaField: 'indicacao',
    pipedriveType: 'varchar',
  },
  '1a824b7605bf2984745f58617383dceabc712e87': {
    prismaField: 'certidao_portugues',
    pipedriveType: 'varchar',
  },
  '66807f6c7a2b0dc25d2f769384de452821c58156': {
    prismaField: 'cf_nome',
    pipedriveType: 'varchar',
  },
  '85f949ec25d99f37d095f691812096d62b7a9929': {
    prismaField: 'cf_telefone',
    pipedriveType: 'varchar',
  },
  '0ad921abd2779eb18b3aa47b8f29408276f73370': {
    prismaField: 'numero_assento',
    pipedriveType: 'varchar',
  },
  e4c23208d8a1eba993b00b77d131d1c7609f26bd: {
    prismaField: 'numero_processo_portugal',
    pipedriveType: 'varchar',
  },
  '9256b516f1583c10b1625e41228bcd94f1d157e9': {
    prismaField: 'sao_menores_idade',
    pipedriveType: 'varchar',
  },
  '5a15fb2208adf252664c3dc72632e8113fbfad40': {
    prismaField: 'nome_completo_portugues',
    pipedriveType: 'varchar',
  },
  f2765ceda9929095f7d7e3d0a8eef32906af99c2: {
    prismaField: 'nome_completo_mae_portugues',
    pipedriveType: 'varchar',
  },
  '42dfff63a66f206dc1255ae1ed0249bf0d890278': {
    prismaField: 'nome_completo_pai_portugues',
    pipedriveType: 'varchar',
  },
  '1b48577c581834856de6f6e8cd83d76a8f0c9a99': {
    prismaField: 'concelho_nascimento_portuga',
    pipedriveType: 'varchar',
  },
  '79087f5020e4ef4ab75115296edc4eabf1eb6ea7': {
    prismaField: 'numero_rastreamento',
    pipedriveType: 'varchar',
  },
  '447a7b6e9d0ac22522d62b422fc0f70a606c1b2e': {
    prismaField: 'valor_certidao',
    pipedriveType: 'varchar',
  },
  '50b301604dafef2da77e340f07b4bce511819c4b': {
    prismaField: 'nome_completo_contratante',
    pipedriveType: 'varchar',
  },
  fc11c663e3cae0418b548be6c33b9e44ce73f052: {
    prismaField: 'cpf_contratante',
    pipedriveType: 'varchar',
  },
  '289cdb6ae555549c335454a2d9ea919cadeaa7b1': {
    prismaField: 'rg_contratante',
    pipedriveType: 'varchar',
  },
  a6531fd1c6484ac66e98354baf5d0c4719945551: {
    prismaField: 'orgao_emissor_rg_contratante',
    pipedriveType: 'varchar',
  },
  '074c56cf475f329eadb8db2fb0fbaa9100f3056d': {
    prismaField: 'data_emissao_rg_contratante',
    pipedriveType: 'varchar',
  },
  '9fc26717dbbb55cd9d47fa471e592d042ec30c93': {
    prismaField: 'cep_contratante',
    pipedriveType: 'varchar',
  },
  '273f3f48de3160b20c2d065caf002ad9bce7f41b': {
    prismaField: 'endereco_contratante',
    pipedriveType: 'varchar',
  },
  '2e1b4dc94298d6f37a09b3b4fddea88210cbad0a': {
    prismaField: 'assento_ascendente_portuga',
    pipedriveType: 'varchar',
  },
  '947d79b0f97b623b6bde9584004353c662839b95': {
    prismaField: 'possui_plano_familia',
    pipedriveType: 'varchar',
  },
  '04e00dfec75a8c52b8bf9cec8542495f253882e6': {
    prismaField: 'codigo_produto',
    pipedriveType: 'text',
  },
  '723f48022e7f8244a13f218a29e25439b656afec': {
    prismaField: 'docs_emission',
    pipedriveType: 'varchar',
  },
  db7c09528b0af347c35abb38841beea34e0f98af: {
    prismaField: 'processos_fechados_mika_automacao',
    pipedriveType: 'text',
  },
  '48c263738d7a844d9322a63fff2bffeb7427b1a0': {
    prismaField: 'docs_anexados_produto',
    pipedriveType: 'text',
  },
  '4f00f38d610922a8f819be52547a76ff3857f2af': {
    prismaField: 'parente_italiano',
    pipedriveType: 'enum',
  },
  dd6227ae2eaffd46fda68845dad5f0604bd0b664: {
    prismaField: 'local_nascimento_italiano',
    pipedriveType: 'enum',
  },
  '7737de3d4c4467f2aab42a19642dac3441486c83': {
    prismaField: 'compromisso_inicial',
    pipedriveType: 'enum',
  },
  eabe0d80fc60ddfce6057b6d11552055f4a896f5: {
    prismaField: 'vendedor_original',
    pipedriveType: 'varchar',
  },
  '443a3c4b7de2031d34fff1b739f8b85ffd1dce51': {
    prismaField: 'docs_italiano',
    pipedriveType: 'enum',
  },
  '9d2fe61da1a56b6451398195297581386593714c': {
    prismaField: 'data_recebido',
    pipedriveType: 'date',
  },
  f66bf97255433c72fb4841918079408ab70f058f: {
    prismaField: 'historico_proprietario',
    pipedriveType: 'text',
  },
  cf4c6ac903141a61de4d50c811952fdda72f6b06: {
    prismaField: 'status_negocio_andamento',
    pipedriveType: 'enum',
  },
  '8a8199a552c16f60bad07b295fc6d14d270899ec': {
    prismaField: 'sdr_passagem_resposta',
    pipedriveType: 'enum',
  },
  b6256c2b4b8f0de04a006a8210627169756aadbe: {
    prismaField: 'it_chatbot',
    pipedriveType: 'varchar',
  },
  '0606a7728b4c4f86161fa2702f2f8643a2745242': {
    prismaField: 'it_teste_chatbot',
    pipedriveType: 'varchar',
  },
  '9b0254d7aef2e07d60b47645816c7554be6df94b': {
    prismaField: 'gclid',
    pipedriveType: 'text',
  },
  '5604f7961dc547cea36ee43aff9f110288b939c6': {
    prismaField: 'sdr_intermediario_id',
    pipedriveType: 'user',
  },
  '6994cecac7cdfa8d621fc2d234fc16d9d731a6b5': {
    prismaField: 'it_chatbot_modelo_msg_inicial',
    pipedriveType: 'varchar',
  },
  a0fe3ab944abd97531bef59d72a0b4a4f61a90f5: {
    prismaField: 'status_reuniao_chatbot',
    pipedriveType: 'enum',
  },
  '0d0a601c7f5b749a3912725ea9efcf46c0795761': {
    prismaField: 'criador_shopping_id',
    pipedriveType: 'user',
  },
  a0cb6f53975e51c6664f13ab5a85cb7a97b5f2d8: {
    prismaField: 'resultado_roleta',
    pipedriveType: 'varchar',
  },
  a48c31b5085ba5553ea2b7f3dafdb13c2175362d: {
    prismaField: 'resultado_roleta_manual',
    pipedriveType: 'enum',
  },
  '3990246de9f44cb1ee2871160ad1fb36f972414b': {
    prismaField: 'data_alocacao',
    pipedriveType: 'date',
  },
  fccc74ecd1c247f0ecd738e01095fe0176ea17d5: {
    prismaField: 'inside_data_pego',
    pipedriveType: 'date',
  },
  aba12510e37d9539a75df01e4b848ab774f538ed: {
    prismaField: 'rmkt_renan',
    pipedriveType: 'varchar',
  },
};

export const personFieldMappings: CustomFieldMappingType = {
  '11899fe33f11eeb1c0910c955a75fab00a5eb536': {
    prismaField: 'is_returning',
    pipedriveType: 'varchar',
  },
  '5875c94fcbf479ad6944419a72d15b6792293847': {
    prismaField: 'origem',
    pipedriveType: 'varchar',
  },
  notes: { prismaField: 'notes', pipedriveType: 'text' },
  '1b22f3bbf94ee509da6a53dab6edf1996981a91b': {
    prismaField: 'link_guru',
    pipedriveType: 'varchar',
  },
  '7446ad07756023c3fa623c13344118974ddf4279': {
    prismaField: 'id_huggy',
    pipedriveType: 'varchar',
  },
  f182f998c5057b34f72fdc5c4adc4ff4dc1b81b0: {
    prismaField: 'agente_familia_responsavel',
    pipedriveType: 'set',
  },
  '5e2ec3fc21b520dc0a6dd21babba3cbcb8222d06': {
    prismaField: 'transcricao_de_casamento',
    pipedriveType: 'varchar',
  },
  '96b09daabe77cd8b55d3cbabd9d902b900aea3ab': {
    prismaField: 'motivo_de_entrada_na_loja',
    pipedriveType: 'set',
  },
  '083da88b57017b14c25ce49db6ebf6cff4838b8c': {
    prismaField: 'numero_de_assento',
    pipedriveType: 'varchar',
  },
  '71a481520961ecf730b051231f8f4f6549b441ec': {
    prismaField: 'infos_alinhamento',
    pipedriveType: 'text',
  },
  job_title: { prismaField: 'job_title', pipedriveType: 'varchar' },
  '875b67715607c1b4fdc9fc3da303b6e1f5ef3b4b': {
    prismaField: 'campo_indicacao',
    pipedriveType: 'varchar',
  },
  '2bdb625695c1c9cf384fe617bcb762dd6bed8430': {
    prismaField: 'id_buzzlead',
    pipedriveType: 'varchar',
  },
  '6b3ea8ec21a63d37e4100637c7caa8652d3d49ba': {
    prismaField: 'form_de_atualizacao_embaixador',
    pipedriveType: 'varchar',
  },
  f94d2285ad4b507ab75c4677f6ffe84f65826ca4: {
    prismaField: 'publico',
    pipedriveType: 'enum',
  },
};

export const organizationFieldMappings: CustomFieldMappingType = {
  '24a7dc93f166a0b32d0f9d8a8c97b75ab316b7a5': {
    prismaField: 'pt_status',
    pipedriveType: 'varchar',
  },
  b564701815de30dc3b1bd175dfa3fd1953bbe834: {
    prismaField: 'pt_tipo_de_processo',
    pipedriveType: 'varchar',
  },
  '9aeb273879deff7c320c463a0f89a0830fa2d91d': {
    prismaField: 'pt_requerente',
    pipedriveType: 'varchar',
  },
  ceeab9fbabcdb8482500cc527a1a10dbddf1349d: {
    prismaField: 'pt_local_de_envio',
    pipedriveType: 'varchar',
  },
  '87eece434f1a3ef06004d89c024d5024d990c0a4': {
    prismaField: 'pt_dia_do_envio',
    pipedriveType: 'date',
  },
  d7f10d5bfb0dfe07b7c6265d3a5f2cc30b946331: {
    prismaField: 'pt_senha',
    pipedriveType: 'varchar',
  },
  be9a4c24235319010196b9daf5fc916ddb0eef7f: {
    prismaField: 'pt_data_da_trava',
    pipedriveType: 'date',
  },
  '0c95a278d80dc679b057d24d1fba48c647c40f80': {
    prismaField: 'pt_link_sobre_trava',
    pipedriveType: 'varchar',
  },
  '99905914a61afc3555bbdaf5d2272ad4a7a5500a': {
    prismaField: 'it_dashboard_do_cliente',
    pipedriveType: 'varchar',
  },
  '6d255f2790a135c810d5604082776f836fa4d843': {
    prismaField: 'pt_status_portugues',
    pipedriveType: 'enum',
  },
  dc598be29ce761ea8336a6836b559a89daabbd7c: {
    prismaField: 'pt_acesso_a_central',
    pipedriveType: 'enum',
  },
  dad832746facd158da83a1b7f6ab486610873f4f: {
    prismaField: 'pt_atr_em_andamento',
    pipedriveType: 'varchar',
  },
  '102422eb33fd58a5da39d89a17c009c0cb51024d': {
    prismaField: 'pt_tag_sensibilidade',
    pipedriveType: 'enum',
  },
};
