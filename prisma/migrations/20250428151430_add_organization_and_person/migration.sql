-- CreateTable
CREATE TABLE `persons` (
    `add_time` DATETIME(3) NULL,
    `first_name` VARCHAR(191) NULL,
    `pipedrive_id` INTEGER NOT NULL,
    `label_ids` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `org_id` INTEGER NULL,
    `owner_id` INTEGER NULL,
    `update_time` DATETIME(3) NULL,
    `visible_to` VARCHAR(191) NULL,
    `birthday` DATETIME(3) NULL,
    `postal_address` VARCHAR(191) NULL,
    `is_returning` VARCHAR(191) NULL,
    `origem` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `link_guru` VARCHAR(191) NULL,
    `id_huggy` VARCHAR(191) NULL,
    `agente_familia_responsavel` JSON NULL,
    `transcricao_de_casamento` VARCHAR(191) NULL,
    `motivo_de_entrada_na_loja` JSON NULL,
    `numero_de_assento` VARCHAR(191) NULL,
    `infos_alinhamento` TEXT NULL,
    `job_title` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `organizationId` INTEGER NULL,

    INDEX `persons_owner_id_idx`(`owner_id`),
    INDEX `persons_org_id_idx`(`org_id`),
    PRIMARY KEY (`pipedrive_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organizations` (
    `add_time` DATETIME(3) NULL,
    `id` INTEGER NOT NULL,
    `label_ids` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `owner_id` INTEGER NULL,
    `update_time` DATETIME(3) NULL,
    `visible_to` VARCHAR(191) NULL,
    `pt_status` VARCHAR(191) NULL,
    `pt_tipo_de_processo` VARCHAR(191) NULL,
    `pt_requerente` VARCHAR(191) NULL,
    `pt_local_de_envio` VARCHAR(191) NULL,
    `pt_dia_do_envio` DATETIME(3) NULL,
    `pt_senha` VARCHAR(191) NULL,
    `pt_data_da_trava` DATETIME(3) NULL,
    `pt_link_sobre_trava` VARCHAR(191) NULL,
    `it_dashboard_do_cliente` VARCHAR(191) NULL,
    `pt_status_portugues` VARCHAR(191) NULL,
    `pt_acesso_a_central` VARCHAR(191) NULL,
    `pt_atr_em_andamento` VARCHAR(191) NULL,
    `pt_tag_sensibilidade` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `person_emails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NULL,
    `value` VARCHAR(191) NOT NULL,
    `primary` BOOLEAN NOT NULL DEFAULT false,
    `person_pipedrive_id` INTEGER NOT NULL,

    INDEX `person_emails_person_pipedrive_id_idx`(`person_pipedrive_id`),
    INDEX `person_emails_value_idx`(`value`),
    UNIQUE INDEX `person_emails_person_pipedrive_id_value_key`(`person_pipedrive_id`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `person_phones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NULL,
    `value` VARCHAR(191) NOT NULL,
    `primary` BOOLEAN NOT NULL DEFAULT false,
    `person_pipedrive_id` INTEGER NOT NULL,

    INDEX `person_phones_person_pipedrive_id_idx`(`person_pipedrive_id`),
    INDEX `person_phones_value_idx`(`value`),
    UNIQUE INDEX `person_phones_person_pipedrive_id_value_key`(`person_pipedrive_id`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
