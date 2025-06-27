-- AlterTable
ALTER TABLE `deals` ADD COLUMN `inside_data_pego` DATETIME(3) NULL,
    ADD COLUMN `rmkt_renan` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `persons` ADD COLUMN `campo_indicacao` VARCHAR(191) NULL,
    ADD COLUMN `form_de_atualizacao_embaixador` VARCHAR(191) NULL,
    ADD COLUMN `id_buzzlead` VARCHAR(191) NULL;
