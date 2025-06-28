/*
  Warnings:

  - You are about to drop the column `pipeline` on the `deals` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `deals_pipeline_idx` ON `deals`;

-- AlterTable
ALTER TABLE `deals` DROP COLUMN `pipeline`,
    ADD COLUMN `pipeline_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `pipelines` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `url_title` VARCHAR(191) NULL,
    `order_nr` INTEGER NULL,
    `active_flag` BOOLEAN NULL,
    `deal_probability` BOOLEAN NULL,
    `add_time` DATETIME(3) NULL,
    `update_time` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `sync_status` VARCHAR(191) NULL DEFAULT 'synced',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stages` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `order_nr` INTEGER NULL,
    `active_flag` BOOLEAN NULL,
    `deal_probability` INTEGER NULL,
    `rotten_flag` BOOLEAN NULL,
    `rotten_days` INTEGER NULL,
    `add_time` DATETIME(3) NULL,
    `update_time` DATETIME(3) NULL,
    `pipeline_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `sync_status` VARCHAR(191) NULL DEFAULT 'synced',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `deals_pipeline_id_idx` ON `deals`(`pipeline_id`);
