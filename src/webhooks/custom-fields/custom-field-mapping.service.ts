import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

type FieldMapInfo = { prismaField: string; type: string };
type EntityMapping = Record<string, FieldMapInfo>;

@Injectable()
export class CustomFieldMappingService implements OnModuleInit {
  private readonly logger = new Logger(CustomFieldMappingService.name);
  private personFieldMapping: EntityMapping = {};
  private orgFieldMapping: EntityMapping = {};
  private dealFieldMapping: EntityMapping = {};

  constructor() {}

  onModuleInit() {
    this.loadStaticMappings();
    this.logger.log('Custom field mappings loaded.');
  }

  private loadStaticMappings() {
    this.personFieldMapping = {
      birthday: { prismaField: 'birthday', type: 'date' },
      postal_address: { prismaField: 'postal_address', type: 'address' },
      '11899fe33f11eeb1c0910c955a75fab00a5eb536': {
        prismaField: 'is_returning',
        type: 'varchar',
      },
      '5875c94fcbf479ad6944419a72d15b6792293847': {
        prismaField: 'origem',
        type: 'varchar',
      },
      notes: { prismaField: 'notes', type: 'text' },
      im: { prismaField: 'im', type: 'varchar' },
      '1b22f3bbf94ee509da6a53dab6edf1996981a91b': {
        prismaField: 'link_guru',
        type: 'varchar',
      },
      '7446ad07756023c3fa623c13344118974ddf4279': {
        prismaField: 'id_huggy',
        type: 'varchar',
      },
      f182f998c5057b34f72fdc5c4adc4ff4dc1b81b0: {
        prismaField: 'agente_familia_responsavel',
        type: 'set',
      },
      '5e2ec3fc21b520dc0a6dd21babba3cbcb8222d06': {
        prismaField: 'transcricao_de_casamento',
        type: 'varchar',
      },
      '96b09daabe77cd8b55d3cbabd9d902b900aea3ab': {
        prismaField: 'motivo_de_entrada_na_loja',
        type: 'set',
      },
      '083da88b57017b14c25ce49db6ebf6cff4838b8c': {
        prismaField: 'numero_de_assento',
        type: 'varchar',
      },
      '71a481520961ecf730b051231f8f4f6549b441ec': {
        prismaField: 'infos_alinhamento',
        type: 'text',
      },
      job_title: { prismaField: 'job_title', type: 'varchar' },
    };

    this.orgFieldMapping = {
      address: { prismaField: 'address', type: 'address' },
      '24a7dc93f166a0b32d0f9d8a8c97b75ab316b7a5': {
        prismaField: 'pt_status',
        type: 'varchar',
      },
      b564701815de30dc3b1bd175dfa3fd1953bbe834: {
        prismaField: 'pt_tipo_de_processo',
        type: 'varchar',
      },
      '9aeb273879deff7c320c463a0f89a0830fa2d91d': {
        prismaField: 'pt_requerente',
        type: 'varchar',
      },
      ceeab9fbabcdb8482500cc527a1a10dbddf1349d: {
        prismaField: 'pt_local_de_envio',
        type: 'varchar',
      },
      '87eece434f1a3ef06004d89c024d5024d990c0a4': {
        prismaField: 'pt_dia_do_envio',
        type: 'date',
      },
      d7f10d5bfb0dfe07b7c6265d3a5f2cc30b946331: {
        prismaField: 'pt_senha',
        type: 'varchar',
      },
      be9a4c24235319010196b9daf5fc916ddb0eef7f: {
        prismaField: 'pt_data_da_trava',
        type: 'date',
      },
      '0c95a278d80dc679b057d24d1fba48c647c40f80': {
        prismaField: 'pt_link_sobre_trava',
        type: 'varchar',
      },
      '99905914a61afc3555bbdaf5d2272ad4a7a5500a': {
        prismaField: 'it_dashboard_do_cliente',
        type: 'varchar',
      },
      '6d255f2790a135c810d5604082776f836fa4d843': {
        prismaField: 'pt_status_portugues',
        type: 'enum',
      },
      dc598be29ce761ea8336a6836b559a89daabbd7c: {
        prismaField: 'pt_acesso_a_central',
        type: 'enum',
      },
      dad832746facd158da83a1b7f6ab486610873f4f: {
        prismaField: 'pt_atr_em_andamento',
        type: 'varchar',
      },
      '102422eb33fd58a5da39d89a17c009c0cb51024d': {
        prismaField: 'pt_tag_sensibilidade',
        type: 'enum',
      },
    };

    // @TODO: Add deal field mapping
    // this.dealFieldMapping = { ... };
  }

  getMappingFor(entityType: 'person' | 'organization' | 'deal'): EntityMapping {
    switch (entityType) {
      case 'person':
        return this.personFieldMapping;
      case 'organization':
        return this.orgFieldMapping;
      case 'deal':
        return this.dealFieldMapping;
      default:
        return {};
    }
  }
}
